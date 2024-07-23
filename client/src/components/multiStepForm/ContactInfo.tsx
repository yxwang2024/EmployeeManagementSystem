import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateContactInfo, setCurrentStep } from '../../store/oaInfo';
import CustomTextField from '../../components/CustomTextField';
import StepController from './StepController';

const ContactInfoSchema = Yup.object().shape({
  cellPhone: Yup.string()
    .matches(/^[1-9][0-9]*$/, "Must be only digits and first digit cannot be 0")
    .min(10, 'Less than 10, must be exactly 10 digits')
    .max(10, 'More than 10, must be exactly 10 digits')
    .required('Primary contact cell phone is required')
    .test(
      'cellPhone-not-equal-workPhone',
      'Cell phone cannot be the same as work phone',
      function (value) {
        const { workPhone } = this.parent;
        return !workPhone || value !== workPhone;
      }
    ),
  workPhone: Yup.string()
    .matches(/^[1-9][0-9]*$/, "Must be only digits and first digit cannot be 0")
    .min(10, 'Less than 10, must be exactly 10 digits')
    .max(10, 'More than 10, must be exactly 10 digits')
    .optional()
    .test(
      'workPhone-not-equal-cellPhone',
      'Work phone cannot be the same as cell phone',
      function (value) {
        const { cellPhone } = this.parent;
        return !cellPhone || value !== cellPhone;
      }
    ),
});

const ContactInfo: React.FC = () => {
  const dispatch = useDispatch();
  const contactInfo = useSelector((state: RootState) => state.oaInfo.contactInfo);

  const handleValidationAndUpdate = (values: any) => {
    const isValid = ContactInfoSchema.isValidSync(values);
    if (isValid) {
      dispatch(updateContactInfo(values));
      localStorage.setItem('oaInfo', JSON.stringify({ ...contactInfo, ...values }));
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={contactInfo}
      validationSchema={ContactInfoSchema}
      onSubmit={(values) => {
        handleValidationAndUpdate(values);
        dispatch(setCurrentStep(4));
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Contact Information</h2>
          <CustomTextField name="cellPhone" label="Primary Contact Cell Pshone" label2="(US phone number only)" />
          <CustomTextField name="workPhone" label="Work Phone Number" label2="(US phone number only)" />
          <StepController 
            currentStep={3} 
            totalSteps={7} 
            onSubmit={handleSubmit} 
          />
        </Form>
      )}
    </Formik>
  );
};

export default ContactInfo;