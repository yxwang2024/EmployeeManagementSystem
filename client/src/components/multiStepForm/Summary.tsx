import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { submitOnboardingApplication } from '../../store/onboardingApplicationSlice';

const Summary: React.FC = () => {
  const dispatch = useDispatch();
  const onboardingState = useSelector((state: RootState) => state.onboardingApplication);

  // const handleSubmit = () => {
  //   dispatch(submitOnboardingApplication(onboardingState));
  // };

  return (
    <div className="summary-page mt-24 mx-12 md:mx-auto max-w-screen-md">
      <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Summary</h2>
      <div>
        <h3>Personal Information</h3>
        <pre>{JSON.stringify(onboardingState.personalInfo, null, 2)}</pre>
        <h3>Address</h3>
        <pre>{JSON.stringify(onboardingState.address, null, 2)}</pre>
        <h3>Contact Information</h3>
        <pre>{JSON.stringify(onboardingState.contactInfo, null, 2)}</pre>
        <h3>Documents</h3>
        <pre>{JSON.stringify(onboardingState.document, null, 2)}</pre>
        <h3>Emergency Contacts</h3>
        <pre>{JSON.stringify(onboardingState.emergencyContacts, null, 2)}</pre>
        <button onClick={handleSubmit} className='flex mb-32 bg-blue-600 text-white border rounded text-center ms-auto px-4 py-2 text-md md:text-lg font-semibold'>Submit</button>
      </div>
    </div>
  );
};

export default Summary;