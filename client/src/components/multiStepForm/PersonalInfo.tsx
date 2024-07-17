import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updatePersonalInfo, setCurrentStep } from '../../store/onboardingApplicationSlice';
import CustomTextField from '../../components/CustomTextField';
import CustomSelectField from '../../components/CustomSelectField';

const PersonalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  ssn: Yup.string().required('SSN is required'),
  dob: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
});

const PersonalInfo: React.FC = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.onboardingApplication.personalInfo);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'noAnswer', label: 'I do not wish to answer' },
  ];

  return (
    <Formik
      initialValues={personalInfo}
      validationSchema={PersonalInfoSchema}
      onSubmit={(values) => {
        dispatch(updatePersonalInfo(values));
        dispatch(setCurrentStep(2));
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Personal Information</h2>
          <CustomTextField name="firstName" label="First Name" />
          <CustomTextField name="middleName" label="Middle Name" />
          <CustomTextField name="lastName" label="Last Name" />
          <CustomTextField name="preferredName" label="Preferred Name" />
          <CustomTextField name="profilePicture" label="Profile Picture" type="file" />
          <CustomTextField name="email" label="Email" type="email" disabled />
          <CustomTextField name="ssn" label="SSN" />
          <CustomTextField name="dob" label="Date of Birth" type="date" />
          <CustomSelectField name="gender" label="Gender" options={genderOptions} />
          <button type="submit" className='flex mb-32 bg-blue-600 text-white border rounded text-center ms-auto px-4 py-2 text-md md:text-lg font-semibold'>Next</button>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalInfo;