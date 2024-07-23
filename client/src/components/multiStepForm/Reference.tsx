import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateReference, setCurrentStep } from '../../store/oaInfo';
import CustomTextField from '../../components/CustomTextField';
import StepController from './StepController';

const ReferenceSchema = Yup.lazy(values => {
  const hasAnyValue = Object.values(values).some(val => val && val.trim() !== '');
  if (hasAnyValue) {
    return Yup.object().shape({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      relationship: Yup.string().required('Relationship is required'),
      middleName: Yup.string(),
      phone: Yup.string()
      .matches(/^[1-9][0-9]*$/, "Must be only digits and first digit cannot be 0")
      .min(10, 'Less than 10, must be exactly 10 digits')
      .max(10, 'More than 10, must be exactly 10 digits')
      .optional(),
      email: Yup.string().email('Invalid email'),
    });
  } else {
    return Yup.object().shape({
      firstName: Yup.string(),
      lastName: Yup.string(),
      relationship: Yup.string(),
      middleName: Yup.string(),
      phone: Yup.string(),
      email: Yup.string().email('Invalid email'),
    });
  }
});

const Reference: React.FC = () => {
  const dispatch = useDispatch();
  const reference = useSelector((state: RootState) => state.oaInfo.reference);

  return (
    <Formik
      initialValues={reference || { firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' }}
      validationSchema={ReferenceSchema}
      onSubmit={(values) => {
        const hasAnyValue = Object.values(values).some(val => val && val.trim() !== '');
        if (!hasAnyValue) {
          dispatch(updateReference(null));
        } else {
          dispatch(updateReference(values));
          localStorage.setItem('oaInfo', JSON.stringify({ reference: values }));
        }
        dispatch(setCurrentStep(6));
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Reference</h2>
          <div className='grid grid-col1 sm:grid-cols-2 sm:gap-x-8'>
            <CustomTextField name="firstName" label="First Name" />
            <CustomTextField name="lastName" label="Last Name" />
            <CustomTextField name="middleName" label="Middle Name" />
            <CustomTextField name="relationship" label="Relationship" />
            <CustomTextField name="phone" label="Phone" />
            <CustomTextField name="email" label="Email" />
          </div>
          <StepController 
            currentStep={5} 
            totalSteps={7} 
            onNext={handleSubmit}
            onSubmit={handleSubmit}
          />
        </Form>
      )}
    </Formik>
  );
};

export default Reference;
