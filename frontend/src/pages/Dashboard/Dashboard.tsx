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

  // const fetchReviews = async () => {
  //   if (!user?.customer_id) return;
    
  //   setIsLoadingReviews(true);
  //   setReviewError(null);
    
  //   try {
  //     const response = await fetch(`${apiEndpoints.bookingHistory}?customer_id=${user.customer_id}`, {
  //       method: "GET",
  //       headers: { 
  //         "Content-Type": "application/json",
  //         // Add authorization header if needed
  //       }
  //     });
      
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch reviews");
  //     }
      
  //     const data = await response.json();
      
  //     // Filter bookings to get only those with reviews
  //     const reviewsData = data.bookings
  //       .filter((booking: Booking) => booking.review)
  //       .map((booking: Booking) => ({
  //         booking_id: booking.booking_id,
  //         car_id: booking.car_id,
  //         vehicle_make: booking.vehicle_make,
  //         vehicle_model: booking.vehicle_model,
  //         rating_stars: booking.review?.rating || 0,
  //         review: booking.review?.review_text || "",
  //         date_published: booking.review?.published_date || "",
  //         date_modified: booking.review?.modified_date || ""
  //       }));
      
  //     setReviews(reviewsData);
  //   } catch (err) {
  //     console.error("Error fetching reviews:", err);
  //     setReviewError("Failed to load your reviews. Please try again later.");
  //   } finally {
  //     setIsLoadingReviews(false);
  //   }
  // };

  const getCarDetails = (carId: number) => {
    return cars.find(car => car.Car_Id === carId) || null;
  };


  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearchModalOpen(true);
  };
  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsSearchModalOpen(true);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters);
    setShowResults(true);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLoginButtonClick = () => {
    setShowLoginPage(true);
  };
  // const handleDeleteBooking = (id) => {
  //   setBookings(bookings.filter(booking => booking.id !== id));
  // };

  // const handleEditBooking = (id) => {
  //   // Edit booking logic here
  //   console.log(`Editing booking ${id}`);
  // };

  // When user state changes and we have a user, return to homepage
  useEffect(() => {
    if (user) {
      setShowLoginPage(false);
      fetchBookingHistory();
      // fetchReviews();
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

  const handleEditBooking = (bookingId: number, carId: string) => {
    navigate(`/dashboard/car/${carId}/edit/${bookingId}`);
  };

  function handleDeleteBooking(id: number): void {
    throw new Error("Function not implemented.");
  }

  function onEdit(booking: any): void {
    const today = new Date();
    const startDate = new Date(booking.start_date);
    if (today >= startDate) {
      alert("You can't edit this booking because it has already started or is in the past.");
      return;
  }
  }

  function onDelete(booking: any): void {
    const today = new Date();
    const startDate = new Date(booking.start_date);
    if (today >= startDate) {
      alert("You can't edit this booking because it has already started or is in the past.");
      return;
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
                      <Dropdown.Item key={index} onClick={function() {
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



          {/* Popular in New York */}
          <section className="popular-section">
            <h2>Popular in New York</h2>
            <div className="time-filters">
              <button
                className={`time-filter ${activeTime === 'all' ? 'active-filter' : ''}`}
                onClick={() => setActiveTime('all')}
              >
                All
              </button>
              <button
                className={`time-filter ${activeTime === 'today' ? 'active-filter' : ''}`}
                onClick={() => setActiveTime('today')}
              >
                Today
              </button>
              <button
                className={`time-filter ${activeTime === 'tomorrow' ? 'active-filter' : ''}`}
                onClick={() => setActiveTime('tomorrow')}
              >
                Tomorrow
              </button>
              <button
                className={`time-filter ${activeTime === 'this-week' ? 'active-filter' : ''}`}
                onClick={() => setActiveTime('this-week')}
              >
                This week
              </button>
              <button
                className={`time-filter ${activeTime === 'next-week' ? 'active-filter' : ''}`}
                onClick={() => setActiveTime('next-week')}
              >
                Next week
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
            <h2 className="text-center">Previous Bookings</h2>
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
                      {booking.start_date} - {booking.end_date} (ID: {booking.car_id})
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

                    {booking.review && (
                      <>
                        <div className="mb-2 text-warning" style={{ fontSize: '1.2rem' }}>
                          {'★'.repeat(booking.review.rating)}
                          {'☆'.repeat(5 - booking.review.rating)}
                        </div>
                        <Card.Text>"{booking.review.review_text}"</Card.Text>
                      </>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onEdit(booking)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(booking)}
                      >
                        Delete
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
<section className="previous-reviews-section">
  <div className="reviews-header">
    <h2>Previous Reviews</h2>
  </div>
  {isLoadingReviews ? (
    <div className="loading-reviews">
      <p>Loading your reviews...</p>
    </div>
  ) : reviewError ? (
    <div className="review-error">
      <p>{reviewError}</p>
    </div>
  ) : reviews.length === 0 ? (
    <div className="no-reviews-message">
      <p>No previous reviews found</p>
    </div>
  ) : (
    <div className="reviews-grid">
      {reviews.map(review => (
        <div key={review.booking_id} className="review-card">
          <div className="review-info">
            <h3 className="review-car-info">
              {review.vehicle_make} {review.vehicle_model}
            </h3>
            <div className="review-rating">
              {'★'.repeat(review.rating_stars)}{'☆'.repeat(5 - review.rating_stars)}
            </div>
            <div className="review-text">
              <p>{review.review}</p>
            </div>
            <div className="review-date">
              <span>Posted on: {review.date_published}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
        </main>
      )}
    </div>
  );
};

export default Dashboard;