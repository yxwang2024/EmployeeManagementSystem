import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { EmployeeInstanceType } from '../utils/type';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user); 
  
  return (
    <div className="w-full flex items-center justify-center h-screen bg-gray-100">
      <div>
        <h1 className="text-center text-4xl font-bold mb-10 text-gray-700">Welcome to Employee Management System</h1>
        {!user &&
            <div className='grid'>        
              <h3 className="text-2xl font-bold mb-8 text-center text-gray-700">Please Log in to explore all functions</h3>
              <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit mx-auto">
                Log In
              </Link>
            </div>
          }
        <div className="flex mx-auto">
          {(user && (user?.instance as EmployeeInstanceType)?.onboardingApplication?.status !== 'Approved') &&   
            <Link to="/onboardingapplication" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Start your application
            </Link>
          }
        </div>
      </div>
    </div>
  );
}

export default Home;