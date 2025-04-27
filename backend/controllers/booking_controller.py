from flask import Blueprint, request, jsonify
from extensions import db
import random
from flask import session


# Here, we are using isolation level as serializable to prevent phantom reads, as over here, we can have a customer add a booking for particular dates and we want to prevent a other customer for booking for similar dates, we use a serializable isolation level to ensure that the transaction is isolated from other transactions until it is committed.

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



    cursor.execute("select DATEDIFF(%s, %s)", (end_date, start_date))
    booking_duration = cursor.fetchone()
    if not booking_duration or booking_duration[0] <= 0:
        print(booking_duration[0])
        connection.rollback()
        return {"message": "Invalid booking date range"}, 400
    duration = booking_duration[0]

    cursor.execute("""
            select * from Booking_Reservations
            where Car_Id = %s and not (
                end_date < %s OR start_date> %s
            )
        """, (car_id, start_date, end_date))
    if cursor.fetchone():
        connection.rollback()
        return {"message": "Car is not available for the selected dates"}, 409
    try:
        cursor.execute("start TRANSACTION")

        print(duration, car_id, customer_id)


        cursor.execute("""
    select 
        car.Daily_Price * (
            1 - 0.09 * EXISTS (
                select 1
                from Booking_Reservations b 
                where b.Customer_Id = c.Customer_Id 
                    and b.Car_Id = car.Car_Id 
                    and b.Booking_Duration >= 2)) AS Discount_Price 
    from Customer_Info c
    join Car_Rental_Info car ON car.Car_Id = %s
    where c.Customer_Id = %s
    and c.Number_of_Rentals >= 2;
""", (car_id, customer_id))

        discount_result = cursor.fetchone()
        print(discount_result)
        cursor.execute("""
    select
        ci.Name AS Customer_Name, 
        ci.Customer_Id, 
        cri.State, 
        (%s * %s) AS Rental_Cost,
        (100 * COALESCE((
                select 1
                from Car_Theft sub_ct 
                where cri.State = sub_ct.State 
                group by sub_ct.State
                having AVG(sub_ct.Number_Thefts) > 250
            ), 0)) as Theft_Insurance,
        (
            (%s * %s) + 
            100 * COALESCE((
                select 1
                from Car_Theft sub_ct 
                where cri.State = sub_ct.State 
                group by sub_ct.State
                having AVG(sub_ct.Number_Thefts) > 250
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



        if confirm:
            booking_id = None
            for _ in range(20):
                temp_id = random.randint(100000, 999999)
                cursor.execute("select * from Booking_Reservations where Booking_Id = %s", (temp_id,))
                if not cursor.fetchone():
                    booking_id = temp_id
                    break

            if not booking_id:
                connection.rollback()
                return {"message": "Unable to generate a unique Booking ID"}, 500

            cursor.execute("""
                insert into Booking_Reservations 
                    (Booking_Id, Customer_Id, Car_Id, start_date, end_date, Booking_Duration, Payment)
                values (%s, %s, %s, %s, %s, %s, %s)
            """, (
                booking_id,
                customer_id,
                car_id,
                start_date,
                end_date,
                duration,
                total_result[5]
            ))
        connection.commit()

        return jsonify({

    "customer_name": total_result[0],
    "customer_id": total_result[1],
    "total_payment": float(total_result[5]),
    "insurance_val": float(total_result[6]),
    "theft_insurance": float(total_result[4]),
    "discount_price": float(discount_result[0]) if discount_result else None, 
    "car_id": car_id,
    "booking_id": booking_id if confirm else None,
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