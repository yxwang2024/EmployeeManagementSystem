import React, { useState, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateEmployment, setCurrentStep, updateOAEmployment } from '../../store/onboardingApplicationSlice';
import CustomTextField from '../CustomTextField';
import CustomSelectField from '../CustomSelectField';
import CustomCheckbox from '../CustomCheckbox';
import CustomPDF from '../CustomPDF';

// Helper function to format date to YYYY-MM-DD
const formatDate = (timestamp: string | number | undefined): string => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp.toString(), 10));
  return date.toISOString().split('T')[0];
};

const DocumentSchema = Yup.object().shape({
  // isPermanentResidentOrCitizen: Yup.boolean().required('This field is required'),
  // visaTitle: Yup.string().when('isPermanentResidentOrCitizen', (isPermanentResidentOrCitizen, schema) => {
  //   return !isPermanentResidentOrCitizen ? schema.required('Visa Title is required') : schema;
  // }),
  // startDate: Yup.date().when('isPermanentResidentOrCitizen', (isPermanentResidentOrCitizen, schema) => {
  //   return !isPermanentResidentOrCitizen ? schema.required('Start Date is required') : schema;
  // }),
  // endDate: Yup.date().when('isPermanentResidentOrCitizen', (isPermanentResidentOrCitizen, schema) => {
  //   return !isPermanentResidentOrCitizen ? schema.required('End Date is required') : schema;
  // }),
  // otherVisa: Yup.string().when('visaTitle', (visaTitle, schema) => {
  //   return visaTitle === 'Other' ? schema.required('Please specify your visa title') : schema;
  // }),
  // driverLicense: Yup.mixed().optional(),
  isPermanentResidentOrCitizen: Yup.boolean().required('This field is required'),
  visaTitle: Yup.string().oneOf(['H1-B', 'L2', 'F1(CAPT/OPT)', 'H4', 'Other']).required("Work authorization is required"),
  startDate: Yup.date().required('Visa start Date is required'),
  endDate: Yup.date().required('Visa end Date is required'),
  otherVisa: Yup.string().optional(),
  driverLicense: Yup.mixed().optional().test("fileFormat", "Unsupported Format", value => {
    if (typeof value === 'string') return true; 
    return value && ["image/pdf"].includes(value.type);
  }).test("fileSize", "File too large", value => {
    if (typeof value === 'string') return true; 
    return value && value.size <= 10 * 1024 * 1024;
  }),
});

const Document: React.FC = () => {
  const dispatch = useDispatch();
  const employment = useSelector((state: RootState) => state.onboardingApplication.employment);
  // const [visaTitle, setVisaTitle] = useState(employment.visaTitle);
  // const [temp, setTemp] = useState(employment.visaTitle);
  
  const [isPermanentResidentOrCitizen, setIsPermanentResidentOrCitizen] = useState<boolean>(JSON.parse(localStorage.getItem('isPermanentResidentOrCitizen') || 'false'));

  const visaOptions = [
    { value: 'H1-B', label: 'H1-B' },
    { value: 'L2', label: 'L2' },
    { value: 'F1(CPT/OPT)', label: 'F1(CPT/OPT)' },
    { value: 'H4', label: 'H4' },
    { value: 'Other', label: 'Other' },
  ];

  const hasOptions = [
    { value: 'H1-B', label: 'H1-B' },
    { value: 'L2', label: 'L2' },
    { value: 'F1(CPT/OPT)', label: 'F1(CPT/OPT)' },
    { value: 'H4', label: 'H4' },
    { value: "", label: "" },
  ];

  // const [otherVisa, setOtherVisa] = useState(hasOptions.some(option => option.value === employment.visaTitle) ? '' : employment.visaTitle);

  // useEffect(() => {
  //   if (employment.visaTitle !== 'Other') {
  //     setVisaTitle(employment.visaTitle);
  //   } else {
  //     setVisaTitle(otherVisa);
  //   }
  // }, [employment.visaTitle, otherVisa]);

  const initialValues = {
    visaTitle: hasOptions.some(option => option.value === employment.visaTitle) ? employment.visaTitle : 'Other',
    startDate: formatDate(employment.startDate) || '',
    endDate: formatDate(employment.endDate) || '',
    otherVisa: !['H1-B', 'L2', 'F1(CPT/OPT)', 'H4'].includes(employment.visaTitle) ? employment.visaTitle : '',
    driverLicense: ' ',
    isPermanentResidentOrCitizen,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={DocumentSchema}
      validateOnBlur
      validateOnChange
      onSubmit={(values, actions: FormikHelpers<typeof initialValues>) => {
        const employmentData = {
          visaTitle: values.visaTitle === 'Other' ? values.otherVisa : values.visaTitle,
          startDate: values.startDate,
          endDate: values.endDate,
        };
        dispatch(updateEmployment(employmentData));
        dispatch(updateOAEmployment(employmentData));
        dispatch(setCurrentStep(5));
        // actions.setSubmitting(false);
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Documents</h2>
          <CustomCheckbox
            name="isPermanentResidentOrCitizen"
            label="Permanent resident or citizen of the U.S.?"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const checked = e.target.checked;
              setFieldValue('isPermanentResidentOrCitizen', checked);
              setIsPermanentResidentOrCitizen(checked);
              localStorage.setItem('isPermanentResidentOrCitizen', JSON.stringify(checked));
            }}
          />
          {!values.isPermanentResidentOrCitizen && (
            <>
              <CustomSelectField
                name="visaTitle"
                label="What is your work authorization?"
                options={visaOptions}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedVisaTitle = e.target.value;
                  setFieldValue('visaTitle', selectedVisaTitle);
                  // setVisaTitle(selectedVisaTitle);
                }}
              />
              {values.visaTitle === 'F1(CPT/OPT)' && <CustomTextField name="optReceipt" label="OPT Receipt" type="file" />}
              {values.visaTitle === 'Other' && <CustomTextField name="otherVisa" label="Specify Visa Title" />}
              <CustomTextField name="startDate" label="Start Date" type="date" />
              <CustomTextField name="endDate" label="End Date" type="date" />
            </>
          )}
          
            <CustomPDF 
              name="driverLicense" 
              label="Driver's License" 
              type="file"  
              // onChange={(event) => {
              //   if (event.currentTarget.files) {
              //     setFieldValue("profilePicture", event.currentTarget.files[0]);
              //   }
              // }} 
            />
          <div className='flex mb-32'>
            <button
              type="button"
              className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
              onClick={() => dispatch(setCurrentStep(3))}>
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

export default Document;