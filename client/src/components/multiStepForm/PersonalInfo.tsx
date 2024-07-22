// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
// import { fetchOnboardingApplication, updatePersonalInfo, setCurrentStep, updateOAName, updateOAIdentity, getProfilePicUrl } from '../../store/onboardingApplicationSlice';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import CustomTextField from '../../components/CustomTextField';
// import CustomSelectField from '../../components/CustomSelectField';
// import CustomPNGorJPG from '../../components/CustomPNGorJPG';
// import { PersonalInfoType, OaNameType } from '../../utils/type';

// // Helper function to format date to YYYY-MM-DD
// const formatDate = (timestamp: string | number | undefined): string => {
//   if (!timestamp) return '';
//   const date = new Date(parseInt(timestamp.toString(), 10));
//   return date.toISOString().split('T')[0]; 
// };

// const PersonalInfoSchema = Yup.object().shape({
//   firstName: Yup.string().required('First name is required'),
//   lastName: Yup.string().required('Last name is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   ssn: Yup.string().matches(/^[0-9]+$/, "Must be only digits").min(9, 'Less than 9, must be exactly 9 digits').max(9, 'More than 9, must be exactly 9 digits').required('SSN is required'),
//   dob: Yup.date().required('Date of birth is required'),
//   gender: Yup.string().required('Gender is required'),
//   profilePicture: Yup.mixed().optional()
//     .test("fileFormat", "Unsupported Format", value => {
//       if (typeof value === 'string') return true; 
//       return value && ["image/jpg", "image/jpeg", "image/png"].includes(value.type);
//     })
//     .test("fileSize", "File too large", value => {
//       if (typeof value === 'string') return true; 
//       return value && value.size <= 3 * 1024 * 1024;
//     }),
// });

// const PersonalInfo: React.FC = () => {
//   const dispatch = useDispatch();
//   const personalInfoState = useSelector((state: RootState) => state.onboardingApplication.personalInfo);
//   const auth = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     if (auth.user?.instance?.onboardingApplication?.id) {
//       dispatch(fetchOnboardingApplication(auth.user.instance.onboardingApplication.id))
//         .unwrap()
//         .catch((error) => {
//           console.error('Failed to fetch onboarding application:', error);
//         });
//     } else {
//       console.error('auth.user.instance.onboardingApplication.id is undefined');
//     }
//   }, [dispatch, auth.user?.instance?.onboardingApplication?.id]);

//   // Initialize form values with auth.user.email and format the date
//   const initialValues = {
//     ...personalInfoState,
//     email: auth.user?.email || '', // Use auth.user.email
//     dob: formatDate(personalInfoState.dob), // Ensure the date is formatted correctly
//     profilePicture: personalInfoState.profilePicture || 'placeholder'
//   };

//   const genderOptions = [
//     { value: 'male', label: 'Male' },
//     { value: 'female', label: 'Female' },
//     { value: 'noAnswer', label: 'I do not wish to answer' },
//   ];

//   return (
//     <Formik
//       enableReinitialize
//       initialValues={initialValues}
//       validationSchema={PersonalInfoSchema}
//       onSubmit={async (values, { setSubmitting }) => {
//         console.log('Submitting form with values:', values);
//         const personalInfo: PersonalInfoType = {
//           firstName: values.firstName,
//           middleName: values.middleName || '',
//           lastName: values.lastName,
//           preferredName: values.preferredName || '',
//           profilePicture: values.profilePicture || '',
//           email: values.email,
//           ssn: values.ssn,
//           dob: values.dob,
//           gender: values.gender
//         };
//         dispatch(updatePersonalInfo({ personalInfo }));
//         const oaName: OaNameType = {
//           firstName: values.firstName,
//           middleName: values.middleName || '',
//           lastName: values.lastName,
//           preferredName: values.preferredName || ''
//         };
//         dispatch(updateOAName(oaName));
//         dispatch(updateOAIdentity({
//           ssn: values.ssn,
//           dob: values.dob,
//           gender: values.gender
//         }));
//         if (values.profilePicture && typeof(values.profilePicture) === 'object') {
//           await dispatch(getProfilePicUrl("profilePicture", values.profilePicture));
//         }
//         setSubmitting(false);
//         dispatch(setCurrentStep(2));
//       }}
//     >
//       {({ handleSubmit, setFieldValue, values }) => (
//         <Form onSubmit={handleSubmit}>
//           <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Personal Information</h2>
//           <CustomTextField name="firstName" label="First Name" />
//           <CustomTextField name="middleName" label="Middle Name" />
//           <CustomTextField name="lastName" label="Last Name" />
//           <CustomTextField name="preferredName" label="Preferred Name" />
//           {personalInfoState.profilePicture !== "placeholder" && 
//             <>
//               <img className='pt-4' src={personalInfoState.profilePicture}/>
//               <p className='text-gray-600 ml-4 text-sm md:text-md mb-4'>Here's the profile picture you just upload, if you want to modify it, do that later in edit profile.</p>
//             </> 
//           }
//           {personalInfoState.profilePicture === "placeholder" && 
//             <CustomPNGorJPG name="profilePicture" label="Profile Picture" type="file" onChange={(event) => {
//             if (event.currentTarget.files) {
//               setFieldValue("profilePicture", event.currentTarget.files[0]);
//             }
//           }} />
//           }
//           <CustomTextField name="email" label="Email" type="email" disabled />
//           <CustomTextField name="ssn" label="SSN" />
//           <CustomTextField name="dob" label="Date of Birth" type="date" />
//           <CustomSelectField name="gender" label="Gender" options={genderOptions} />
//           <button type="submit" className='flex mb-32 bg-blue-600 text-white border rounded text-center ms-auto px-4 py-2 text-md md:text-lg font-semibold'>Next</button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default PersonalInfo;

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