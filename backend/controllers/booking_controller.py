from flask import Blueprint, request, jsonify
from extensions import db
import random

booking_blueprint = Blueprint("booking", __name__)

# Endpoint to get booking summary and payment details
@booking_blueprint.route("/booking/summary", methods=["POST"])
def booking_summary():
    data = request.get_json()
    if not data:
        return {"message": "Invalid input"}, 400

    customer_id = data.get("customer_id")
    car_id = data.get("car_id")

    if not customer_id or not car_id:
        return {"message": "Missing customer_id or car_id"}, 400

    connection = db.engine.raw_connection()  # Low-level DB connection
    cursor = connection.cursor()

    try:
        # Set Isolation Level and Begin Transaction
        cursor.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE")
        cursor.execute("BEGIN")

        # Query 1: Get Total Payment for Booking
        cursor.execute("""
            SELECT 
                br.Booking_Id, 
                ci.Name AS Customer_Name, 
                ci.Customer_Id, 
                cri.State, 
                (br.Booking_Duration * cri.Daily_Price) AS Rental_Cost,
                (
                    (br.Booking_Duration * cri.Daily_Price) + 
                    100 * COALESCE((
                        SELECT 1 
                        FROM Car_Theft sub_ct 
                        WHERE cri.State = sub_ct.State 
                        GROUP BY sub_ct.State
                        HAVING AVG(sub_ct.Number_Thefts) > 25
                    ), 0)
                ) + (
                    SELECT id.Insurance_Val 
                    FROM Insurance_Detail id 
                    WHERE id.Age = ci.Age
                ) AS Total_Payment,
                (
                    SELECT id.Insurance_Val 
                    FROM Insurance_Detail id 
                    WHERE id.Age = ci.Age
                ) AS Insurance_Val  
            FROM Booking_Reservations br
            JOIN Car_Rental_Info cri ON br.Car_Id = cri.Car_Id
            JOIN Customer_Info ci ON br.Customer_Id = ci.Customer_Id
            WHERE ci.Customer_Id = %s
            LIMIT 1
        """, (customer_id,))
        
        total_result = cursor.fetchone()

        if not total_result:
            connection.rollback()
            return {"message": "No booking found for customer"}, 404

        # Query 2: Get Discount Price for Customer
        cursor.execute("""
            SELECT  
                car.Daily_Price * (
                    1 - 0.09 * EXISTS (
                        SELECT 1 
                        FROM Booking_Reservations b 
                        WHERE b.Customer_Id = c.Customer_Id 
                          AND b.Car_Id = car.Car_Id 
                          AND b.Booking_Duration > 5
                    )
                ) AS Discount_Price 
            FROM Customer_Info c
            LEFT JOIN Booking_Reservations br ON c.Customer_Id = br.Customer_Id 
            LEFT JOIN Car_Rental_Info car ON car.Car_Id = br.Car_Id 
            WHERE car.Car_Id = %s  
              AND c.Customer_Id = %s 
              AND c.Number_of_Rentals > 1
            LIMIT 1
        """, (car_id, customer_id))

        discount_result = cursor.fetchone()

        # Commit transaction
        connection.commit()

        # Return response with the result
        return jsonify({
            "booking_id": total_result[0],
            "customer_id": total_result[2],
            "customer_name": total_result[1],
            "state": total_result[3],
            "rental_cost": float(total_result[4]),
            "insurance_val": float(total_result[6]),
            "total_payment": float(total_result[5]),
            "discount_price": float(discount_result[0]) if discount_result else None
        }), 200

    except Exception as e:
        connection.rollback()  # Rollback in case of error
        return {"message": f"Transaction failed: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()
