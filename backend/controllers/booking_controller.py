from extensions import db
from flask import Blueprint
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text

booking_blueprint = Blueprint("booking", __name__)

@booking_blueprint.route("/greet", methods=["GET"])
def greet():
    try:
        bookings = db.session.execute(
            text(
                "SELECT * FROM Booking_Reservations"
            ),
        )
        for row in bookings:
            print(row)
    except IntegrityError:
        return {
            "message": "error",
        }, 400
    return {"message": "success"}, 201
