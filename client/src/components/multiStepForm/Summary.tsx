// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
// import { submitOnboardingApplication } from '../../store/onboardingApplicationSlice';

// const Summary: React.FC = () => {
//   const dispatch = useDispatch();
//   const onboardingState = useSelector((state: RootState) => state.onboardingApplication);

//   // const handleSubmit = () => {
//   //   dispatch(submitOnboardingApplication(onboardingState));
//   // };

//   return (
//     <div className="summary-page mt-24 mx-12 md:mx-auto max-w-screen-md">
//       <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Summary</h2>
//       <div>
//         <h3>Personal Information</h3>
//         <pre>{JSON.stringify(onboardingState.personalInfo, null, 2)}</pre>
//         <h3>Address</h3>
//         <pre>{JSON.stringify(onboardingState.address, null, 2)}</pre>
//         <h3>Contact Information</h3>
//         <pre>{JSON.stringify(onboardingState.contactInfo, null, 2)}</pre>
//         <h3>Documents</h3>
//         <pre>{JSON.stringify(onboardingState.document, null, 2)}</pre>
//         <h3>Emergency Contacts</h3>
//         <pre>{JSON.stringify(onboardingState.emergencyContacts, null, 2)}</pre>
//         <button onClick={handleSubmit} className='flex mb-32 bg-blue-600 text-white border rounded text-center ms-auto px-4 py-2 text-md md:text-lg font-semibold'>Submit</button>
//       </div>
//     </div>
//   );
// };

// export default Summary;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrentStep, setStatus } from '../../store/oaInfo';
import axios from 'axios';

const Summary: React.FC = () => {
  const dispatch = useDispatch();
  const onboardingState = useSelector((state: RootState) => state.onboardingApplication);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/graphql', {
        query: `
          mutation UpdateOnboardingApplication($input: OnboardingApplicationInput!) {
            updateOnboardingApplication(input: $input) {
              id
              status
            }
          }
        `,
        variables: { input: onboardingState },
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      dispatch(setStatus('Pending'));
      dispatch(clearOnboardingState());
      alert('Onboarding application submitted successfully!');
    } catch (error) {
      console.error('Submission failed:', error);
      alert(`Submission failed: ${error.message}`);
    }
  };

  return (
    <div>
      {/* <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Summary</h2>
      <p>{`Profile Picture: ${onboardingState.personalInfo.profilePicture}`}</p>
      <p>{`OPT Receipt: ${onboardingState.document.optReceipt}`}</p>
      <p>{`Other Visa: ${onboardingState.document.otherVisa}`}</p>
      <p>{`Driver License: ${onboardingState.document.driverLicense}`}</p> */}
      <div className='flex mt-8 mb-32'>
        <button
          type="button"
          className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
          onClick={() => dispatch(setCurrentStep(6))}
        >
          Previous
        </button>
        <button
          type="button"
          className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit ms-auto px-4 py-2 text-md md:text-lg font-semibold'
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Summary;