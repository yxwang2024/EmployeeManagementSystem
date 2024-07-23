import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updatePersonalInfo, setCurrentStep } from '../../store/oaInfo';
import CustomTextField from '../../components/CustomTextField';
import CustomSelectField from '../../components/CustomSelectField';
import CustomFile from '../../components/CustomFile';
import StepController from './StepController';

const PersonalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  ssn: Yup.string().matches(/^[0-9]+$/, "Must be only digits").min(9, 'Less than 9, must be exactly 9 digits').max(9, 'More than 9, must be exactly 9 digits').required('SSN is required'),
  dob: Yup.date()
  .required('Date of birth is required')
  .test('future-date', 'Please enter a valid date of birth', function (value) {
    if (!value) return true;
    const today = new Date();
    const birthDate = new Date(value);
    return birthDate <= today;
  })
  .test('age-test', 'You have to be over 18 to submit the application', function (value) {
    if (!value) return true;
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    if (age > 18) {
      return true;
    } else if (age === 18) {
      if (monthDifference > 0) {
        return true;
      } else if (monthDifference === 0 && dayDifference >= 0) {
        return true;
      }
    }
    return false;
  })
  .test('within-100-years', 'Please select a date that is at least 100 years before now', function (value) {
    if (!value) return true;
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age <= 100;
  }),
  gender: Yup.string().required('Gender is required'),
});

const PersonalInfo: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const personalInfo = useSelector((state: RootState) => state.oaInfo.personalInfo);

  useEffect(() => {
    if (user?.email && !personalInfo.email) {
      dispatch(updatePersonalInfo({ email: user.email }));
    }
  }, [dispatch, user?.email, personalInfo.email]);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'noAnswer', label: 'I do not wish to answer' },
  ];

  const handleValidationAndUpdate = (values: any) => {
    const isValid = PersonalInfoSchema.isValidSync(values);
    if (isValid) {
      dispatch(updatePersonalInfo(values));
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={personalInfo}
      validationSchema={PersonalInfoSchema}
      onSubmit={(values) => {
        handleValidationAndUpdate(values);
        dispatch(setCurrentStep(2));
      }}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Personal Information</h2>
          <div className='grid grid-col1 sm:grid-cols-2 sm:gap-x-8'>
            <CustomTextField name="firstName" label="First Name" />
            <CustomTextField name="lastName" label="Last Name" />
            <CustomTextField name="middleName" label="Middle Name" />
            <CustomTextField name="preferredName" label="Preferred Name" />
            <div className='col-span-1 sm:col-span-2'>
              <CustomFile 
                name="profilePicture" 
                label="Profile Picture" 
                type="file" 
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0];
                    const FILE_SIZE = 3 * 1024 * 1024; // 3 MB
                    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

                    if (!SUPPORTED_FORMATS.includes(file.type)) {
                      event.target.value = "";
                      setFieldValue("profilePicture", "", false);
                      return alert('Please upload as PNG, JPG or JPEG.');
                    } else if (file.size > FILE_SIZE) {
                      event.target.value = "";
                      setFieldValue("profilePicture", "", false);
                      return alert('Max size 3 MB');
                    } else {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => setFieldValue("profilePicture", reader.result);
                      reader.onerror = (error) => console.error('Error reading file:', error);
                    }
                  }
                }} 
              />
            </div>
            <CustomTextField name="email" label="Email" type="email" disabled />
            <CustomTextField name="ssn" label="SSN" />
            <CustomTextField 
              name="dob" 
              label="Date of Birth" 
              type="date" 
              onKeyDown={(e) => e.preventDefault()} 
              onPaste={(e) => e.preventDefault()}  
            />
            <CustomSelectField name="gender" label="Gender" options={genderOptions} />
          </div>
          <StepController 
            currentStep={1} 
            totalSteps={7} 
            onNext={() => handleValidationAndUpdate(values)}
            onSubmit={handleSubmit} 
          />
        </Form>
      )}
    </Formik>
  );
};

export default PersonalInfo;