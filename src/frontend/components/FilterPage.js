import React, { useState } from 'react';

const FilterPage = ({ onClose, onApplyFilters }) => {
  const [selectedCarTypes, setSelectedCarTypes] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedRating, setSelectedRating] = useState(null);
  
  const carTypes = [
    { id: 'suv', label: 'SUV' },
    { id: 'sedan', label: 'Sedan' },
    { id: 'compact', label: 'Compact' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'electric', label: 'Electric' },
    { id: 'hybrid', label: 'Hybrid' }
  ];
  
  const features = [
    { id: 'bluetooth', label: 'Bluetooth connectivity' },
    { id: 'leather', label: 'Leather seats' },
    { id: 'gps', label: 'GPS navigation system' },
    { id: 'keyless', label: 'Keyless entry system' },
    { id: '24-7', label: '24/7 roadside assistance' },
    { id: 'fuel-efficient', label: 'Fuel efficient' },
    { id: 'autopilot', label: 'Autopilot' }
  ];
  
  const ratings = [5, 4, 3, 2, 1];
  
  const toggleCarType = (typeId) => {
    if (selectedCarTypes.includes(typeId)) {
      setSelectedCarTypes(selectedCarTypes.filter(id => id !== typeId));
    } else {
      setSelectedCarTypes([...selectedCarTypes, typeId]);
    }
  };
  
  const toggleFeature = (featureId) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };
  
  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value, 10);
    setPriceRange(newRange);
  };
  
  const handleApply = () => {
    const filters = {
      carTypes: selectedCarTypes,
      features: selectedFeatures,
      priceRange,
      rating: selectedRating
    };
    
    onApplyFilters(filters);
    onClose();
  };
  
  const handleClearAll = () => {
    setSelectedCarTypes([]);
    setSelectedFeatures([]);
    setPriceRange([0, 200]);
    setSelectedRating(null);
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold">Filters</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleClearAll}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear all
            </button>
            <button 
              onClick={onClose}
              className="text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Side - Filters */}
          <div className="md:col-span-3 space-y-8">
            {/* Car Type Filter */}
            <div>
              <h2 className="text-lg font-bold mb-4">Car Type</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {carTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleCarType(type.id)}
                    className={`border ${
                      selectedCarTypes.includes(type.id) 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                    } py-2 px-4 rounded-md text-sm`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Features Filter */}
            <div>
              <h2 className="text-lg font-bold mb-4">Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map(feature => (
                  <div 
                    key={feature.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={feature.id}
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => toggleFeature(feature.id)}
                      className="w-4 h-4"
                    />
                    <label htmlFor={feature.id}>{feature.label}</label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div>
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-bold">Price range</h2>
                <span>${priceRange[0]} - ${priceRange[1]}</span>
              </div>
              
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between">
                <span>$0</span>
                <span>$200+</span>
              </div>
            </div>
            
            {/* Star Rating Filter */}
            <div>
              <h2 className="text-lg font-bold mb-4">Car rating</h2>
              <div className="flex space-x-2">
                {ratings.map(rating => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      selectedRating === rating 
                        ? 'bg-black text-white' 
                        : 'border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Side - Map Preview */}
          <div className="md:col-span-2">
            <div className="bg-gray-200 h-96 rounded-lg mb-4">
              <img 
                src="/api/placeholder/400/400" 
                alt="Map preview" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <button
              onClick={handleApply}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
            >
              Show cars
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;