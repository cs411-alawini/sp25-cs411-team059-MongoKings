from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text


car_blueprint = Blueprint("car", __name__)

@car_blueprint.route("/car", methods=["GET"])
def car_by_state():
    cars = db.session.execute(text("SELECT * from Car_Rental_Info"))
    result = []
    for car in cars:
        Car_Id, FuelType, State, City, Vehicle_Year, Number_of_trips, Vehicle_Type, Vehicle_Make, Vehicle_Model, Daily_Price = car
        result.append({
            "Car_Id": Car_Id,
            "FuelType": FuelType,
            "State": State,
            "City": City, 
            "Vehicle_Year": Vehicle_Year,
            "Number_of_trips": Number_of_trips,
            "Vehicle_Type": Vehicle_Type,
            "Vehicle_Make": Vehicle_Make,
            "Vehicle_Model": Vehicle_Model,
            "Daily_Price": Daily_Price
        })
    return jsonify(result), 200
