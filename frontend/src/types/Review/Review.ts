interface Review {
    booking_id: number;
    car_id?: number;
    vehicle_make?: string;
    vehicle_model?: string;
    rating_stars: number;
    review: string;
    date_published: string;
    date_modified: string;
  }
export default Review;