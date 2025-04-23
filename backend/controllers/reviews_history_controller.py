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
        # Query to get all reviews given by the customer
        cursor.execute("""
            SELECT 
                rr.Booking_Id,
                rr.Rating_Stars,
                rr.Review,
                rr.Date_published,
                rr.Date_modified
            FROM 
                Rating_and_Reviews rr
            JOIN 
                Booking_Reservations br ON rr.Booking_Id = br.Booking_Id
            WHERE 
                br.Customer_Id = %s
            ORDER BY
                rr.Date_published DESC
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
            
    except Exception as e:
        return {"message": f"Failed to retrieve user reviews: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()