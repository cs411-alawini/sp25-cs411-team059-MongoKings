from flask import Blueprint, request, jsonify
from extensions import db

reviews_blueprint = Blueprint("reviews", __name__)
@reviews_blueprint.route("/reviews/user", methods=["GET"])
def get_user_reviews():
    # Get customer_id from request parameters
    customer_id = request.args.get("customer_id")
    
    if not customer_id:
        return {"message": "Missing required parameter: customer_id"}, 400
    
    connection = db.engine.raw_connection()
    cursor = connection.cursor()
    
    try:

        cursor.execute("""
            SELECT 
                rr.Booking_Id,
                rr.rating,
                rr.review,
                rr.date_published,
                rr.date_modified
            FROM 
                Rating_and_Reviews rr
            JOIN 
                Booking_Reservations br ON rr.Booking_Id = br.Booking_Id
            WHERE 
                br.Customer_Id = %s
            ORDER BY
                rr.date_published DESC
        """, (customer_id,))
        
        # Fetch all reviews
        reviews = cursor.fetchall()
        
        if not reviews:
            return {"message": "No reviews found for this customer"}, 404
        
        # Format the response
        user_reviews = []
        for review in reviews:
            user_reviews.append({
                "booking_id": review[0],
                "rating": float(review[1]) if review[1] else None,
                "review_text": review[2],
                "published_date": review[3].strftime("%Y-%m-%d") if review[3] else None,
                "modified_date": review[4].strftime("%Y-%m-%d") if review[4] else None
            })
            
        return jsonify({
            "customer_id": customer_id,
            "review_count": len(user_reviews),
            "reviews": user_reviews
        }), 200           
    except ValueError as e:
        print(e)
        return {"message": f"Failed to retrieve user reviews: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()

@reviews_blueprint.route("/reviews/car", methods=["GET"])
def get_car_reviews():
    car_id = request.args.get("car_id")

    if not car_id:
        return {"message": "Missing required parameter: car_id"}, 400
    
    connection = db.engine.raw_connection()
    cursor = connection.cursor()

    try:
        # Query to get all reviews for the car
        cursor.execute("""
            SELECT
                rr.Booking_Id,
                rr.rating,
                rr.review,
                rr.date_published,
                rr.date_modified
            FROM    
                Rating_and_Reviews rr
            JOIN
                Booking_Reservations br ON rr.Booking_Id = br.Booking_Id
            WHERE
                br.Car_Id = %s
            ORDER BY
                rr.date_published DESC  
        """, (car_id,))

        # Fetch all reviews
        reviews = cursor.fetchall() 

        if not reviews:
            return {"message": "No reviews found for this car"}, 404
        
        # Format the response
        car_reviews = []
        for review in reviews:
            car_reviews.append({
                "booking_id": review[0],
                "rating": float(review[1]) if review[1] else None,
                "review_text": review[2],
                "published_date": review[3].strftime("%Y-%m-%d") if review[3] else None,
                "modified_date": review[4].strftime("%Y-%m-%d") if review[4] else None
            })
        
        return jsonify({
            "car_id": car_id,
            "review_count": len(car_reviews),
            "reviews": car_reviews
        }), 200
    except Exception as e:
        return {"message": f"Failed to retrieve car reviews: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()


@reviews_blueprint.route("/reviews/add", methods=["POST"])
def add_user_review():
    data = request.get_json()

    if not data:
        return {"message": "Invalid input"}, 400
    print(data)
    booking_id = data.get("booking_id")
    rating = data.get("rating")
    review = data.get("review")

    if not booking_id or not rating or not review:
        return {"message": "Missing required fields"}, 400
    
    connection = db.engine.raw_connection()
    cursor = connection.cursor()        

    try:
        cursor.execute("""
            SELECT *
            FROM Booking_Reservations
            WHERE Booking_Id = %s
        """, (booking_id,))

        booking = cursor.fetchone()

        if not booking:
            return {"message": "Booking not found"}, 404    
        
        # Check if the review already exists
        # If review exists, update it
        # If review does not exist, insert it

        cursor.execute("""
            SELECT *
            FROM Rating_and_Reviews
            WHERE Booking_Id = %s
        """, (booking_id,))

        existing_review = cursor.fetchone()

        if existing_review:
            # Update the review
            cursor.execute("""
                UPDATE Rating_and_Reviews
                SET rating = %s, review = %s, date_modified = NOW()
                WHERE Booking_Id = %s
            """, (rating, review, booking_id))
        else:
            # Insert the review
            cursor.execute("""
                INSERT INTO Rating_and_Reviews (Booking_Id, rating, review, date_published)
                VALUES (%s, %s, %s, NOW())
            """, (booking_id, rating, review))

        connection.commit()

        return {"message": "Review added successfully"}, 200
    except Exception as e:
        connection.rollback()
        return {"message": f"Failed to add review: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()
    
    
    
