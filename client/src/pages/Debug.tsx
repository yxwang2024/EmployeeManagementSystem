import React from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { RootState } from '../store/store';

const DebugPage: React.FC = () => {
  const onboardingState = useSelector((state: RootState) => state.onboardingApplication);
  const authState = useSelector((state: RootState) => state.auth);

  let decodedToken = null;

  if (authState.token) {
    try {
      decodedToken = jwtDecode(authState.token);
    } catch (error) {
      console.error('Token decoding failed:', error);
    }
  }

  console.log('Onboarding Application State:', onboardingState);
  console.log('Auth State:', authState);
  console.log('Decoded Token:', decodedToken);

  return (
    <div className="debug-page mt-24 mx-12 md:mx-auto max-w-screen-md">
      <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Debug Page</h2>
      <h3 className='text-center font-semibold text-gray-700 text-xl md:text-2xl mb-5'>Onboarding Application State</h3>
      <pre>{JSON.stringify(onboardingState, null, 2)}</pre>
      <h3 className='text-center font-semibold text-gray-700 text-xl md:text-2xl mb-5'>Auth State</h3>
      <pre>{JSON.stringify(authState, null, 2)}</pre>
      <h3 className='text-center font-semibold text-gray-700 text-xl md:text-2xl mb-5'>Decoded Token</h3>
      <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
    </div>
  );
};

export default DebugPage;
