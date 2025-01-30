import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar } from 'react-icons/fa';
import Button from '../components/Button';

const Stack = () => {
  const [garage, setGarage] = useState([]);
  const [plateNumber, setPlateNumber] = useState('');
  const [arrivals, setArrivals] = useState(0);
  const [departures, setDepartures] = useState(0);
  const [message, setMessage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [departingCar, setDepartingCar] = useState(null);
  const [isDeparting, setIsDeparting] = useState(false); // Track departure state

  useEffect(() => {
    document.title = "Stack";
  }, []);


  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const departLastCar = () => {
    if (isDeparting) return; // Prevent spamming
    if (garage.length === 0) {
      showMessage('Garage is empty!');
      return;
    }

    setIsDeparting(true); // Set departure state
    const lastCar = garage[garage.length - 1];
    setDepartingCar(lastCar);

    setTimeout(() => {
      setGarage(garage.slice(0, -1));
      setDepartures(departures + 1);
      setDepartingCar(null);
      setIsDeparting(false); // Reset departure state
      showNotification(`Car ${lastCar} departed!`);
    }, 1000); // Match this timeout to the animation duration
  };

  const handleArrival = () => {
    if (!plateNumber.trim()) {
      showMessage('Plate number cannot be empty!');
      return;
    }
    if (garage.includes(plateNumber)) {
      showMessage('Plate number must be unique!');
      return;
    }
    if (garage.length >= 10) {
      showMessage('Garage is full!');
      return;
    }
    setGarage([...garage, plateNumber]);
    setPlateNumber('');
    setArrivals(arrivals + 1);
    showNotification(`Car ${plateNumber} arrived!`);
  };

  const handleDeparture = () => {
    if (!plateNumber.trim()) {
      showMessage('Plate number cannot be empty!');
      return;
    }
    if (!garage.includes(plateNumber)) {
      showMessage('Car not found in the garage!');
      return;
    }
    if (garage[garage.length - 1] !== plateNumber) {
      showMessage('Car must be at the top of the stack to depart!');
      return;
    }
    departLastCar(); // Use the same logic as departLastCar
  };

  return (
    <div className="min-h-screen bg-secondary p-10 text-gray-800 relative">
      <h1 className="text-4xl font-bold mb-6 text-center">PUP-CEA Parking Garage</h1>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="fixed top-4 right-4 bg-green-500 text-white py-2 px-8 rounded shadow-lg z-50"
        >
          {notification}
        </motion.div>
      )}

      <div className="flex">
        {/* Form Section */}
        <div className="w-1/3 bg-secondary-light text-black p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Car Arrival/Departure</h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col space-y-4"
          >
            <label className="text-lg font-medium">Car Plate Number:</label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Enter Plate Number"
              className="p-2 rounded border text-black border-black bg-transparent"
            />
          <Button
            variant="success" 
            size="md" 
            className="flex items-center justify-center gap-2"
            onClick={handleArrival}
          >
            <FaCar className="text-xl" />
            <span>Arrival</span>
          </Button>
          <Button
            variant="danger" 
            size="md" 
            className="flex items-center justify-center gap-2"
            onClick={handleDeparture}
          >
              <FaCar className="text-xl" />
              <span>Departure</span>
            </Button>
            <Button
              variant="primary" 
              size="md" 
              className="flex items-center justify-center gap-2"
              onClick={departLastCar}
          >
              <FaCar className="text-xl" />
              <span>Depart Last Car</span>
            </Button>
          </form>
          <div className="mt-6">
            <p className="text-lg">Total Arrivals: {arrivals}</p>
            <p className="text-lg">Total Departures: {departures}</p>
          </div>
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 bg-red-100 text-red-700 p-3 rounded border border-red-400"
            >
              {message}
            </motion.div>
          )}
        </div>

        {/* Garage Section */}
        <div className="w-2/3 border-4 flex justify-center items-center">
          <div className="bg-secondary-light p-2 rounded-lg shadow-lg border border-gray-200 w-full h-[560px] flex flex-col-reverse items-center overflow-hidden">
            {garage.map((car, index) => (
              <motion.div
                key={index}
                initial={{ y: -50, opacity: 0 }}
                animate={
                  departingCar === car
                    ? { x: 300, opacity: 0 } // Animate departure
                    : { y: 0, opacity: 1 }
                }
                transition={{ type: 'spring', stiffness: 100, duration: 1 }}
                className="bg-gray-100 text-gray-800 p-[10px] rounded-lg w-[90%] flex items-center justify-between mb-2 shadow-md border border-gray-300"
              >
                <span>Plate Number: {car}</span>
                <FaCar className="text-xl text-gray-600" />
              </motion.div>
            ))}
            {garage.length === 0 && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex justify-center flex-col items-center space-y-4">
                  <FaCar className="text-6xl text-gray-300" />
                  <p className="text-2xl font-bold text-gray-400">Garage is Empty</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stack;
