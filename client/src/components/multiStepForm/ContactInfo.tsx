import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateContactInfo, setCurrentStep } from '../../store/onboardingApplicationSlice';
import CustomTextField from '../../components/CustomTextField';

const ContactInfoSchema = Yup.object().shape({
  cellPhone: Yup.string().required('Cell phone number is required'),
  workPhone: Yup.string(),
});

const ContactInfo: React.FC = () => {
  const dispatch = useDispatch();
  const contactInfo = useSelector((state: RootState) => state.onboardingApplication.contactInfo);

  return (
    <Formik
      initialValues={contactInfo}
      validationSchema={ContactInfoSchema}
      onSubmit={(values) => {
        dispatch(updateContactInfo(values));
        dispatch(setCurrentStep(4));
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Contact Information</h2>
          <CustomTextField name="cellPhone" label="Cell Phone Number" />
          <CustomTextField name="workPhone" label="Work Phone Number" />
          <div className='flex'>
            <button 
              type="button" 
              className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
              onClick={() => dispatch(setCurrentStep(2))}>
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

export default ContactInfo;