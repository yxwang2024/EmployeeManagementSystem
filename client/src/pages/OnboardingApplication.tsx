import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import StepNavigation from '../components/multiStepForm/StepNavigation';
import PersonalInfoStep from '../components/multiStepForm/PersonalInfo';
import AddressStep from '../components/multiStepForm/Address';
import ContactInfoStep from '../components/multiStepForm/ContactInfo';
import DocumentStep from '../components/multiStepForm/Document';
import ReferenceStep from '../components/multiStepForm/Reference';
import EmergencyContactStep from '../components/multiStepForm/EmergencyContact';
import SummaryStep from '../components/multiStepForm/Summary';
import { jwtDecode } from 'jwt-decode';

const OnboardingApplication: React.FC = () => {
  const currentStep = useSelector((state: RootState) => state.onboardingApplication.currentStep);
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert('No token found. Please log in.');
      navigate('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== 'Employee') {
        alert('Only employees need to fill their on borading application.');
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Token decoding failed:', error);
      navigate('/login');

    }
  }, [token, navigate]);

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
    <div className="onboarding-application mt-24 mx-12 md:mx-auto md:px-12 max-w-screen-md">
      <StepNavigation />
      {displayStep(currentStep)}
    </div>
  );
};

export default OnboardingApplication;