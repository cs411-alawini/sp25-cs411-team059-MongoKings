import os
from flask import Flask
from extensions import db
from flask_cors import CORS
from google.cloud.sql.connector import Connector
from controllers.booking_controller import booking_blueprint
from controllers.auth_controller import auth_blueprint
from controllers.car_controller import car_blueprint
from controllers.search_bar_controller import search_bar_blueprint
from controllers.booking_history_controller import booking_history_blueprint

USER = "root"
PASSWORD = os.environ.get("DB_PASSWORD")
DATABASE_NAME = "MONGOKINGS"
PROJECT_ID = "MongoKings"
INSTANCE_NAME = "mongokings:us-central1:mongokings"

def create_app():
    app = Flask(__name__)
    cors_result = CORS(app, resources={r"/*": {"origins": "*"}})
    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://"
    connector = Connector()

    def get_connection():
        conn = connector.connect(
            INSTANCE_NAME,
            "pymysql",
            user=USER,
            password=PASSWORD,
            db=DATABASE_NAME,
            ip_type="public",
        )
        return conn

    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "creator": get_connection,
    }
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["FLASK_DEBUG"] = os.environ.get("FLASK_DEBUG")
    app.register_blueprint(booking_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(car_blueprint)
    app.register_blueprint(search_bar_blueprint)
    app.register_blueprint(booking_history_blueprint)
    db.init_app(app)
    return app