interface Review {
    booking_id: number;
    car_id?: number;
    vehicle_make?: string;
    vehicle_model?: string;
    rating: number;
    review_text: string;
    published_date: string;
    modified_date: string;
  }
export default Review;