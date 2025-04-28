from flask import Blueprint, request, jsonify
from extensions import db

booking_history_blueprint = Blueprint("booking_history", __name__)

@booking_history_blueprint.route("/booking/history", methods=["POST"])
def get_user_bookings():
    data = request.get_json()
    customer_id = data.get("customer_id")

    if not customer_id:
        return jsonify({"message": "Missing required parameter: customer_id"}), 400

    connection = db.engine.raw_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            SELECT 
                Booking_Id,
                Booking_Duration,
                Car_Id,
                start_date,
                end_date,
                Payment
            FROM 
                Booking_Reservations
            WHERE 
                Customer_Id = %s
            ORDER BY 
                start_date DESC
        """, (customer_id,))
        bookings = cursor.fetchall()

        if not bookings:
            return jsonify({"message": "No booking history found for this customer"}), 404

        booking_history = []
        for booking in bookings:
            booking_history.append({
                "booking_id": booking[0],
                "duration": booking[1],
                "car_id": booking[2],
                "start_date": booking[3].strftime("%Y-%m-%d") if booking[3] else None,
                "end_date": booking[4].strftime("%Y-%m-%d") if booking[4] else None,
                "payment": float(booking[5]) if booking[5] else None
            })

        return jsonify({
            "customer_id": customer_id,
            "booking_count": len(booking_history),
            "bookings": booking_history
        }), 200

    except Exception as e:
        return jsonify({"message": f"Failed to retrieve booking history: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

@booking_history_blueprint.route("/booking/delete", methods=["POST"])
def get_delete_booking():
    data = request.get_json()
    booking_id = data.get("booking_id")
    if not booking_id:
        return jsonify({"message": "Missing required parameter: booking_id"}), 400

    connection = db.engine.raw_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            DELETE FROM Booking_Reservations where Booking_Id = %s """, (booking_id,))
        cursor.execute("""
            DELETE FROM Rating_and_Reviews where Booking_Id = %s """, (booking_id,))
            # If we delete the booking, we also delete the asosciated reviews,
        connection.commit()
    except Exception as e:
        return jsonify({"message": f"Failed to retrieve booking history: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify({"message": "Booking deleted successfully"}), 200



# Heere the edit booking is copy of the booking_controller with few changes

@booking_history_blueprint.route("/booking/edit", methods=["POST"])
def booking_edit_summary():
    connection = db.engine.raw_connection()
    cursor = connection.cursor()
    cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE")
    data = request.get_json()
    if not data:
        return {"message": "Invalid input"}, 400

    booking_id = data.get("booking_id")
    print(booking_id)
    print("Hi")
    new_start = data.get("start_date")
    new_end = data.get("end_date")
    confirm = data.get("confirm", False)

    if not booking_id or not new_start or not new_end:
        return {"message": "Missing required fields (booking_id, start_date, end_date)"}, 400

    cursor.execute("SELECT DATEDIFF(%s, %s)", (new_end, new_start))
    booking_duration = cursor.fetchone()
    if not booking_duration or booking_duration[0] <= 0:
        connection.rollback()
        return {"message": "Invalid booking date range"}, 400
    duration = booking_duration[0]


    cursor.execute("""
        SELECT Car_Id, Customer_Id FROM Booking_Reservations WHERE Booking_Id = %s
    """, (booking_id,))
    row = cursor.fetchone()
    if not row:
        connection.rollback()
        return {"message": "Booking not found"}, 404
    car_id, customer_id = row

    cursor.execute("""
        SELECT 1 FROM Booking_Reservations
        WHERE Car_Id = %s AND Booking_Id != %s
            AND NOT (end_date < %s OR start_date > %s)
    """, (car_id, booking_id, new_start, new_end))
    if cursor.fetchone():
        connection.rollback()
        return {"message": "Car is not available for the selected dates"}, 409

    try:
        cursor.execute("START TRANSACTION")

        cursor.execute("""
    SELECT  
        car.Daily_Price * (
            1 - 0.09 * EXISTS (
                SELECT 1 
                FROM Booking_Reservations b 
                WHERE b.Customer_Id = c.Customer_Id 
                    AND b.Car_Id = car.Car_Id 
                    AND b.Booking_Duration >= 2)) AS Discount_Price 
                FROM Customer_Info c
                JOIN Car_Rental_Info car ON car.Car_Id = %s
                WHERE c.Customer_Id = %s
                AND c.Number_of_Rentals >= 2;
            """, (car_id, customer_id))
        discount_result = cursor.fetchone()

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
                        HAVING AVG(sub_ct.Number_Thefts) > 250
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
        """, (discount_result[0], duration, discount_result[0], duration, car_id, customer_id))

        total_result = cursor.fetchone()
        if not total_result:
            connection.rollback()
            return {"message": "Unable to calculate updated booking"}, 404

        if confirm:
            cursor.execute("""
                UPDATE Booking_Reservations
                SET start_date = %s,
                    end_date = %s,
                    Booking_Duration = %s,
                    Payment = %s
                WHERE Booking_Id = %s
            """, (
                new_start,
                new_end,
                duration,
                total_result[4],  
                booking_id
            ))

        connection.commit()

        return jsonify({
            "customer_name": total_result[0],
            "customer_id": total_result[1],
            "total_payment": float(total_result[4]),
            "insurance_val": float(total_result[5]),
            "discount_price": float(discount_result[0]) if discount_result else None
        }), 200

    except Exception as e:
        connection.rollback()
        return {"message": f"Transaction failed: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()
@booking_history_blueprint.route("/booking/edit-confirm", methods=["POST"])
def booking_edit_confirm():
    request.json['confirm'] = True
    return booking_edit_summary()