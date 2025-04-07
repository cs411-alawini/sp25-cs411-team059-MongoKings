import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [activeTime, setActiveTime] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const vehicleCategories = [
    { name: 'SUVs', icon: '🚙' },
    { name: 'Electric cars', icon: '🔌' },
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500"></div>
          <span className="font-bold text-xl">CarFlex</span>
        </div>
        <div className="flex space-x-6">
          <button className="text-gray-600 hover:text-gray-900">Search for rental</button>
          <button className="text-gray-600 hover:text-gray-900">Filter</button>
          <button className="bg-black text-white px-4 py-1">Log in</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="w-full h-80 bg-gray-500">
          <img src="/api/placeholder/1200/400" alt="Car Banner" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-start px-12">
          <h1 className="text-4xl font-bold text-white mb-6 max-w-lg">
            Discover the perfect ride for your journey.
          </h1>
          <div className="bg-white flex items-center rounded p-1 w-full max-w-md">
            <input 
              type="text" 
              placeholder="Enter location or car model" 
              className="px-4 py-2 flex-grow outline-none"
              value={searchInput}
              onChange={handleSearchChange}
            />
            <button className="bg-black text-white px-6 py-2">Search</button>
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

      {/* Footer */}
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
    </div>
  );
};

export default App;