import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCar } from "react-icons/fa";
import CustomButton from "../components/CustomButton";
import AnimatedClouds from "../components/AnimatedCloud";
import Button from "../components/Button";

const Queue = () => {
  const [garage, setGarage] = useState([]);
  const [plateNumber, setPlateNumber] = useState("");
  const [arrivals, setArrivals] = useState(0);
  const [departures, setDepartures] = useState(0);
  const [message, setMessage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [highlightedCar, setHighlightedCar] = useState(null);

  useEffect(() => {
    document.title = "Queue";
  }, []);

  useEffect(() => {
    const audio = new Audio('/audio/mario.mp3');
    audio.volume = 0.7
    audio.loop = true; 
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const foundCar = garage.find(car => plateNumber === car);
    setHighlightedCar(foundCar || null);
  }, [plateNumber, garage]);
  


  console.log(garage);
  console.log(highlightedCar);

  // Helper to show a quick error/warning message
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  // Helper to show a quick arrival/departure message
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  // Enqueue / Arrival
  const handleArrival = () => {
    if (!plateNumber.trim()) {
      showMessage("Plate number cannot be empty!");
      return;
    }
    if (garage.includes(plateNumber)) {
      showMessage("Plate number must be unique!");
      return;
    }
    if (garage.length >= 10) {
      showMessage("Garage is full!");
      return;
    }
    setGarage((prev) => [...prev, plateNumber]);
    setPlateNumber("");
    setArrivals((prev) => prev + 1);
    showNotification(`Car ${plateNumber} arrived!`);
  };

  // Dequeue / Departure
  const handleDepartureLastCar = () => {
    if (garage.length === 0) {
      showMessage("Garage is empty!");
      return;
    }
    const departingCar = garage[0];
    // Immediately remove the first car
    setGarage((prev) => prev.slice(1));
    setDepartures((prev) => prev + 1);
    showNotification(`Car ${departingCar} departed!`);
  };
  
  const departCar = (plateNumber) => {
    if (garage.length === 0) {
      showMessage("Garage is empty!");
      return;
    }
    if (!plateNumber.trim()) {
      showMessage("Plate number cannot be empty!");
      return;
    }

    if (!garage.includes(plateNumber)) {
      showMessage("Car is not in the garage!");
      return;
    }

    if (garage.indexOf(plateNumber) !== 0) {
      showMessage("Car is not in front!");
      return;
    }
    const departingCar = garage[garage.indexOf(plateNumber)];
    // Immediately remove the first car
    setGarage((prev) => prev.filter((car) => car !== plateNumber));
    setDepartures((prev) => prev + 1);
    showNotification(`Car ${departingCar} departed!`);
  };

  return (
    <div className="min-h-screen bg-secondary-light p-10 text-gray-800 relative">
      <h1 className="z-30 text-4xl font-pressStart mb-6 text-center">PUP-CEA Parking Garage</h1>

      <AnimatedClouds />
      {/* Notification (Animated Slide-In) */}
      {notification && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="shadow-[0_5px_0_0_var(--dark-color)] fixed border-4 border-black top-4 right-4 font-pressStart text-black bg-primary py-2 px-8 rounded z-50"
        >
          {notification}
        </motion.div>
      )}

      {/* Form Section */}
      <div className="flex justify-center relative">
        <div className="text-black p-6 rounded-lg w-[1300px] max-w-7xl min-h-64">
          <h2 className="text-2xl font-bold mb-4 text-center">Car Arrival/Departure</h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-5 md:items-center space-y-4 md:space-y-0 md:space-x-4 justify-center"
          >
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Enter Plate Number"
              className="p-2 bg-primary text-black rounded border border-black border-dark w-full md:w-auto"
            />
            <div className="flex gap-4">
              <Button
                variant="success" 
                size="md"
                onClick={handleArrival}
                className="flex items-center justify-center gap-2"
              >
                <FaCar className="text-xl" />
                <span>Arrival</span>
              </Button>
              <Button
                variant="danger"
                size="md"
                className="flex items-center justify-center gap-2 bg-red-500"
                onClick={() => departCar(plateNumber)}

              >
                <FaCar className="text-xl" />
                <span>Departure</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleDepartureLastCar}
                className="flex items-center justify-center gap-2"
              >
                <FaCar className="text-xl" />
                <span>Depart Front</span>
              </Button>
            </div>
          </form>
          <div className="mt-6 w-full flex justify-around">
            <div className="flex gap-10">
              <p className="text-lg">Total Arrivals: {arrivals}</p>
              <p className="text-lg">Total Departures: {departures}</p>
            </div>
          </div>
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 absolute left-1/2 -translate-x-1/2 bottom 10 bg-red-100 text-red-700 p-3 rounded border border-red-400 text-center"
            >
              {message}
            </motion.div>
          )}
        </div>
      </div>

      {/* Garage Section */}
      <div className="p-4 rounded-lg w-full max-w-7xl mx-auto flex justify-center items-center overflow-x-auto">
        <div className="overflow-hidden  border-b-4 border-black flex gap justify-start items-center w-full gap-3">
          <AnimatePresence>
            {garage.map((car, index) => {
              // Is this car the front or rear of the queue?
              const isFront = index === 0;
              const isRear = index === garage.length - 1;

              // If there's only one car, it's both front and rear
              // You could add special styling if isFront && isRear
              // For simplicity, we'll show both labels if there's only 1 car.
              let borderClass = "";
              if (isFront && isRear) {
                // Both front and rear
                borderClass = "border-4 border-red-500"; 
              } else if (highlightedCar === car) {
                // Highlighted car
                borderClass = "border-4 border-yellow-500";
              } else if (isFront) {
                // Front car
                borderClass = "border-4 border-green-500";
              } else if (isRear) {
                // Rear car
                borderClass = "border-4 border-blue-500";
              } else {
                // Middle cars
                // borderClass = "border-2 border-gray-400";
              }

              return (
                <motion.div
                  key={car}
                  layout
                  initial={{ x: 1000, opacity: 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 1 }}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                    duration: 1,
                    
                  }}
                  className={`relative mb-[-10px] text-gray-800 rounded-lg flex items-center justify-between flex-col min-w-[100px] ${borderClass}`}
                >
                  {/* Car icon and plate number */}
                  <span className="absolute top-5 text-sm flex justify-center text-black min-w-20 p-2 font-bold">{car}</span>
                  <img src={'/images/car.gif'} style={{objectFit: "contain"}} className="w-[100px] h-36 mb-[-40px]" />
                  <div className="absolute font-secondary top-0 right-0 text-black text-md font-bold p-2 rounded-bl-lg rounded-tr-lg">
                    {isFront && !isRear && "Front"}
                    {isRear && !isFront && "Rear"}
                    {isFront && isRear && "Front"}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* If garage is empty */}
          {garage.length === 0 && (
            <div className="w-full flex items-center justify-center">
              <div className="flex gap-5 items-center space-y-4">
                <img src="/images/car.gif"  className='w-32' alt="" />
                <p className="text-2xl font-bold text-black">Garage is Empty...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Queue;
