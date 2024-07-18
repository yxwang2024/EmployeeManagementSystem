import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateDocument, setCurrentStep } from '../../store/onboardingApplicationSlice';
import CustomTextField from '../CustomTextField';
import CustomSelectField from '../CustomSelectField';

const DocumentSchema = Yup.object().shape({
  visaTitle: Yup.string().required('Visa Title is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required'),
  optReceipt: Yup.string(),
  otherVisa: Yup.string(),
  driverLicense: Yup.string(),
});

const Document: React.FC = () => {
  const dispatch = useDispatch();
  const document = useSelector((state: RootState) => state.onboardingApplication.document);

  const visaOptions = [
    { value: 'Green Card', label: 'Green Card' },
    { value: 'Citizen', label: 'Citizen' },
    { value: 'H1-B', label: 'H1-B' },
    { value: 'L2', label: 'L2' },
    { value: 'F1(CPT/OPT)', label: 'F1(CPT/OPT)' },
    { value: 'H4', label: 'H4' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <Formik
      initialValues={document}
      validationSchema={DocumentSchema}
      onSubmit={(values) => {
        dispatch(updateDocument(values));
        dispatch(setCurrentStep(5));
      }}
    >
      {({ handleSubmit, values }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Documents</h2>
          <CustomSelectField name="visaTitle" label="Visa Title" options={visaOptions} />
          {values.visaTitle === 'F1(CPT/OPT)' && <CustomTextField name="optReceipt" label="OPT Receipt" />}
          {values.visaTitle === 'Other' && <CustomTextField name="otherVisa" label="Specify Visa Title" />}
          <CustomTextField name="startDate" label="Start Date" type="date" />
          <CustomTextField name="endDate" label="End Date" type="date" />
          <CustomTextField name="driverLicense" label="Driver's License" type="file" />
          <div className='flex'>
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