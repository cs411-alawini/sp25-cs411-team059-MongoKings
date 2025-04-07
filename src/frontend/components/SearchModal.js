import React, { useState } from 'react';

const SearchModal = ({ isOpen, onClose, onApplyFilters }) => {
  const [carModel, setCarModel] = useState('');
  const [location, setLocation] = useState('');
  const [seats, setSeats] = useState('');
  const [doors, setDoors] = useState('');
  const [rateType, setRateType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmissionType, setTransmissionType] = useState({
    automatic: false,
    manual: false
  });
  const [additionalFeatures, setAdditionalFeatures] = useState({
    insurance: false,
    gps: false,
    bluetooth: false
  });

  const handleTransmissionChange = (type) => {
    setTransmissionType({
      ...transmissionType,
      [type]: !transmissionType[type]
    });
  };

  const handleFeatureChange = (feature) => {
    setAdditionalFeatures({
      ...additionalFeatures,
      [feature]: !additionalFeatures[feature]
    });
  };

  const handleRateTypeSelect = (type) => {
    setRateType(type);
  };

  const handleApplyFilters = () => {
    // Just call the onApplyFilters callback to show the results page
    onApplyFilters();
    onClose();
  };

  const handleClearFilters = () => {
    setCarModel('');
    setLocation('');
    setSeats('');
    setDoors('');
    setRateType('');
    setFuelType('');
    setTransmissionType({ automatic: false, manual: false });
    setAdditionalFeatures({ insurance: false, gps: false, bluetooth: false });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Search</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-2">Fuel type</h3>
          <div className="h-2 bg-gray-200 rounded relative">
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full"></div>
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2">Car model</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="SUV"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Location</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="New York"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-2">Rate</h3>
          <div className="grid grid-cols-3 gap-4">
            <div 
              className={`bg-gray-200 p-4 flex flex-col items-center cursor-pointer ${rateType === 'economy' ? 'bg-gray-300' : ''}`}
              onClick={() => handleRateTypeSelect('economy')}
            >
              <span className="text-xl mb-2">🚗</span>
              <span>Economy</span>
            </div>
            <div 
              className={`bg-gray-200 p-4 flex flex-col items-center cursor-pointer ${rateType === 'compact' ? 'bg-gray-300' : ''}`}
              onClick={() => handleRateTypeSelect('compact')}
            >
              <span className="text-xl mb-2">🚙</span>
              <span>Compact</span>
            </div>
            <div 
              className={`bg-gray-200 p-4 flex flex-col items-center cursor-pointer ${rateType === 'luxury' ? 'bg-gray-300' : ''}`}
              onClick={() => handleRateTypeSelect('luxury')}
            >
              <span className="text-xl mb-2">💎</span>
              <span>Luxury</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-2">Number of seats and doors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Nr. of seats</label>
              <input
                type="number"
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="5"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Nr. of doors</label>
              <input
                type="number"
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="4"
                value={doors}
                onChange={(e) => setDoors(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Transmission type</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={transmissionType.automatic}
                    onChange={() => handleTransmissionChange('automatic')}
                    className="mr-2"
                  />
                  Automatic
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={transmissionType.manual}
                    onChange={() => handleTransmissionChange('manual')}
                    className="mr-2"
                  />
                  Manual
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-2">Hybrid</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={additionalFeatures.insurance}
                onChange={() => handleFeatureChange('insurance')}
                className="mr-2"
              />
              Free insurance
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={additionalFeatures.gps}
                onChange={() => handleFeatureChange('gps')}
                className="mr-2"
              />
              GPS
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={additionalFeatures.bluetooth}
                onChange={() => handleFeatureChange('bluetooth')}
                className="mr-2"
              />
              Bluetooth
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleClearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;