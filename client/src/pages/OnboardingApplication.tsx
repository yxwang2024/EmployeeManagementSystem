import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import StepNavigation from '../components/multiStepForm/StepNavigation';
import PersonalInfoStep from '../components/multiStepForm/PersonalInfo';
import AddressStep from '../components/multiStepForm/Address';
import ContactInfoStep from '../components/multiStepForm/ContactInfo';
import DocumentStep from '../components/multiStepForm/Document';
import ReferenceStep from '../components/multiStepForm/Reference';
import EmergencyContactStep from '../components/multiStepForm/EmergencyContact';
import SummaryStep from '../components/multiStepForm/Summary';

const OnboardingApplication: React.FC = () => {
  const currentStep = useSelector((state: RootState) => state.onboardingApplication.currentStep);

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
    <div className="onboarding-application mt-24 mx-12 md:mx-auto max-w-screen-md">
        <StepNavigation />
        {displayStep(currentStep)}
    </div>
  );
};

export default OnboardingApplication;