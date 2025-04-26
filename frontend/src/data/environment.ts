const base_url = "http://127.0.0.1:5000";
const apiEndpoints = {
  login: `${base_url}/login`,
  register: `${base_url}/register`,
  car: `${base_url}/car`,
  bookingSummary: `${base_url}/booking/summary`,
  bookingConfirm: `${base_url}/booking/confirm`,
  search: `${base_url}/search/cars`,
  bookingHistory: `${base_url}/booking/history`, 
  reviews: `${base_url}/reviews/user`,
  delete_booking : `${base_url}/booking/delete`,
  add_review: `${base_url}/reviews/add`,
  edit_booking: `${base_url}/booking/edit`,
  edit_booking_confirm: `${base_url}/booking/edit-confirm`,
  delete_review: `${base_url}/reviews/delete`
};

export default apiEndpoints;