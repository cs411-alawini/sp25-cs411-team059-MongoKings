import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../services/Auth/AuthSlice";
import './styles.css';
import CarCard from "./CarCard";
import { selectCarList } from "../../services/Car/CarSelectors";
import { useNavigate } from "react-router-dom";
import { Dropdown, Form, FormControl } from "react-bootstrap";
import apiEndpoints from "../../data/environment";
import Car from "../../types/Car/Car";
import User from "../../types/Authentication/User";
import Booking from "../../types/Booking/Booking";
import Review from "../../types/Review/Review"
import DropdownItem from "../../types/Search/DropdownItem";
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
const Dashboard = () => {
  const [activeTime, setActiveTime] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('all-cars');
  const [isFilterPageOpen, setIsFilterPageOpen] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);  // Add this for reviews
  console.log({ reviews });
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);


  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const cars = useAppSelector(selectCarList);
  // We got the user here, 
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    console.log('Search input:', e.target.value);
    // searched_items = fetch by { searchTerm: e.target.value }
    const response = await fetch(apiEndpoints.search, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchTerm: e.target.value })
    });
    if (response.ok) {
      const data = await response.json();
      setDropdownItems(data);
      console.log('Dropdown items:', data);
    } else {
      setDropdownItems([]);
      console.error('Failed to fetch dropdown items');
    }
  };

  // console.log(cars)

  const fetchBookingHistory = async () => {
    // console.log("User in fetchBookingHistory:", user);
    const response = await fetch(apiEndpoints.bookingHistory, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: user?.customer_id
      })
    });

    if (response.ok) {
      const data = await response.json();
      setBookings(data.bookings || []);
    } else {
      const error = await response.json();
      alert(error.message || "Failed to fetch booking history.");
    }
  };

  const fetchReviews = async () => {
    if (!user?.customer_id) return;

    setIsLoadingReviews(true);
    setReviewError(null);

    try {
      const response = await fetch(`${apiEndpoints.reviews}?customer_id=${user.customer_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviewError("Failed to load your reviews. Please try again later.");
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (user) {
      setShowLoginPage(false);
      fetchBookingHistory();
      fetchReviews();
    }
  }, [user]);


  // Results page view
  const renderResultsPage = () => (
    <div className="results-container">
      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'your-bookings' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('your-bookings')}
        >
          Your Bookings
        </button>
        <button
          className={`tab ${activeTab === 'all-cars' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('all-cars')}
        >
          All Cars
        </button>
      </div>

    </div>
  );

  function onEdit(booking: any): void {
    const today = new Date();
    const startDate = new Date(booking.start_date);
    if (today >= startDate) {
      alert("You can't edit this booking because it has already started or is in the past.");
      return;
    }
    navigate(`edit/${booking.booking_id}`)
  }

  async function onDelete(booking: any): Promise<void> {
    const today = new Date();
    const startDate = new Date(booking.start_date);

    if (today >= startDate) {
      alert("You can't edit this booking because it has already started or is in the past.");
      return;
    }

    try {
      const response = await fetch(apiEndpoints.delete_booking, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: booking.booking_id })
      });

      if (response.ok) {
        alert(`Booking with ID ${booking.booking_id} has been successfully deleted.`);
        fetchBookingHistory();
        fetchReviews();
      } else {
        alert("Failed to delete the booking. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("An error occurred while deleting the booking.");
    }
  }

async function onAddReview(booking: any, rating: number, review: string): Promise<void> {
    try {
      const response = await fetch(apiEndpoints.add_review, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          booking_id: booking.booking_id, 
          rating: rating, 
          review: review 
        })
      });
      
      if (response.ok) {
        alert(`Booking with ID ${booking.booking_id} review has been added properly.`);
        fetchReviews();
      } else {
        alert("Failed to add the review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting the review");
    }
  }

// Add this function to handle review deletion
async function onDeleteReview(review: Review): Promise<void> {
  try {
    const response = await fetch(apiEndpoints.delete_review, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: review.booking_id })
    });
    
    if (response.ok) {
      alert(`Review for booking ID ${review.booking_id} has been successfully deleted.`);
      // Refresh the reviews list
      fetchReviews();
    } else {
      alert("Failed to delete the review. Please try again.");
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    alert("An error occurred while deleting the review.");
  }
}


  return (
    <div className="app-container">
      {/* Main Content */}
      {showResults ? (
        renderResultsPage()
      ) : (
        <main>
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-image">
              <img src="https://advertising.expedia.com/wp-content/uploads/2020/08/Car-Hero_1920x800.jpg" alt="Car Banner" />
            </div>
            <div className="hero-content">
              <h1>Discover the perfect ride for your journey.</h1>
              <div className="search-form-container">
                <Form>
                  <FormControl type="text" placeholder="Enter location or car model" value={searchInput} onChange={handleSearchChange} />
                </Form>
                {searchInput && (
                  <Dropdown.Menu show style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    marginTop: "3px",
                  }}
                  >
                    {dropdownItems.map((item, index) => (
                      <Dropdown.Item key={index} onClick={function () {
                        navigate(`/dashboard/car/${item.Car_Id}`); // Navigate to the car details page
                      }}>
                        {/* We will add a on click handler here to navigate to the car details page */}
                        {item.Car_Id} - {item.Fuel_Type} - ${item.Daily_Price} - {item.Rating_Description}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                )}
                {/* <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Enter location or car model"
                    value={searchInput}
                    onChange={handleSearchChange}
                  />
                  <button className="search-button">Search</button>
                </form> */}
              </div>
              <p>Book your ideal car with ease and convenience at the most competitive rates.</p>
            </div>
          </section>



     

          {/* Popular Nearby*/}
          <section className="popular-section">
            <h2>Popular Nearby</h2>
            <div className="time-filters">
              <button
                className={`time-filter ${activeTime === 'all' ? 'active-filter' : ''}`}
                onClick={() => setActiveTime('all')}
              >
              </button>
            </div>
            <div className="cars-grid">
              {cars.filter((car) => (car.State === user?.state)).slice(0, 10).map((car) => (
                <CarCard key={car.Car_Id} {...car} />
              ))}
            </div>
          </section>

          {/* Previous Bookings Section */}
          <section className="previous-bookings-section">
            <Container>
              <Row className="mb-4">
                <Col>
                  <h2 className="text-center">Booking History</h2>
                </Col>
              </Row>

              {isLoadingBookings ? (
                <Row className="justify-content-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading your booking history...</span>
                  </Spinner>
                </Row>
              ) : bookingError ? (
                <Alert variant="danger" className="text-center">
                  {bookingError}
                </Alert>
              ) : bookings.length === 0 ? (
                <Alert variant="info" className="text-center">
                  No previous bookings found
                </Alert>
              ) : (
                <Row xs={1} sm={2} md={3} className="g-4">
                  {bookings.map((booking) => (
                    <Col key={booking.booking_id}>
                      <Card>
                        <Card.Body>
                          <Card.Title>
                            {booking.start_date} - {booking.end_date} (ID: {booking.booking_id})
                          </Card.Title>

                          <div className="mb-2">
                            <strong>Start Date:</strong> {booking.start_date}
                          </div>
                          <div className="mb-2">
                            <strong>End Date:</strong> {booking.end_date}
                          </div>
                          <div className="mb-3">
                            <strong>Total Amount:</strong> ${booking.payment}
                          </div>

                          <div className="d-flex justify-content-between mt-4">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => onEdit(booking)}
                            >
                              Edit Booking
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => navigate(`review/${booking.booking_id}`)}
                            >
                              <i className="bi bi-chat-left-text me-1"></i>  Add Review
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => onDelete(booking)}
                            >
                              Delete Booking
                            </Button>
                          </div>

                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Container>
          </section>

          {/* Previous Reviews Section */}
          <section className="previous-reviews-section py-5 bg-light">
            <Container>
              <Row className="mb-4">
                <Col>
                  <h2 className="text-center fw-bold">Previous Reviews</h2>
                  <hr className="mx-auto" style={{ width: "60px", borderTop: "3px solid #ffc107" }} />
                </Col>
              </Row>

              {isLoadingReviews ? (
                <Row className="justify-content-center">
                  <Col xs="auto">
                    <Spinner animation="border" role="status" variant="warning">
                      <span className="visually-hidden">Loading your reviews...</span>
                    </Spinner>
                  </Col>
                </Row>
              ) : reviewError ? (
                <Row className="justify-content-center">
                  <Col md={6}>
                    <Alert variant="danger" className="text-center">
                      {reviewError}
                    </Alert>
                  </Col>
                </Row>
              ) : reviews.length === 0 ? (
                <Row className="justify-content-center">
                  <Col md={6}>
                    <Alert variant="info" className="text-center">
                      No previous reviews found.
                    </Alert>
                  </Col>
                </Row>
              ) : (
                <Row xs={1} sm={2} md={3} className="g-4">
                  {reviews.map(review => (
                    <Col key={review.booking_id}>
                      <Card className="h-100 shadow-sm border-0">
                        <Card.Body>
                          <div className="text-warning mb-2" style={{ fontSize: '1.3rem' }}>
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </div>
                          <Card.Text className="fst-italic">"{review.review_text}"</Card.Text>
                        </Card.Body>
                        <Card.Footer className="bg-transparent border-0 text-muted small">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div>Booking ID: <span className="fw-semibold">{review.booking_id}</span></div>
                              <div>
                                Posted on: {review.published_date}
                                {review.modified_date && review.modified_date !== review.published_date && (
                                  <> (Modified on: {review.modified_date})</>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => onDeleteReview(review)}
                            >
                              <i className="bi bi-trash me-1"></i> Delete
                            </Button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Container>
          </section>


        </main>
      )}
    </div>
  );
};

export default Dashboard;

