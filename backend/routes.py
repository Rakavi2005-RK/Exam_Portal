from flask import Blueprint, request, jsonify,send_file,Response
from models import User,db,bcrypt
from flask_jwt_extended import create_access_token
from flask_cors import CORS
from flask_mail import Message
import random
import json
from extensions import mail 
from pypdf import PdfReader
import google.generativeai as genai
from reportlab.platypus import  SimpleDocTemplate,Paragraph,PageBreak,Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from io import BytesIO



routes = Blueprint("routes", __name__)
CORS(routes)

otp_storage = {}


@routes.route("/Signup", methods=["POST"])
def Signup():
    data = request.get_json()
    username, email, password = data["fullname"], data["email"], data["password"]

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "User registered successfully"}), 201


@routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        token = create_access_token(identity=user.id)
        return jsonify({"success": True, "message": "Login successful", "token": token})

    return jsonify({"success": False, "error": "Invalid credentials"}), 401


@routes.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get("email")
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email not registered!"}), 400

    otp = str(random.randint(100000, 999999))
    otp_storage[email] = otp
    msg = Message("Password Reset OTP", sender="tthaaimadi@gmail.com", recipients=[email])
    msg.body = f"Your OTP for password reset is: {otp}"
    
    try:
        mail.send(msg)  
    except Exception as e:
        return jsonify({"error": "Failed to send email", "details": str(e)}), 500

    return jsonify({"message": "OTP sent successfully!"})

@routes.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    if email not in otp_storage or otp_storage[email] != otp:
        return jsonify({"message": "Invalid OTP"}), 400

    del otp_storage[email]  
    return jsonify({"message": "OTP verified successfully"}), 200


@routes.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get("email")
    new_password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found!"}), 400

    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.password_hash= hashed_password
    db.session.commit()

    return jsonify({"message": "Password reset successful!"}),200

    
@routes.route("/Pdffile", methods=["POST"])

def pdf_file():
    q_type={}
    if "pdfFile" not in request.files:
        return Response(f"No file uploaded",status=400,mimetype="text/plain")
    

    userpdf = request.files["pdfFile"]
    user_filename = request.form.get("fileName")
    difficulty=request.form.get("difficulty")
    newItems_json=request.form.get("newItems","[]")
    try:
        newItems = json.loads(newItems_json)
    except json.JSONDecodeError:
        return Response("Invalid JSON data", status=400, mimetype="text/plain")
    # checking the empty file
    try:
        reader = PdfReader(userpdf)
        num_pages = len(reader.pages)
        if(num_pages==0):
             return Response(f"the file is empty",status=400,mimetype="text/plain")
        all_text = ""
        for i in range(num_pages): 
            page_text = reader.pages[i].extract_text()
            if page_text:
                all_text += f"Page {i+1}:\n{page_text}\n\n"

        api_key = request.headers.get('Authorization')
        if not api_key:
            return Response(f"Error : API key is missing",status=401,mimetype="text/plain")

        if api_key.startswith("Bearer "):
            api_key = api_key.split("Bearer ")[1]

        try:
            genai.configure(api_key=api_key)
            model=genai.GenerativeModel("gemini-1.5-flash")
            model_response = model.generate_content(contents = (
                f"Generate questions strictly based on the syllabus content provided below with {difficulty} to the syllabus"
                f"Each question should be categorized by its corresponding mark allocation. "
                f"The following structure defines the number of questions for each mark category: {newItems_json}. "
                f"Format the output with a heading indicating the marks for each set of questions with bold letters . "
                f"Ensure all questions are relevant to the syllabus and do not include any additional information. "
                f"\n\nSyllabus Content:\n{all_text}"
                f"provide the title first for the syllabus\n"))

            model_output = model_response.text if hasattr(model_response, "text") else None

            if not model_output or model_output.strip() == "":
                return Response("AI model did not generate any content", status=500, mimetype="text/plain")
        except Exception as e:
                return Response(f"Google AI Error: {str(e)}", status=500, mimetype="text/plain")

        # converting the text to document
        
        buffer=BytesIO()
        doc=SimpleDocTemplate(buffer,pagesize=A4)
        styles=getSampleStyleSheet()
        story = []
        questions_list = model_output.strip().split("\n")
        for question in questions_list:
            if question.strip():  
                story.append(Paragraph(question.strip(), styles["Normal"]))  
                story.append(Spacer(1, 12))  

        doc.build(story)
        if(buffer.getvalue()==b""):
            return Response(f"sorry",status=404,mimetype="text/plain")
        
        buffer.seek(0) 
        return send_file(buffer, mimetype="application/pdf")

    except Exception as e:
        print(f"Error: {e}") 
        return Response(f"Error {str(e)}",status=500 ,mimetype="text/plain")
