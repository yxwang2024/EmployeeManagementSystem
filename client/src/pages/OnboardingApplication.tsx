import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { RootState } from '../store';
import { 
  updateName, 
  updateProfilePicture, 
  updateIdentity, 
  updateCurrentAddress, 
  updateContactInfo, 
  updateReference, 
  addEmergencyContact 
} from '../store/onboardingApplicationSlice';
import CustomTextField from '../components/CustomTextField';
import CustomSelectField from '../components/CustomSelectField';

const PersonalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  street: Yup.string().required('Street is required'),
  building: Yup.string().required('Building is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().required('Zip is required'),
  cellPhone: Yup.string().required('Cell phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const IdentityInfoSchema = Yup.object().shape({
  ssn: Yup.string().required('SSN is required'),
  dob: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
});

const ReferenceSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  relationship: Yup.string().required('Relationship is required'),
});

const EmergencyContactSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  relationship: Yup.string().required('Relationship is required'),
});

const OnboardingApplication: React.FC = () => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.onboardingApplication.email);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'noAnswer', label: 'I do not wish to answer' },
  ];

  return (
    <div className="onboarding-application">
      {step === 2 && (
        <Formik
          initialValues={{
            firstName: '',
            middleName: '',
            lastName: '',
            preferredName: '',
            profilePicture: '',
            street: '',
            building: '',
            city: '',
            state: '',
            zip: '',
            cellPhone: '',
            email: email || '',
          }}
          validationSchema={PersonalInfoSchema}
          onSubmit={(values) => {
            dispatch(updateName(values));
            dispatch(updateProfilePicture(values.profilePicture));
            dispatch(updateCurrentAddress({
              street: values.street,
              building: values.building,
              city: values.city,
              state: values.state,
              zip: values.zip,
            }));
            dispatch(updateContactInfo({ cellPhone: values.cellPhone }));
            handleNextStep();
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <h2>Personal Information</h2>
              <CustomTextField name="firstName" label="First Name" />
              <CustomTextField name="middleName" label="Middle Name" />
              <CustomTextField name="lastName" label="Last Name" />
              <CustomTextField name="preferredName" label="Preferred Name" />
              <CustomTextField name="profilePicture" label="Profile Picture" type="file" />
              <CustomTextField name="street" label="Street" />
              <CustomTextField name="building" label="Building/Apt #" />
              <CustomTextField name="city" label="City" />
              <CustomTextField name="state" label="State" />
              <CustomTextField name="zip" label="Zip" />
              <CustomTextField name="cellPhone" label="Cell Phone Number" />
              <CustomTextField name="email" label="Email" type="email" disabled />
              <button type="submit">Next</button>
            </Form>
          )}
        </Formik>
      )}

      {step === 1 && (
        <Formik
          initialValues={{
            ssn: '',
            dob: '',
            gender: '',
          }}
          validationSchema={IdentityInfoSchema}
          onSubmit={(values) => {
            dispatch(updateIdentity(values));
            handleNextStep();
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <h2>Identity Information</h2>
              <CustomTextField name="ssn" label="SSN" />
              <CustomTextField name="dob" label="Date of Birth" type="date" />
              <CustomSelectField name="gender" label="Gender" options={genderOptions} />
              <button type="button" onClick={handlePrevStep}>Previous</button>
              <button type="submit">Next</button>
            </Form>
          )}
        </Formik>
      )}

      {step === 3 && (
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            relationship: '',
            middleName: '',
            phone: '',
            email: '',
          }}
          validationSchema={ReferenceSchema}
          onSubmit={(values) => {
            dispatch(updateReference(values));
            handleNextStep();
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <h2>Reference</h2>
              <CustomTextField name="firstName" label="First Name" />
              <CustomTextField name="middleName" label="Middle Name" />
              <CustomTextField name="lastName" label="Last Name" />
              <CustomTextField name="relationship" label="Relationship" />
              <CustomTextField name="phone" label="Phone" />
              <CustomTextField name="email" label="Email" />
              <button type="button" onClick={handlePrevStep}>Previous</button>
              <button type="submit">Next</button>
            </Form>
          )}
        </Formik>
      )}

      {step === 4 && (
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            relationship: '',
            middleName: '',
            phone: '',
            email: '',
          }}
          validationSchema={EmergencyContactSchema}
          onSubmit={(values) => {
            dispatch(addEmergencyContact(values));
            handleNextStep();
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <h2>Emergency Contact</h2>
              <CustomTextField name="firstName" label="First Name" />
              <CustomTextField name="middleName" label="Middle Name" />
              <CustomTextField name="lastName" label="Last Name" />
              <CustomTextField name="relationship" label="Relationship" />
              <CustomTextField name="phone" label="Phone" />
              <CustomTextField name="email" label="Email" />
              <button type="button" onClick={handlePrevStep}>Previous</button>
              <button type="submit">Add Another</button>
              <button type="button" onClick={handleNextStep}>Next</button>
            </Form>
          )}
        </Formik>
      )}

      {step === 5 && (
        <div>
          <h2>Summary</h2>
          <button type="button" onClick={handlePrevStep}>Previous</button>
          <button type="submit">Submit</button>
        </div>
      )}
    </div>
  );
};

export default OnboardingApplication;