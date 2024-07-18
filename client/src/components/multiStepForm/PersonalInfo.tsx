import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchOnboardingApplication, updatePersonalInfo, setCurrentStep, updateOAName, updateOAIdentity, getProfilePicUrl } from '../../store/onboardingApplicationSlice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomTextField from '../../components/CustomTextField';
import CustomSelectField from '../../components/CustomSelectField';
import CustomPNGorJPG from '../../components/CustomPNGorJPG';
import { PersonalInfoType, OaNameType } from '../../utils/type';

// Helper function to format date to YYYY-MM-DD
const formatDate = (timestamp: string | number | undefined): string => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp.toString(), 10));
  return date.toISOString().split('T')[0]; 
};

const PersonalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  ssn: Yup.string().matches(/^[0-9]+$/, "Must be only digits").min(9, 'Less than 9, must be exactly 9 digits').max(9, 'More than 9, must be exactly 9 digits').required('SSN is required'),
  dob: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  profilePicture: Yup.mixed().optional()
  .test("fileFormat", "Unsupported Format", value => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes(value.type)))
  .test("fileSize", "File too large", value => !value || (value && value.size <= 3 * 1024 * 1024)),
});

const PersonalInfo: React.FC = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.onboardingApplication.personalInfo);
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.user?.instance?.onboardingApplication?.id) {
      dispatch(fetchOnboardingApplication(auth.user.instance.onboardingApplication.id))
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch onboarding application:', error);
        });
    } else {
      console.error('auth.user.instance.onboardingApplication.id is undefined');
    }
  }, [dispatch, auth.user?.instance?.onboardingApplication?.id]);

  // Initialize form values with auth.user.email and format the date
  const initialValues = {
    ...personalInfo,
    email: auth.user?.email || '', // Use auth.user.email
    dob: formatDate(personalInfo.dob), // Ensure the date is formatted correctly
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'noAnswer', label: 'I do not wish to answer' },
  ];

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={PersonalInfoSchema}
      onSubmit={async (values, { setSubmitting }) => {
        console.log('Submitting form with values:', values);
        const personalInfo: PersonalInfoType = {
          firstName: values.firstName,
          middleName: values.middleName || '',
          lastName: values.lastName,
          preferredName: values.preferredName || '',
          profilePicture: '',
          email: values.email,
          ssn: values.ssn,
          dob: values.dob,
          gender: values.gender
        };
        dispatch(updatePersonalInfo({ personalInfo }));
        const oaName: OaNameType = {
          firstName: values.firstName,
          middleName: values.middleName || '',
          lastName: values.lastName,
          preferredName: values.preferredName || ''
        };
        dispatch(updateOAName(oaName));
        dispatch(updateOAIdentity({
          ssn: values.ssn,
          dob: values.dob,
          gender: values.gender
        }));
        if (values.profilePicture) {
          await dispatch(getProfilePicUrl("profilePicture", values.profilePicture));
        }
        setSubmitting(false);
        dispatch(setCurrentStep(2));
      }}
    >
      {({ handleSubmit, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Personal Information</h2>
          <CustomTextField name="firstName" label="First Name" />
          <CustomTextField name="middleName" label="Middle Name" />
          <CustomTextField name="lastName" label="Last Name" />
          <CustomTextField name="preferredName" label="Preferred Name" />
          <CustomPNGorJPG name="profilePicture" label="Profile Picture" type="file" onChange={(event) => {
            if (event.currentTarget.files) {
              setFieldValue("profilePicture", event.currentTarget.files[0]);
            }
          }} />
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