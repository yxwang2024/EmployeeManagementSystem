import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrentStep } from '../../store/onboardingApplicationSlice';

const Summary: React.FC = () => {
  const dispatch = useDispatch();
  const {
    personalInfo,
    document
  } = useSelector((state: RootState) => state.onboardingApplication);

  return (
    <div>
      <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Summary</h2>
      <p>{`Profile Picture: ${personalInfo.profilePicture}`}</p>
      <p>{`OPT Receipt: ${document.optReceipt}`}</p>
      <p>{`Other Visa: ${document.otherVisa}`}</p>
      <p>{`Driver License: ${document.driverLicense}`}</p>
      <div className='flex'>
        <button 
          type="button" 
          className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
          onClick={() => dispatch(setCurrentStep(6))}>
          Previous
        </button>
        <button 
          type="submit"
          className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit ms-auto px-4 py-2 text-md md:text-lg font-semibold'>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Summary;