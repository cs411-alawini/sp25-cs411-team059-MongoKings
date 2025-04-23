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
    searchTerm = searchTerm.lower()
    print(f"Search term: {searchTerm}")
    # return jsonify([
    #         {
    #     "Car_Id": 5105,
    #     "City": "Hillsborough",
    #     "Daily_Price": 118,
    #     "FuelType": "ELECTRIC",
    #     "Number_of_trips": 20,
    #     "State": "CA",
    #     "Vehicle_Make": "Tesla",
    #     "Vehicle_Model": "Model S",
    #     "Vehicle_Type": "car",
    #     "Vehicle_Year": 2017
    # },
    # {
    #     "Car_Id": 14585,
    #     "City": "Vestavia Hills",
    #     "Daily_Price": 43,
    #     "FuelType": "GASOLINE",
    #     "Number_of_trips": 6,
    #     "State": "AL",
    #     "Vehicle_Make": "Lexus",
    #     "Vehicle_Model": "RX 350",
    #     "Vehicle_Type": "suv",
    #     "Vehicle_Year": 2008
    # }
    # ])

