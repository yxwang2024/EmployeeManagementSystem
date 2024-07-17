import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const steps = [
  'Personal Information',
  'Address',
  'Contact Info',
  'Documents',
  'Reference',
  'Emergency Contact',
  'Summary',
];

const StepNavigation: React.FC = () => {
  const currentStep = useSelector((state: RootState) => state.onboardingApplication.currentStep);
  const [newStep, setNewStep] = useState<any[]>([]);
  const stepRef = useRef<any[]>([]);

  const updateStep = (stepNumber: number, steps: any[]) => {
    const newSteps = [...steps];
    let count = 0;
    while (count < newSteps.length) {
      if (count === stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          selected: true,
        };
        count++;
      } else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          selected: true,
        };
        count++;
      } else {
        newSteps[count] = {
          ...newSteps[count],
          selected: false,
        };
        count++;
      }
    }
    return newSteps;
  };

  useEffect(() => {
    const stepsState = steps.map((step, index) =>
      Object.assign(
        {},
        {
          description: step,
          selected: index === 0 ? true : false,
        }
      )
    );
    stepRef.current = stepsState;
    const current = updateStep(currentStep - 1, stepRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  const displaySteps = newStep.map((step, index) => {
    return (
      <div key={index} className={`mb-24 ${index !== newStep.length - 1 ? "flex items-center w-full" : "flex items-center"}`}>
        <div className="relative flex flex-col items-center">
          <div className={`rounded-full h-3 w-3 sm:h-5 sm:w-5 flex items-center justify-center border ${
            step.selected ? "bg-blue-600" :  "border-gray-300"
          }`}></div>
          <div className="hidden sm:block absolute top-0 text-center mt-8 w-32 text-black text-base font-light">
            {step.description}
          </div>
        </div>
        {index !== newStep.length - 1 && <div className="flex-auto border-t-2"></div>}
      </div>
    );
  });

  return (
    <section className="m-auto max-w-screen-2xl px-8 md:px-12 lg:px-16 xl:px-20 w-full flex justify-between items-center">
      {displaySteps}
    </section>
  );
};

export default StepNavigation;