// import React, { useState, useEffect } from 'react';
// import { Formik, Form, FormikHelpers } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
// import { updateEmployment, setCurrentStep, updateOAEmployment } from '../../store/onboardingApplicationSlice';
// import CustomTextField from '../CustomTextField';
// import CustomSelectField from '../CustomSelectField';
// import CustomCheckbox from '../CustomCheckbox';
// import CustomPDF from '../CustomPDF';

// // Helper function to format date to YYYY-MM-DD
// const formatDate = (timestamp: string | number | undefined): string => {
//   if (!timestamp) return '';
//   const date = new Date(parseInt(timestamp.toString(), 10));
//   return date.toISOString().split('T')[0];
// };

// const DocumentSchema = Yup.object().shape({
//   // isPermanentResidentOrCitizen: Yup.boolean().required('This field is required'),
//   // visaTitle: Yup.string().when('isPermanentResidentOrCitizen', (isPermanentResidentOrCitizen, schema) => {
//   //   return !isPermanentResidentOrCitizen ? schema.required('Visa Title is required') : schema;
//   // }),
//   // startDate: Yup.date().when('isPermanentResidentOrCitizen', (isPermanentResidentOrCitizen, schema) => {
//   //   return !isPermanentResidentOrCitizen ? schema.required('Start Date is required') : schema;
//   // }),
//   // endDate: Yup.date().when('isPermanentResidentOrCitizen', (isPermanentResidentOrCitizen, schema) => {
//   //   return !isPermanentResidentOrCitizen ? schema.required('End Date is required') : schema;
//   // }),
//   // otherVisa: Yup.string().when('visaTitle', (visaTitle, schema) => {
//   //   return visaTitle === 'Other' ? schema.required('Please specify your visa title') : schema;
//   // }),
//   // driverLicense: Yup.mixed().optional(),
//   isPermanentResidentOrCitizen: Yup.boolean().required('This field is required'),
//   visaTitle: Yup.string().oneOf(['H1-B', 'L2', 'F1(CAPT/OPT)', 'H4', 'Other']).required("Work authorization is required"),
//   startDate: Yup.date().required('Visa start Date is required'),
//   endDate: Yup.date().required('Visa end Date is required'),
//   otherVisa: Yup.string().optional(),
//   driverLicense: Yup.mixed().optional().test("fileFormat", "Unsupported Format", value => {
//     if (typeof value === 'string') return true; 
//     return value && ["image/pdf"].includes(value.type);
//   }).test("fileSize", "File too large", value => {
//     if (typeof value === 'string') return true; 
//     return value && value.size <= 10 * 1024 * 1024;
//   }),
// });

// const Document: React.FC = () => {
//   const dispatch = useDispatch();
//   const employment = useSelector((state: RootState) => state.onboardingApplication.employment);
//   // const [visaTitle, setVisaTitle] = useState(employment.visaTitle);
//   // const [temp, setTemp] = useState(employment.visaTitle);
  
//   const [isPermanentResidentOrCitizen, setIsPermanentResidentOrCitizen] = useState<boolean>(JSON.parse(localStorage.getItem('isPermanentResidentOrCitizen') || 'false'));

//   const visaOptions = [
//     { value: 'H1-B', label: 'H1-B' },
//     { value: 'L2', label: 'L2' },
//     { value: 'F1(CPT/OPT)', label: 'F1(CPT/OPT)' },
//     { value: 'H4', label: 'H4' },
//     { value: 'Other', label: 'Other' },
//   ];

//   const hasOptions = [
//     { value: 'H1-B', label: 'H1-B' },
//     { value: 'L2', label: 'L2' },
//     { value: 'F1(CPT/OPT)', label: 'F1(CPT/OPT)' },
//     { value: 'H4', label: 'H4' },
//     { value: "", label: "" },
//   ];

//   // const [otherVisa, setOtherVisa] = useState(hasOptions.some(option => option.value === employment.visaTitle) ? '' : employment.visaTitle);

//   // useEffect(() => {
//   //   if (employment.visaTitle !== 'Other') {
//   //     setVisaTitle(employment.visaTitle);
//   //   } else {
//   //     setVisaTitle(otherVisa);
//   //   }
//   // }, [employment.visaTitle, otherVisa]);

//   const initialValues = {
//     visaTitle: hasOptions.some(option => option.value === employment.visaTitle) ? employment.visaTitle : 'Other',
//     startDate: formatDate(employment.startDate) || '',
//     endDate: formatDate(employment.endDate) || '',
//     otherVisa: !['H1-B', 'L2', 'F1(CPT/OPT)', 'H4'].includes(employment.visaTitle) ? employment.visaTitle : '',
//     driverLicense: ' ',
//     isPermanentResidentOrCitizen,
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={DocumentSchema}
//       validateOnBlur
//       validateOnChange
//       onSubmit={(values, actions: FormikHelpers<typeof initialValues>) => {
//         const employmentData = {
//           visaTitle: values.visaTitle === 'Other' ? values.otherVisa : values.visaTitle,
//           startDate: values.startDate,
//           endDate: values.endDate,
//         };
//         dispatch(updateEmployment(employmentData));
//         dispatch(updateOAEmployment(employmentData));
//         dispatch(setCurrentStep(5));
//         // actions.setSubmitting(false);
//       }}
//     >
//       {({ handleSubmit, values, setFieldValue }) => (
//         <Form onSubmit={handleSubmit}>
//           <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Documents</h2>
//           <CustomCheckbox
//             name="isPermanentResidentOrCitizen"
//             label="Permanent resident or citizen of the U.S.?"
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//               const checked = e.target.checked;
//               setFieldValue('isPermanentResidentOrCitizen', checked);
//               setIsPermanentResidentOrCitizen(checked);
//               localStorage.setItem('isPermanentResidentOrCitizen', JSON.stringify(checked));
//             }}
//           />
//           {!values.isPermanentResidentOrCitizen && (
//             <>
//               <CustomSelectField
//                 name="visaTitle"
//                 label="What is your work authorization?"
//                 options={visaOptions}
//                 onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
//                   const selectedVisaTitle = e.target.value;
//                   setFieldValue('visaTitle', selectedVisaTitle);
//                   // setVisaTitle(selectedVisaTitle);
//                 }}
//               />
//               {values.visaTitle === 'F1(CPT/OPT)' && <CustomTextField name="optReceipt" label="OPT Receipt" type="file" />}
//               {values.visaTitle === 'Other' && <CustomTextField name="otherVisa" label="Specify Visa Title" />}
//               <CustomTextField name="startDate" label="Start Date" type="date" />
//               <CustomTextField name="endDate" label="End Date" type="date" />
//             </>
//           )}
          
//             <CustomPDF 
//               name="driverLicense" 
//               label="Driver's License" 
//               type="file"  
//               // onChange={(event) => {
//               //   if (event.currentTarget.files) {
//               //     setFieldValue("profilePicture", event.currentTarget.files[0]);
//               //   }
//               // }} 
//             />
//           <div className='flex mb-32'>
//             <button
//               type="button"
//               className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
//               onClick={() => dispatch(setCurrentStep(3))}>
//               Previous
//             </button>
//             <button
//               type="submit"
//               className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit ms-auto px-4 py-2 text-md md:text-lg font-semibold'>
//               Next
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default Document;

import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrentStep, updateDocument } from '../../store/oaInfo';
import CustomTextField from '../../components/CustomTextField';
import CustomSelectField from '../../components/CustomSelectField';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomFile from '../../components/CustomFile';
import StepController from './StepController';

const DocumentSchema = Yup.object().shape({
  isCitizen: Yup.boolean().required('This field is required'),
  visaTitle: Yup.string().test('is-required', 'Work Authorization is required', function (value) {
    const { isCitizen } = this.parent;
    return isCitizen || (value && value.trim() !== '');
  }),
  startDate: Yup.string().test('is-required', 'Start Date is required', function (value) {
    const { isCitizen } = this.parent;
    return isCitizen || (value && value.trim() !== '');
  }).test('is-within-last-10-years', 'Start Date must be within the last 10 years', function (value) {
    const { isCitizen } = this.parent;
    if (isCitizen || !value || value.trim() === '') return true;
    const date = new Date(value);
    const now = new Date();
    const tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
    return date >= tenYearsAgo;
  }),
  endDate: Yup.string().test('is-required', 'End Date is required', function (value) {
    const { isCitizen } = this.parent;
    return isCitizen || (value && value.trim() !== '');
  }).test('is-after-start-date', 'End Date must be after Start Date', function (value) {
    const { isCitizen, startDate } = this.parent;
    if (isCitizen || !value || value.trim() === '' || !startDate || startDate.trim() === '') return true;
    const start = new Date(startDate);
    const end = new Date(value);
    return end > start;
  }).test('is-after-today', 'You need a valid work authorization to apply', function (value) {
    const { isCitizen } = this.parent;
    if (isCitizen || !value || value.trim() === '') return true;
    const date = new Date(value);
    const now = new Date();
    return date > now;
  }),
  otherVisa: Yup.string().test('otherVisa', 'Please specify your visa title', function (value) {
    const { isCitizen, visaTitle } = this.parent;
    if (!isCitizen && visaTitle === 'Other') {
      return !!value;
    }
    return true;
  }),
  optReceipt: Yup.string().test('optReceipt', 'OPT Receipt is required', function (value) {
    const { isCitizen, visaTitle } = this.parent;
    if (!isCitizen && visaTitle === 'F1(CPT/OPT)') {
      return !!value;
    }
    return true;
  }),
});

const Document: React.FC = () => {
  const dispatch = useDispatch();
  const document = useSelector((state: RootState) => state.oaInfo.document);

  const visaOptions = [
    { value: 'H1-B', label: 'H1-B' },
    { value: 'L2', label: 'L2' },
    { value: 'F1(CPT/OPT)', label: 'F1(CPT/OPT)' },
    { value: 'H4', label: 'H4' },
    { value: 'Other', label: 'Other' },
  ];

  const initialValues = {
    isCitizen: document.isCitizen || false,
    visaTitle: document.visaTitle || '',
    startDate: document.startDate || '',
    endDate: document.endDate || '',
    otherVisa: document.otherVisa || '',
    optReceipt: document.optReceipt || '',
    driverLicense: document.driverLicense || '',
  };

  const handleValidationAndUpdate = (values: any, actions: FormikHelpers<typeof initialValues>) => {
    if (values.isCitizen) {
      const documentData = {
        isCitizen: values.isCitizen,
        visaTitle: '',
        startDate: '',
        endDate: '',
        otherVisa: '',
        optReceipt: '',
        driverLicense: values.driverLicense,
      };
      dispatch(updateDocument(documentData));
      dispatch(setCurrentStep(5));
      actions.setSubmitting(false);
    } else {
      DocumentSchema.validate(values, { abortEarly: false })
        .then(() => {
          const documentData = {
            isCitizen: values.isCitizen,
            visaTitle: values.visaTitle,
            startDate: values.startDate,
            endDate: values.endDate,
            otherVisa: values.otherVisa,
            optReceipt: values.optReceipt,
            driverLicense: values.driverLicense,
          };
          dispatch(updateDocument(documentData));
          dispatch(setCurrentStep(5));
          actions.setSubmitting(false);
        })
        .catch((errors) => {
          actions.setErrors(errors.inner.reduce((acc: any, error: any) => {
            acc[error.path] = error.message;
            return acc;
          }, {}));
          actions.setSubmitting(false);
        });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={DocumentSchema}
      validateOnBlur
      validateOnChange
      onSubmit={handleValidationAndUpdate}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Documents</h2>
          <div className='grid grid-col1 sm:grid-cols-2 sm:gap-x-8'>
            <div className='mb-4 col-span-1 sm:col-span-2'>
              <CustomCheckbox
                name="isCitizen"
                label="Permanent resident or citizen of the U.S.?"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const checked = e.target.checked;
                  setFieldValue('isCitizen', checked);
                  if (checked) {
                    setFieldValue('visaTitle', '');
                    setFieldValue('startDate', '');
                    setFieldValue('endDate', '');
                    setFieldValue('otherVisa', '');
                    setFieldValue('optReceipt', '');
                  }
                }}
              />
            </div>
            {!values.isCitizen && (
              <>
                <CustomSelectField
                  name="visaTitle"
                  label="Work Authorization"
                  options={visaOptions}
                />
                {values.visaTitle === 'F1(CPT/OPT)' && 
                  <CustomFile 
                    name="optReceipt" 
                    label="OPT Receipt" 
                    type="file" 
                    onChange={(event) => {
                      if (event.currentTarget.files) {
                        const file = event.currentTarget.files[0];
                        const FILE_SIZE = 10 * 1024 * 1024; 
                        const SUPPORTED_FORMATS = ["application/pdf"];
    
                        if (!SUPPORTED_FORMATS.includes(file.type)) {
                          event.target.value = "";
                          setFieldValue("optReceipt", "", false);
                          return alert('Please upload as PDF.');
                        } else if (file.size > FILE_SIZE) {
                          event.target.value = "";
                          setFieldValue("optReceipt", "", false);
                          return alert('Max size 10 MB');
                        } else {
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = () => setFieldValue("optReceipt", reader.result);
                          reader.onerror = (error) => console.error('Error reading file:', error);
                        }
                      }
                  }} 
                />
                }
                {values.visaTitle === 'Other' && <CustomTextField name="otherVisa" label="Specify Visa Title" />}
                <CustomTextField 
                  name="startDate" 
                  label="Start Date" 
                  type="date" 
                  onKeyDown={(e) => e.preventDefault()} 
                  onPaste={(e) => e.preventDefault()}  
                />
                <CustomTextField 
                  name="endDate" 
                  label="End Date" 
                  type="date" 
                  onKeyDown={(e) => e.preventDefault()} 
                  onPaste={(e) => e.preventDefault()}  
                />
              </>
            )}
            <div className='col-span-1 sm:col-span-2'>
              <CustomFile 
                name="driverLicense" 
                label="Driver License" 
                type="file" 
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0];
                    const FILE_SIZE = 5 * 1024 * 1024; 
                    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "application/pdf"];

                    if (!SUPPORTED_FORMATS.includes(file.type)) {
                      event.target.value = "";
                      setFieldValue("driverLicense", "", false);
                      return alert('Please upload as PDF, PNG, JPG or JPEG.');
                    } else if (file.size > FILE_SIZE) {
                      event.target.value = "";
                      setFieldValue("driverLicense", "", false);
                      return alert('Max size 5 MB');
                    } else {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => setFieldValue("driverLicense", reader.result);
                      reader.onerror = (error) => console.error('Error reading file:', error);
                    }
                  }
                }} 
              />
            </div>
          </div>
          <StepController 
            currentStep={4} 
            totalSteps={7} 
            onNext={handleSubmit} 
            onSubmit={handleSubmit} 
          />
        </Form>
      )}
    </Formik>
  );
};

export default Document;