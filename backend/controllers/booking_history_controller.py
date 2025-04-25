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
        connection.commit()
    except Exception as e:
        return jsonify({"message": f"Failed to retrieve booking history: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()
    return jsonify({"message": "Booking deleted successfully"}), 200
