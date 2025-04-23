from flask import Blueprint, request, jsonify
from extensions import db
import random
from flask import session


booking_blueprint = Blueprint("booking", __name__)

@booking_blueprint.route("/booking/summary", methods=["POST"])
def booking_summary():
    connection = db.engine.raw_connection()
    cursor = connection.cursor()
    cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE")
    data = request.get_json()
    if not data:
        return {"message": "Invalid input"}, 400

    car_id = data.get("car_id")
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    confirm = data.get("confirm", False)
    customer_id = data.get("customer_id")

    if not car_id or not start_date or not end_date or not customer_id:
        return {"message": "Missing required fields (customer_id, car_id, start_date, end_date)"}, 400



    cursor.execute("SELECT DATEDIFF(%s, %s)", (end_date, start_date))
    booking_duration = cursor.fetchone()
    if not booking_duration or booking_duration[0] <= 0:
        print(booking_duration[0])
        connection.rollback()
        return {"message": "Invalid booking date range"}, 400
    duration = booking_duration[0]

    cursor.execute("""
            SELECT 1 FROM Booking_Reservations
            WHERE Car_Id = %s AND NOT (
                end_date < %s OR start_date> %s
            )
        """, (car_id, start_date, end_date))
    if cursor.fetchone():
        connection.rollback()
        return {"message": "Car is not available for the selected dates"}, 409
    try:
        cursor.execute("START TRANSACTION")

        print(duration, car_id, customer_id)


        cursor.execute("""
    SELECT  
        car.Daily_Price * (
            1 - 0.09 * EXISTS (
                SELECT 1 
                FROM Booking_Reservations b 
                WHERE b.Customer_Id = c.Customer_Id 
                  AND b.Car_Id = car.Car_Id 
                  AND b.Booking_Duration >= 0)) AS Discount_Price 
    FROM Customer_Info c
    JOIN Car_Rental_Info car ON car.Car_Id = %s
    WHERE c.Customer_Id = %s
      AND c.Number_of_Rentals >= 0;
""", (car_id, customer_id))  # ← parameters go here

        discount_result = cursor.fetchone()
        print(discount_result)
        cursor.execute("""
    SELECT 
        ci.Name AS Customer_Name, 
        ci.Customer_Id, 
        cri.State, 
        (%s * %s) AS Rental_Cost,
        (
            (%s * %s) + 
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
    FROM Car_Rental_Info cri
    JOIN Customer_Info ci ON cri.Car_Id = %s 
    WHERE ci.Customer_Id = %s 
""", (discount_result, duration, discount_result, duration, car_id, customer_id))

        
        total_result = cursor.fetchone()
        print(total_result)
        if not total_result:
            connection.rollback()
            return {"message": "Unable to book"}, 404

        # if confirm:
        #     cursor.execute("""
        #         INSERT INTO Booking_Reservations 
        #             (Customer_Id, Car_Id, Booking_Start_Date, Booking_End_Date, Booking_Duration)
        #         VALUES (%s, %s, %s, %s, %s)
        #     """, (customer_id, car_id, start_date, end_date, duration))

        connection.commit()

        return jsonify({
                "message": "Booking confirmed!",
                "booking_id": total_result[0],
                "customer_id": total_result[2],
                "customer_name": total_result[1],
                "total_payment": float(total_result[5]),
                "discount_price": float(discount_result[0]) if discount_result else None
        }), 200

    except Exception as e:
        connection.rollback() 
        return {"message": f"Transaction failed: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()
@booking_blueprint.route("/booking/confirm", methods=["POST"])
def booking_confirm():

    request.json['confirm'] = True
    return booking_summary()