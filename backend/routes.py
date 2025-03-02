from flask import Blueprint, request, jsonify
from models import User,db,bcrypt
from flask_jwt_extended import create_access_token
from flask_cors import CORS
from flask_mail import Message
import random
from extensions import mail 
from pypdf import PdfReader
from google import genai
from 


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
    if "pdfFile" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400

    userpdf = request.files["pdfFile"]
    user_filename = request.form.get("fileName")

    try:
        reader = PdfReader(userpdf)
        num_pages = len(reader.pages)
        all_text = ""
        for i in range(num_pages): 
            page_text = reader.pages[i].extract_text()
            if page_text:
                all_text += f"Page {i+1}:\n{page_text}\n\n"

        api_key = request.headers.get('Authorization')
        if not api_key:
            return jsonify({'error': 'API key is missing'}), 401

        if api_key.startswith("Bearer "):
            api_key = api_key.split("Bearer ")[1]


        client=genai.Client(api_key=api_key)
        model_response = client.models.generate_content( model="gemini-2.0-flash",contents="generate question based on the syllabus  2 mark  and 10 questions only not other information are aligned line by line"+all_text)
        model_output = model_response.text

    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"message": "error", "error": str(e)}), 500
