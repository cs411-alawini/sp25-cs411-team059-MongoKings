# from flask import Blueprint, request, jsonify
# from extensions import db

# booking_history_blueprint = Blueprint("booking_delete", __name__)

# @booking_history_blueprint.route("/booking/delete", methods=["POST"])
# def get_user_bookings():
#     data = request.get_json()
#     customer_id = data.get("customer_id")
#     if not customer_id:
#         return jsonify({"message": "Missing required parameter: customer_id"}), 400

#     connection = db.engine.raw_connection()
#     cursor = connection.cursor()

#     try:
#         cursor.execute("""
#             DELETE FROM Booking_Reservations where Booking_Id = %s """, (booking_id,))
#     except Exception as e:
#         return jsonify({"message": f"Failed to retrieve booking history: {str(e)}"}), 500
#     finally:
#         cursor.close()
#         connection.close()
