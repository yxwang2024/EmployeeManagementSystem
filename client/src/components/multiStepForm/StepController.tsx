import React from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentStep } from '../../store/oaInfo';

interface StepControllerProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onSubmit: () => void;
}

const StepController: React.FC<StepControllerProps> = ({ currentStep, totalSteps, onNext, onSubmit }) => {
  const dispatch = useDispatch();

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
    onSubmit();
  };

  return (
    <div className='flex mt-8 mb-32'>
      {currentStep > 1 && (
        <button
          type="button"
          className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
          onClick={() => dispatch(setCurrentStep(currentStep - 1))}
        >
          Previous
        </button>
      )}
      <button
        type="button"
        className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit ms-auto px-4 py-2 text-md md:text-lg font-semibold'
        onClick={handleNext}
      >
        {currentStep === totalSteps ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};

export default StepController;