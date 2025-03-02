from flask import Flask
from config import Config
from extensions import mail 
from models import User,db,bcrypt 
from routes import routes
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
mail.init_app(app)

jwt = JWTManager(app)

app.register_blueprint(routes)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
