import React, { useState } from 'react';
import './index.css';
import SearchModal from './components/SearchModal';
import FilterPage from './components/FilterPage';


const App = () => {
  const [activeTime, setActiveTime] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('all-cars');
  const [isFilterPageOpen, setIsFilterPageOpen] = useState(false);

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
    // Here you would typically filter your car listings based on the selected filters
  };

  const vehicleCategories = [
    { name: 'SUVs', icon: '🚙' },
    { name: 'Electric cars', icon: '⚡' },
    { name: 'Compact cars', icon: '🚗' },
    { name: 'Luxury cars', icon: '🏎️' },
    { name: 'Economy', icon: '💰' },
    { name: 'Motorcycles', icon: '🏍️' },
    { name: 'Bicycles', icon: '🚲' },
    { name: 'Parking spots', icon: '🅿️' }
  ];

  const popularCars = [
    { name: 'Electric Dream (ED)', location: 'Speedster Resorts', date: '17/09/2023, 8 AM', image: '/api/placeholder/250/150', action: 'Rent now' },
    { name: 'Turbo Thrust (CER)', location: 'Fuel Fast', date: '21/09/2023', image: '/api/placeholder/250/150', action: 'Rent now' },
    { name: 'Green Machine (FR)', location: 'City Carbon', date: '11/09/2023', image: '/api/placeholder/250/150', action: 'Rent now' },
    { name: 'Urban Glide (JPN)', location: 'Lorem Ipsum', date: '', image: '/api/placeholder/250/150', action: 'Rent now' }
  ];

  const weeklyFeatures = [
    { title: 'Electric Cars Available', subtitle: 'Car Models Catalog', image: '/api/placeholder/250/150', action: 'Rent Now' },
    { title: 'Hybrid Cars Collection', subtitle: 'Fuel-efficient Vehicles', image: '/api/placeholder/250/150', action: 'Rent Now' },
    { title: 'Eco-friendly Car Options', subtitle: 'Low Emission Cars Selection', image: '/api/placeholder/250/150', action: 'Rent Now' },
    { title: 'Sports Car Rentals', subtitle: 'Performance Vehicles Listing', image: '/api/placeholder/250/150', action: 'Rent Now' }
  ];

  const rentalOptions = [
    { title: 'Family Car Rentals', subtitle: 'Explore our Fleet', image: '/api/placeholder/220/150', action: 'Discover' },
    { title: 'City Car Rentals', subtitle: 'Discover More Options', image: '/api/placeholder/220/150', action: 'Discover' },
    { title: 'Adventure Car Rentals', subtitle: 'Find Your Perfect Match', image: '/api/placeholder/220/150', action: 'Find Now' },
    { title: 'Premium Car Rentals', subtitle: 'Luxury Fleet Available', image: '/api/placeholder/220/150', action: 'Explore' },
    { title: 'Airport Car Rentals', subtitle: 'Convenient Rental Services', image: '/api/placeholder/220/150', action: 'Explore' }
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
    <div className="container mx-auto py-6 px-4">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 -mb-px">
          <button 
            className={`font-medium text-lg pb-4 border-b-2 ${activeTab === 'your-bookings' ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
            onClick={() => setActiveTab('your-bookings')}
          >
            Your Bookings
          </button>
          <button 
            className={`font-medium text-lg pb-4 border-b-2 ${activeTab === 'all-cars' ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
            onClick={() => setActiveTab('all-cars')}
          >
            All Cars
          </button>
        </nav>
      </div>

      {/* Car Listings */}
      <div className="space-y-4">
        {carListings.map((car) => (
          <div key={car.id} className="bg-gray-200 p-4 flex items-center rounded">
            {/* Car Image */}
            <div className="w-1/4">
              <div className="bg-gray-300 h-48 rounded">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Car Details */}
            <div className="w-3/4 pl-6 relative">
              <h3 className="text-2xl font-bold">{car.name}</h3>
              <p className="text-lg mt-2">{car.city} - {car.date}</p>
              <p className="text-lg font-medium mt-4">Rate: {car.rate}</p>
              <p className="mt-6">Location: {car.location}</p>
              
              {/* Right Arrow */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-3xl">▶</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500"></div>
          <span className="font-bold text-xl">CarFlex</span>
        </div>
        
        {showResults ? (
          <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for rental car"
              className="border border-gray-300 px-4 py-2 pr-12 rounded"
              value={searchInput}
              onChange={handleSearchChange}
            />
            <button 
              className="absolute right-0 top-0 h-full bg-black text-white px-4 rounded-r"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>
          <button className="hover:underline">Available Cars</button>
          <button 
            className="hover:underline"
            onClick={() => setIsFilterPageOpen(true)}
          >
            Filters
          </button>
          <button 
            className="bg-black text-white px-6 py-2 rounded"
            onClick={() => setIsFilterPageOpen(true)}
          >
            Filter
          </button>
        </div>
        ) : (
          <div className="flex space-x-6">
            <form onSubmit={handleSearchSubmit}>
              <button className="text-gray-600 hover:text-gray-900">Search for rental</button>
            </form>
            <button 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsFilterPageOpen(true)}
            >
              Filter
            </button>
            <button className="bg-black text-white px-4 py-1">Log in</button>
          </div>
        )}
      </header>

      {/* Main Content - conditionally render results page or home page */}
      {showResults ? (
        renderResultsPage()
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative">
            <div className="w-full h-80 bg-gray-500">
              <img src="https://advertising.expedia.com/wp-content/uploads/2020/08/Car-Hero_1920x800.jpg" alt="Car Banner" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-start px-12">
              <h1 className="text-4xl font-bold text-white mb-6 max-w-lg">
                Discover the perfect ride for your journey.
              </h1>
              <div className="bg-white flex items-center rounded p-1 w-full max-w-md">
                <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
                  <input 
                    type="text" 
                    placeholder="Enter location or car model" 
                    className="px-4 py-2 flex-grow outline-none"
                    value={searchInput}
                    onChange={handleSearchChange}
                  />
                  <button className="bg-black text-white px-6 py-2">Search</button>
                </form>
              </div>
              <p className="text-white mt-4">
                Book your ideal car with ease and convenience at the most competitive rates.
              </p>
            </div>
          </section>

          {/* Vehicle Categories */}
          <section className="bg-gray-200 py-6 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {vehicleCategories.map((category, index) => (
                <button 
                  key={index} 
                  className="bg-white py-4 flex items-center justify-center space-x-2 hover:bg-gray-50"
                >
                  <span className="text-2xl hidden md:inline">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Popular in New York */}
          <section className="py-8 px-4 max-w-6xl mx-auto w-full">
            <h2 className="text-2xl font-bold mb-4">Popular in New York</h2>
            <div className="flex overflow-x-auto space-x-4 mb-6 pb-2">
              <button 
                className={`px-4 py-1 ${activeTime === 'all' ? 'font-bold border-b-2 border-black' : ''}`}
                onClick={() => setActiveTime('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-1 ${activeTime === 'today' ? 'font-bold border-b-2 border-black' : ''}`}
                onClick={() => setActiveTime('today')}
              >
                Today
              </button>
              <button 
                className={`px-4 py-1 ${activeTime === 'tomorrow' ? 'font-bold border-b-2 border-black' : ''}`}
                onClick={() => setActiveTime('tomorrow')}
              >
                Tomorrow
              </button>
              <button 
                className={`px-4 py-1 ${activeTime === 'this-week' ? 'font-bold border-b-2 border-black' : ''}`}
                onClick={() => setActiveTime('this-week')}
              >
                This week
              </button>
              <button 
                className={`px-4 py-1 ${activeTime === 'next-week' ? 'font-bold border-b-2 border-black' : ''}`}
                onClick={() => setActiveTime('next-week')}
              >
                Next week
              </button>
              <button 
                className={`px-4 py-1 ${activeTime === 'this-month' ? 'font-bold border-b-2 border-black' : ''}`}
                onClick={() => setActiveTime('this-month')}
              >
                This month
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularCars.map((car, index) => (
                <div key={index} className="bg-gray-200 rounded overflow-hidden">
                  <div className="relative h-40">
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                    <button className="absolute top-2 right-2 bg-white px-2 py-1 text-xs rounded">View</button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{car.name}</h3>
                    <p className="text-sm text-gray-600">{car.location} {car.date ? `- ${car.date}` : ''}</p>
                    <button className="mt-2 text-sm font-medium">{car.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* This Week in CarFlex */}
          <section className="py-8 px-4 max-w-6xl mx-auto w-full">
            <h2 className="text-2xl font-bold mb-4">This week in CarFlex</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weeklyFeatures.map((feature, index) => (
                <div key={index} className="bg-gray-200 rounded overflow-hidden">
                  <div className="relative h-40">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                    <button className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded">View</button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.subtitle}</p>
                    <button className="mt-2 text-sm font-medium">{feature.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Car Rental Options */}
          <section className="py-8 px-4 max-w-6xl mx-auto w-full">
            <h2 className="text-2xl font-bold mb-4">Car Rental Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {rentalOptions.map((option, index) => (
                <div key={index} className="bg-gray-200 rounded overflow-hidden">
                  <div className="h-32">
                    <img src={option.image} alt={option.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm">{option.title}</h3>
                    <p className="text-xs text-gray-600">{option.subtitle}</p>
                    <button className="mt-3 bg-black text-white text-xs w-full py-2">{option.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {isFilterPageOpen && (
        <FilterPage 
          onClose={() => setIsFilterPageOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      )}

      {/* Footer - only show on home page */}
      {!showResults && (
        <footer className="bg-black text-white mt-12">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between mb-12">
              <div className="mb-8 md:mb-0">
                <h3 className="text-xl font-bold mb-4">Connect with CarFlex</h3>
                <div className="flex items-center mt-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="bg-white text-black px-4 py-2 w-64" 
                  />
                  <button className="bg-gray-800 px-4 py-2">Go</button>
                </div>
                <div className="flex space-x-4 mt-6">
                  <a href="#" className="w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black">YT</a>
                  <a href="#" className="w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black">IN</a>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-bold mb-4">About CarFlex</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:underline">Learn More</a></li>
                    <li><a href="#" className="hover:underline">About Us</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Connect with</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:underline">Join Us on Social Media</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">For Rental Partners</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:underline">Grow Your Business with Us</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <h3 className="text-2xl font-bold mb-6">CarFlex Rentals</h3>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start border-t border-gray-800 pt-8 mt-8">
              <div>
                <h4 className="font-bold mb-2">CarFlex Experience</h4>
                <p className="text-sm text-gray-400">Join for a personalized car rental service</p>
                <p className="text-sm text-gray-400 mt-4">CarFlex © 2022</p>
              </div>
              <div className="mt-6 md:mt-0">
                <ul className="space-y-1 text-sm">
                  <li><a href="#" className="hover:underline">Support</a></li>
                  <li><a href="#" className="hover:underline">FAQ</a></li>
                  <li><a href="#" className="hover:underline">Contact</a></li>
                  <li><a href="#" className="hover:underline">Live support</a></li>
                  <li><a href="#" className="hover:underline">Get in touch with...</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;