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
            return {"message": "No similar search choices are provided here"}, 404
        
        car_data = []
        for car_val in car_:
            car_data.append({
                "State": car_val[0],
                "Car_Id": booking[1],
                "Daily_Price": booking[2],
                "Fuel_Type": booking[3],
                "Average_Rating": booking[4],
                "Rating_Description": float(booking[5])
            })
            
        return jsonify({
            "results": car_data,
            "count": len(car_data)
        }), 200
            
    except Exception as e:
        return {"message": f"Failed to retrieve booking history: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()

