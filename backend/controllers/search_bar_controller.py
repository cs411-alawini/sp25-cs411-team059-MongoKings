from flask import Blueprint, request, jsonify
from extensions import db
import random
from flask import session


search_bar_blueprint = Blueprint("search_bar", __name__)

@search_bar_blueprint.route("/search/cars", methods=["POST"])
def search_car():
    data = request.get_json()
    if not data:
        return {"message": "Invalid input"}, 400
    searchTerm = data.get("searchTerm", "").strip()
    if not searchTerm:
        return {"message": "Search term is required"}, 400
    connection = db.engine.raw_connection()
    cursor = connection.cursor()
    try:
        cursor.callproc('SearchCarsWithRating_final_check', [searchTerm])
        car_  = cursor.fetchall()
        
        if not car_:
            return jsonify([]), 200
        
        car_data = []
        for car_val in car_:
            car_data.append({
                "State": car_val[0],
                "Car_Id": int(car_val[1]),
                "Daily_Price": int(car_val[2]),
                "Fuel_Type":car_val[3],
                "Average_Rating": car_val[4],
                "Rating_Description": car_val[5]
            })
            
        return jsonify(car_data), 200
            
    except Exception as e:
        print(e)
        return jsonify([]), 200
    finally:
        cursor.close()
        connection.close()

