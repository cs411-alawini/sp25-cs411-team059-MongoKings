import React, { useState, useEffect } from 'react';
import './styles.css'; // We'll create a separate CSS file
import Login from '../../frontend/src/pages/Login/Login.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../frontend/src/services/Auth/AuthSlice.ts';

const App = () => {
  const [activeTime, setActiveTime] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('all-cars');
  const [isFilterPageOpen, setIsFilterPageOpen] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  
  // Get user auth state from Redux store
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchModalOpen(true);
  };

  const handleApplyFilters = (filters) => {
    console.log('Applied filters:', filters);
    setShowResults(true);
    // Here you would filter car listings based on the selected filters
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLoginButtonClick = () => {
    setShowLoginPage(true);
  };

  // When user state changes and we have a user, return to homepage
  useEffect(() => {
    if (user) {
      setShowLoginPage(false);
    }
  }, [user]);

  const vehicleCategories = [
    { name: 'SUVs', icon: '🚙' },
    { name: 'Electric cars', icon: '⚡' },
    { name: 'Compact cars', icon: '🚗' },
    { name: 'Luxury cars', icon: '🏎️' },
    { name: 'Economy', icon: '💰' },
    { name: 'Motorcycles', icon: '🏍️' },
    // { name: 'Bicycles', icon: '🚲' },
    // { name: 'Parking spots', icon: '🅿️' }
  ];

  const popularCars = [
    { name: 'Electric Dream (ED)', location: 'Speedster Resorts', date: '17/09/2023, 8 AM', image: '/api/placeholder/250/150', action: 'Rent now' },
    { name: 'Turbo Thrust (CER)', location: 'Fuel Fast', date: '21/09/2023', image: '/api/placeholder/250/150', action: 'Rent now' },
    { name: 'Green Machine (FR)', location: 'City Carbon', date: '11/09/2023', image: '/api/placeholder/250/150', action: 'Rent now' },
    { name: 'Urban Glide (JPN)', location: 'Lorem Ipsum', date: '', image: '/api/placeholder/250/150', action: 'Rent now' }
  ];

  const carListings = [
    {
      id: 1,
      name: 'Luxury Sedan (Gasoline)',
      type: 'Sedan',
      fuelType: 'Gasoline',
      location: 'Downtown',
      date: '17/08/2023',
      rate: '$50/day',
      city: 'City Center',
      image: '/api/placeholder/250/250'
    },
    {
      id: 2,
      name: 'Electric SUV (Battery)',
      type: 'SUV',
      fuelType: 'Electric',
      location: 'Uptown',
      date: '18/08/2023',
      rate: '$65/day',
      city: 'Metro Area',
      image: '/api/placeholder/250/250'
    },
    {
      id: 3,
      name: 'Compact Hybrid',
      type: 'Compact',
      fuelType: 'Hybrid',
      location: 'Airport',
      date: '19/08/2023',
      rate: '$45/day',
      city: 'Airport Zone',
      image: '/api/placeholder/250/250'
    }
  ];

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

      {/* Car Listings */}
      <div className="car-listings">
        {carListings.map((car) => (
          <div key={car.id} className="car-listing-item">
            {/* Car Image */}
            <div className="car-image">
              <img src={car.image} alt={car.name} />
            </div>
            
            {/* Car Details */}
            <div className="car-details">
              <h3>{car.name}</h3>
              <p>{car.city} - {car.date}</p>
              <p className="car-rate">Rate: {car.rate}</p>
              <p>Location: {car.location}</p>
              
              {/* Right Arrow */}
              <div className="car-arrow">▶</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render the Login page if showLoginPage is true
  if (showLoginPage) {
    return <Login />;
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span>CarFlex</span>
        </div>
        
        {showResults ? (
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for rental car"
                value={searchInput}
                onChange={handleSearchChange}
              />
              <button 
                className="search-button"
                onClick={handleSearchSubmit}
              >
                Search
              </button>
            </div>
            <button className="nav-link">Available Cars</button>
            <button 
              className="nav-link"
              onClick={() => setIsFilterPageOpen(true)}
            >
              Filters
            </button>
            <button 
              className="filter-button"
              onClick={() => setIsFilterPageOpen(true)}
            >
              Filter
            </button>
          </div>
        ) : (
          <div className="nav-links">
            <form onSubmit={handleSearchSubmit}>
              <button className="nav-link">Search for rental</button>
            </form>
            <button 
              className="nav-link"
              onClick={() => setIsFilterPageOpen(true)}
            >
              Filter
            </button>
            {user ? (
              <div className="user-controls">
                <span className="welcome-message">Welcome, {user.username}</span>
                <button className="logout-button" onClick={handleLogout}>Log out</button>
              </div>
            ) : (
              <button className="login-button" onClick={handleLoginButtonClick}>Log in</button>
            )}
          </div>
        )}
      </header>

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
                <form onSubmit={handleSearchSubmit}>
                  <input 
                    type="text" 
                    placeholder="Enter location or car model" 
                    value={searchInput}
                    onChange={handleSearchChange}
                  />
                  <button className="search-button">Search</button>
                </form>
              </div>
              <p>Book your ideal car with ease and convenience at the most competitive rates.</p>
            </div>
          </section>

          {/* Vehicle Categories */}
          <section className="categories-section">
            <div className="categories-grid">
              {vehicleCategories.map((category, index) => (
                <button key={index} className="category-button">
                  <span className="category-icon">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
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
              {popularCars.map((car, index) => (
                <div key={index} className="car-card">
                  <div className="car-card-image">
                    <img src={car.image} alt={car.name} />
                    <button className="view-button">View</button>
                  </div>
                  <div className="car-card-details">
                    <h3>{car.name}</h3>
                    <p>{car.location} {car.date ? `- ${car.date}` : ''}</p>
                    <button className="rent-button">{car.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={() => setIsSearchModalOpen(false)}>×</button>
            <h2>Search</h2>
            <div className="search-filters">
              {/* Simple search filters would go here */}
              <div className="filter-group">
                <label>Location</label>
                <input type="text" placeholder="Enter location" />
              </div>
              <div className="filter-group">
                <label>Car Type</label>
                <select>
                  <option>All Types</option>
                  <option>SUV</option>
                  <option>Sedan</option>
                  <option>Compact</option>
                  <option>Luxury</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-inputs">
                  <input type="number" placeholder="Min" />
                  <input type="number" placeholder="Max" />
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="clear-button">Clear</button>
              <button className="apply-button" onClick={() => {
                handleApplyFilters({});
                setIsSearchModalOpen(false);
              }}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Page */}
      {isFilterPageOpen && (
        <div className="filter-page">
          <div className="filter-header">
            <h2>Filters</h2>
            <button className="close-button" onClick={() => setIsFilterPageOpen(false)}>×</button>
          </div>
          <div className="filter-content">
            <div className="filter-section">
              <h3>Car Type</h3>
              <div className="checkbox-group">
                {vehicleCategories.map((category, index) => (
                  <label key={index} className="checkbox-label">
                    <input type="checkbox" />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="range-slider">
                <input type="range" min="0" max="500" />
                <div className="price-labels">
                  <span>$0</span>
                  <span>$500</span>
                </div>
              </div>
            </div>
            <div className="filter-section">
              <h3>Features</h3>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Air Conditioning
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  GPS
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Bluetooth
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Child Seat
                </label>
              </div>
            </div>
          </div>
          <div className="filter-footer">
            <button className="clear-button">Clear All</button>
            <button 
              className="apply-button"
              onClick={() => {
                handleApplyFilters({});
                setIsFilterPageOpen(false);
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      {!showResults && (
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CarFlex Rentals</h3>
              <p>© 2022 CarFlex. All rights reserved.</p>
            </div>
            <div className="footer-links">
              <a href="#">About Us</a>
              <a href="#">Contact</a>
              <a href="#">Support</a>
              <a href="#">FAQ</a>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;