import React from 'react';
import Button from '../components/Button';
import AnimatedClouds from '../components/AnimatedCloud';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-around bg-gray-100">
      {/* Header */}
      <header className="font-secondary text-black text-5xl p-8 text-center">
        DSA Case Study
      </header>

      <AnimatedClouds />

      {/* Play Button */}
      <div className="flex justify-center">
        <Button onClick={() => navigate('/about')} className="bg-green-500 text-black px-6 rounded-full text-lg hover:bg-green-600 transition duration-300">
          Play
        </Button>
      </div>

      {/* Members Section */}
      <footer className="bg-secondary text-white text-center py-4">
        <ul className=" text-black font-bold space-y-2">
          <li className='mb-3 text-4xl'>Group 1</li>
          <li className='text-2xl'>David Bato-bato</li>
          <li className='text-2xl'>Jasper Reyes</li>
          <li className='text-2xl'>Joshua Daet</li>
        </ul>
      </footer>
    </div>
  );
}

export default Homepage;
