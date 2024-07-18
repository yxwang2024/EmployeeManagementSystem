import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateAddress, setCurrentStep, updateOACurrentAddress } from '../../store/onboardingApplicationSlice';
import CustomTextField from '../../components/CustomTextField';

const AddressSchema = Yup.object().shape({
  street: Yup.string().required('Street is required'),
  building: Yup.string(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().required('Zip is required'),
});

const Address: React.FC = () => {
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.onboardingApplication.address);

  return (
    <Formik
      enableReinitialize
      initialValues={address}
      validationSchema={AddressSchema}
      onSubmit={(values) => {
        console.log('Form submitted with values:', values);
        dispatch(updateAddress(values));
        dispatch(updateOACurrentAddress(values));
        dispatch(setCurrentStep(3)); 
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Address</h2>
          <CustomTextField name="street" label="Street" />
          <CustomTextField name="building" label="Building" />
          <CustomTextField name="city" label="City" />
          <CustomTextField name="state" label="State" />
          <CustomTextField name="zip" label="Zip" />
          <button type="submit" className='flex mb-32 bg-blue-600 text-white border rounded text-center ms-auto px-4 py-2 text-md md:text-lg font-semibold'>Next</button>
        </Form>
      )}
    </Formik>
  );
};

export default Address;