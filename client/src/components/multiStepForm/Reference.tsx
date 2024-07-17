import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateReference, setCurrentStep } from '../../store/onboardingApplicationSlice';
import CustomTextField from '../../components/CustomTextField';

const ReferenceSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  relationship: Yup.string().required('Relationship is required'),
  middleName: Yup.string(),
  phone: Yup.string(),
  email: Yup.string().email('Invalid email'),
});

const Reference: React.FC = () => {
  const dispatch = useDispatch();
  const reference = useSelector((state: RootState) => state.onboardingApplication.reference);

  return (
    <Formik
      initialValues={reference || { firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' }}
      validationSchema={ReferenceSchema}
      onSubmit={(values) => {
        dispatch(updateReference(values));
        dispatch(setCurrentStep(6));
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Reference</h2>
          <CustomTextField name="firstName" label="First Name" />
          <CustomTextField name="middleName" label="Middle Name" />
          <CustomTextField name="lastName" label="Last Name" />
          <CustomTextField name="relationship" label="Relationship" />
          <CustomTextField name="phone" label="Phone" />
          <CustomTextField name="email" label="Email" />
          <div className='flex'>
            <button 
              type="button" 
              className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
              onClick={() => dispatch(setCurrentStep(4))}>
              Previous
            </button>
            <button 
            type="submit"
            className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit ms-auto px-4 py-2 text-md md:text-lg font-semibold'>
              Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Reference;