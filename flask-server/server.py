from google.cloud.sql.connector import Connector
import sqlalchemy
import os
from flask import Flask, jsonify, request
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)

# Set up the database connection details
INSTANCE_CONNECTION = os.getenv('INSTANCE_CONNECTION')
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_NAME = 'MONGOKINGS'

# Connect to the database
connector = Connector()
def get_db_connection():
    conn = connector.connect(
        INSTANCE_CONNECTION,
        "pymysql",
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME
    )
    return conn

# Create Connection Pool
pool = sqlalchemy.create_engine(
    "mysql+pymysql://",
    creator=get_db_connection,
)



@app.route('/')
def index():
    return "MONGOKINGS API"

@app.route('/api/cars/<string:state>', methods=['GET'])
def get_cars(state):
    """
    Get all cars in a given state
    """
    try:
        with pool.connect() as db_conn:
            result = db_conn.execute(sqlalchemy.text("SELECT * FROM cars WHERE state = :state"), {"state": state})
            cars = result.fetchall()
            return jsonify(cars)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)

