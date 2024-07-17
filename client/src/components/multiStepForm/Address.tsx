import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateAddress, setCurrentStep } from '../../store/onboardingApplicationSlice';
import CustomTextField from '../../components/CustomTextField';

const AddressSchema = Yup.object().shape({
  street: Yup.string().required('Street is required'),
  building: Yup.string().required('Building is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().required('Zip is required'),
});

const Address: React.FC = () => {
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.onboardingApplication.address);

  return (
    <Formik
      initialValues={address}
      validationSchema={AddressSchema}
      onSubmit={(values) => {
        dispatch(updateAddress(values));
        dispatch(setCurrentStep(3));
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Address</h2>
          <CustomTextField name="street" label="Street" />
          <CustomTextField name="building" label="Building/Apt #" />
          <CustomTextField name="city" label="City" />
          <CustomTextField name="state" label="State" />
          <CustomTextField name="zip" label="Zip" />
          <div className='flex mb-32'>
            <button 
              type="button" 
              className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
              onClick={() => dispatch(setCurrentStep(1))}>
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

export default Address;