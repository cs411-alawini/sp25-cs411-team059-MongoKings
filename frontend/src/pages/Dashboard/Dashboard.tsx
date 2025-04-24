import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../services/Auth/AuthSlice";
import './styles.css';
import CarCard from "./CarCard";
import { selectCarList } from "../../services/Car/CarSelectors";
import { useNavigate } from "react-router-dom";
import { Dropdown, Form, FormControl } from "react-bootstrap";
import apiEndpoints from "../../data/environment";
import DropdownItem from "../../types/Search/DropdownItem";

const Dashboard = () => {
  const [activeTime, setActiveTime] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('all-cars');
  const [isFilterPageOpen, setIsFilterPageOpen] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const cars = useAppSelector(selectCarList);
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
    const data = await response.json();
    setDropdownItems(data);
    console.log('Dropdown items:', data);
  };

  // console.log(cars)

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
            <div className="bookings-header">
              <h2>Previous Bookings</h2>
            </div>
            {bookings.length === 0 ? (
              <div className="no-bookings-message">
                <p>No previous bookings found</p>
              </div>
            ) : (
              <div className="bookings-grid">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <img
                      src={booking.image}
                      alt={`Car ${booking.carId}`}
                      className="booking-image"
                    />
                    <div className="booking-info">
                      <h3 className="booking-car-id">{booking.carId}</h3>
                      <div className="booking-dates">
                        <div className="booking-date-item">
                          <span className="date-label">Start Date</span>
                          <span className="date-value">{booking.startDate}</span>
                        </div>
                        <div className="booking-date-item">
                          <span className="date-label">End Date</span>
                          <span className="date-value">{booking.endDate}</span>
                        </div>
                      </div>
                      <div className="booking-amount">
                        <span className="amount-label">Total Amount</span>
                        <span className="amount-value">{booking.totalAmount}</span>
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button
                        onClick={() => handleEditBooking(booking.id, booking.carId)}
                        className="edit-button"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
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