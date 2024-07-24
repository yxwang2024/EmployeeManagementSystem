import React, { useEffect, useState } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState(document);

  useEffect(() => {
    setInitialValues(document);
  }, [document]);

  const visaOptions = [
    { value: 'H1-B', label: 'H1-B' },
    { value: 'L2', label: 'L2' },
    { value: 'F1(CPT/OPT)', label: 'F1(CPT/OPT)' },
    { value: 'H4', label: 'H4' },
    { value: 'Other', label: 'Other' },
  ];

  const handleValidationAndUpdate = (values: any) => {
    const isValid = DocumentSchema.isValidSync(values);
    if (isValid) {
      dispatch(updateDocument(values));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = (resetForm: (nextState?: Partial<typeof initialValues>) => void) => {
    const confirmCancel = window.confirm('Do you want to discard all changes?');
    if (confirmCancel) {
      resetForm();
      setIsEditing(false);
    }
  };

  const handleSave = (values: any, actions: FormikHelpers<typeof initialValues>) => {
    handleValidationAndUpdate(values);
    setIsEditing(false);
    actions.setSubmitting(false);
  };

  const isOnboarding = window.location.pathname === '/onboardingapplication';

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={DocumentSchema}
      onSubmit={(values, actions) => {
        handleSave(values, actions);
        if (isOnboarding) {
          dispatch(setCurrentStep(5));
        }
      }}
    >
      {({ handleSubmit, values, setFieldValue, resetForm }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>
            {isOnboarding ? 'Document' : 'Employment Information'}
          </h2>
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
                disabled={!isOnboarding && !isEditing}
              />
            </div>
            {!values.isCitizen && (
              <>
                <CustomSelectField
                  name="visaTitle"
                  label="Work Authorization"
                  options={visaOptions}
                  disabled={!isOnboarding && !isEditing}
                />
                {values.visaTitle === 'F1(CPT/OPT)' && 
                  <CustomFile 
                    name="optReceipt" 
                    label="OPT Receipt" 
                    type="file" 
                    disabled={!isOnboarding && !isEditing}
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
                {values.visaTitle === 'Other' && <CustomTextField name="otherVisa" label="Specify Visa Title" disabled={!isOnboarding && !isEditing} />}
                <CustomTextField 
                  name="startDate" 
                  label="Start Date" 
                  type="date" 
                  onKeyDown={(e) => e.preventDefault()} 
                  onPaste={(e) => e.preventDefault()}  
                  disabled={!isOnboarding && !isEditing}
                />
                <CustomTextField 
                  name="endDate" 
                  label="End Date" 
                  type="date" 
                  onKeyDown={(e) => e.preventDefault()} 
                  onPaste={(e) => e.preventDefault()}  
                  disabled={!isOnboarding && !isEditing}
                />
              </>
            )}
            <div className='col-span-1 sm:col-span-2'>
              <CustomFile 
                name="driverLicense" 
                label="Driver License" 
                type="file" 
                disabled={!isOnboarding && !isEditing}
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
          {isOnboarding ? (
            <StepController 
              currentStep={4} 
              totalSteps={7} 
              onNext={() => handleValidationAndUpdate(values)}
              onSubmit={handleSubmit} 
            />
          ) : (
            <div className='mt-8'>
              {isEditing ? (
                <div className='flex'>
                  <button type="button" className='px-4 py-2 bg-blue-600 text-white font-semibold rounded mr-4 flex me-auto' onClick={() => handleCancel(resetForm)}>Cancel</button>
                  <button type="submit" className='px-4 py-2 bg-blue-600 text-white font-semibold rounded flex ms-auto'>Save</button>
                </div>
              ) : (
                <button type="button" className='px-4 py-2 bg-blue-600 text-white font-semibold rounded' onClick={handleEdit}>Edit</button>
              )}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default Document;