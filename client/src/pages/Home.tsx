import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center h-screen bg-gray-100">
      <div>
        <h1 className="text-center text-4xl font-bold mb-10 text-gray-700">Welcome to Employee Management System</h1>
        <h3 className="text-2xl font-bold mb-8 text-center text-gray-700">Please Log in to explore all functions</h3>
        <div className="flex space-x-4 justify-center">
          <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Log In
          </Link>
          <Link to="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;