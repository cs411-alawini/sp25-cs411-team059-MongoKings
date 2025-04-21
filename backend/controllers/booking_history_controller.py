from flask import Blueprint, request, jsonify
from extensions import db

booking_history_blueprint = Blueprint("booking_history", __name__)

@booking_history_blueprint.route("/booking/history", methods=["GET"])
def get_user_bookings():
    # Get customer_id from request parameters
    customer_id = request.args.get("customer_id")
    
    if not customer_id:
        return {"message": "Missing required parameter: customer_id"}, 400
    
    connection = db.engine.raw_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            SELECT 
                Booking_Id,
                Booking_Duration,
                Car_Id,
                Booking_Start_Date as Start_date,
                Booking_End_Date as End_date,
                Payment
            FROM 
                Booking_Reservations
            WHERE 
                Customer_Id = %s
            ORDER BY 
                Booking_Start_Date DESC
            LIMIT 3
        """, (customer_id,))
        bookings = cursor.fetchall()
        
        if not bookings:
            return {"message": "No booking history found for this customer"}, 404
        
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
        return {"message": f"Failed to retrieve booking history: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()