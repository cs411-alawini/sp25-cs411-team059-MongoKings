interface Booking {
    booking_id: number;
    car_id: number;
    duration: number;
    start_date: string;
    end_date: string;
    payment: number;
    vehicle_make?: string;
    vehicle_model?: string;
    review?: {
      rating: number;
      review_text: string;
      published_date: string;
      modified_date: string;
    } | null;
  }

export default Booking;