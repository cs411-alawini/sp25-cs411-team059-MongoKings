from extensions import db
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text


auth_blueprint = Blueprint("auth", __name__)

import random

@auth_blueprint.route("/register", methods=["POST"])
def register_customer():
    data = request.get_json()
    if not data:
        return {"message": "Invalid input"}, 400

    try:
        name = data.get("name")
        phone = data.get("phone")
        state = data.get("state")
        age = data.get("age")

        if not all([name, phone, state, age]):
            return {"message": "Missing required fields"}, 400


        max_attempts = 20
        customer_id = None
        for _ in range(max_attempts):
            temp_id = random.randint(100000, 999999)
            existing = db.session.execute(
                text("SELECT 1 FROM Customer_Info WHERE Customer_Id = :cid"),
                {"cid": temp_id}
            ).fetchone()
            if not existing:
                customer_id = temp_id
                break

        if not customer_id:
            return {"message": "Could not generate unique Customer ID"}, 500

        db.session.execute(
            text("""
                INSERT INTO Customer_Info
                VALUES (:customer_id, :name, :phone, :state, :age, 0)
            """),
            {
                "customer_id": customer_id,
                "name": name,
                "phone": phone,
                "state": state,
                "age": age,
            }
        )
        db.session.commit()

        return jsonify({
            "message": "Customer registered successfully",
            "customer_id": customer_id,
            "name": name,
            "phone": phone,
            "state": state,
            "age": age,
            "number_of_rentals": 0
        }), 201

    except IntegrityError:
        db.session.rollback()
        return {"message": "Database integrity error"}, 400
    except Exception as e:
        db.session.rollback()
        return {"message": f"An error occurred: {str(e)}"}, 500

@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return {"message": "Invalid input"}, 400
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return {"message": "Invalid input"}, 400
    user = db.session.execute(
        text("SELECT * FROM Customer_Info WHERE Name = :username AND Phone = :password"),
        {
            "username": username,
            "password": password
        }
    ).fetchone()
    if not user:
        print(user)
        return {"message": "Invalid user"}, 400
    return jsonify({
        "customer_id": user.Customer_Id,
        "name": user.Name,
        "phone": user.Phone,
        "state": user.State,
        "age": user.age,
        "number_of_rentals": user.Number_of_Rentals
    }), 200