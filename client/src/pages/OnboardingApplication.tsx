import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import StepNavigation from '../components/multiStepForm/StepNavigation';
import PersonalInfoStep from '../components/multiStepForm/PersonalInfo';
import AddressStep from '../components/multiStepForm/Address';
import ContactInfoStep from '../components/multiStepForm/ContactInfo';
import DocumentStep from '../components/multiStepForm/Document';
import ReferenceStep from '../components/multiStepForm/Reference';
import EmergencyContactStep from '../components/multiStepForm/EmergencyContact';
import SummaryStep from '../components/multiStepForm/Summary';
import { initializeFromLocalStorage, setOaInfoData, fetchOnboardingData, setCurrentStep } from '../store/oaInfo';
import { useNavigate } from 'react-router-dom';
import PendingInfo from '../components/multiStepForm/PendingInfo';

const OnboardingApplication: React.FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.oaInfo.userId);
  const currentStep = useSelector((state: RootState) => state.oaInfo.currentStep);
  const isInitialized = useSelector((state: RootState) => state.oaInfo.isInitialized);
  const status = useSelector((state: RootState) => state.oaInfo.status);
  const navigate = useNavigate(); 
  const [feedback, setFeedback] = useState<string | null>(null);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token){
  //     dispatch(initializeFromLocalStorage()).then(() => {
  //       const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
  //       if (status === 'Rejected') {
  //         dispatch(fetchOnboardingData(userId)).then((response: any) => {
  //           console.log("oa: ", response)
  //           if (response.payload && response.payload.hrFeedback) {
  //             setFeedback(response.payload.hrFeedback);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }, [dispatch, status]);

  useEffect(() => {
    if (status === 'Approved') {
      navigate('/');
    }
  }, [status, navigate]);

  useEffect(() => {
    const initializeData = async () => {
      if (status !== 'Approved') {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            await dispatch(initializeFromLocalStorage());
            if (status === 'Rejected') {
              const response = await dispatch(fetchOnboardingData(userId));
              if (response.payload && response.payload.hrFeedback) {
                setFeedback(response.payload.hrFeedback);
              }
            }
          } catch (error) {
            console.error("Initialization failed:", error);
          }
        }
      }
    };
  
    initializeData();
  }, [dispatch, userId, status]);
  

  // console.log("status:", status, feedback)
  useEffect(() => {
    if (status === 'NotSubmitted') {
      const savedData = localStorage.getItem(`oaInfo-${userId}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data) {
          dispatch(setOaInfoData(data));
        }
      }
    }
  }, [dispatch, status]);

  if (!isInitialized || status === null) {
    return <div className='pt-[200px] w-2/3 font-bold text-2xl text-center'>Loading...</div>;
  }

  if (status === 'Pending') {
    return <PendingInfo />;
  } 

  if (status === 'Rejected' && feedback) {
    return (
      <div className='pt-[200px] w-2/3 text-center'>
        <h1 className='font-bold text-2xl'>Here's your feedback:</h1>
        <div className='font-semibold text-lg mt-8'>{feedback}</div>
        <button
          className='mt-12 px-4 py-2 bg-blue-600 text-white font-semibold rounded'
          onClick={() => {
            setFeedback(null);
            dispatch(setCurrentStep(1));
          }}
        >
          Edit your information to apply again
        </button>
      </div>
    );
  }


  const displayStep = (step: number) => {
    switch (step) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <AddressStep />;
      case 3:
        return <ContactInfoStep />;
      case 4:
        return <DocumentStep />;
      case 5:
        return <ReferenceStep />;
      case 6:
        return <EmergencyContactStep />;
      case 7:
        return <SummaryStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="onboarding-application mt-24 mx-12 md:mx-auto max-w-screen-md w-full">
      <StepNavigation />
      {displayStep(currentStep)}
    </div>
  );
};

export default OnboardingApplication;