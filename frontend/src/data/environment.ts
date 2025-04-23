const base_url = "http://127.0.0.1:5000";
const apiEndpoints = {
  login: `${base_url}/login`,
  register: `${base_url}/register`,
  car: `${base_url}/car`,
  bookingSummary: `${base_url}/booking/summary`,
  bookingConfirm: `${base_url}/booking/confirm`,
  search: `${base_url}/search/cars`,
  bookingHistory: `${base_url}/booking/history`, // New endpoint added here
  reviews: `${base_url}//reviews/user`
};

export default apiEndpoints;