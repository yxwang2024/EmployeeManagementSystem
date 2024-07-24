import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrentStep, updateEmergencyContact } from '../../store/oaInfo';
import CustomTextField from '../../components/CustomTextField';
import StepController from './StepController';

const EmergencyContactSchema = Yup.object().shape({
  emergencyContacts: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      relationship: Yup.string().required('Relationship is required'),
      middleName: Yup.string(),
      phone: Yup.string()
      .matches(/^[1-9][0-9]*$/, "Must be only digits and first digit cannot be 0")
      .min(10, 'Less than 10, must be exactly 10 digits')
      .max(10, 'More than 10, must be exactly 10 digits')
      .optional(),
      email: Yup.string().email('Invalid email'),
    })
  )
});

const EmergencyContact: React.FC = () => {
  const dispatch = useDispatch();
  const emergencyContacts = useSelector((state: RootState) => state.oaInfo.emergencyContacts);
  const userId = useSelector((state: RootState) => state.oaInfo.userId);

  const handleNextStep = async (values: any, setFieldError: Function, validateForm: Function) => {
    const errors = await validateForm();
    const seen = new Map();
    const duplicates: number[] = [];

    values.emergencyContacts.forEach((contact: any, index: number) => {
      const combination = `${contact.firstName}${contact.lastName}${contact.relationship}`;
      if (seen.has(combination)) {
        duplicates.push(index);
        duplicates.push(seen.get(combination));
      } else {
        seen.set(combination, index);
      }
    });

    duplicates.forEach(index => {
      setFieldError(`emergencyContacts.${index}.firstName`, 'Duplicate contact found');
      setFieldError(`emergencyContacts.${index}.lastName`, 'Duplicate contact found');
      setFieldError(`emergencyContacts.${index}.relationship`, 'Duplicate contact found');
    });

    if (Object.keys(errors).length === 0 && duplicates.length === 0) {
      dispatch(updateEmergencyContact(values.emergencyContacts));
      const savedData = JSON.parse(localStorage.getItem(`oaInfo-${userId}`) || '{}');
      localStorage.setItem(`oaInfo-${userId}`, JSON.stringify({ ...savedData, emergencyContacts: values.emergencyContacts }));
      dispatch(setCurrentStep(7));
    }
  };

  return (
    <Formik
      initialValues={{ emergencyContacts: emergencyContacts.length ? emergencyContacts : [{ firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' }] }}
      validationSchema={EmergencyContactSchema}
      onSubmit={(values, { setFieldError, validateForm }) => handleNextStep(values, setFieldError, validateForm)}
    >
      {({ handleSubmit, values, setFieldError, validateForm }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Emergency Contact</h2>
          <FieldArray name="emergencyContacts">
            {({ remove, push }) => (
              <>
                {values.emergencyContacts.map((_, index) => (
                  <div key={index} className='mb-8'>
                    {index === 1 &&
                      <hr className="mb-8 border-stone-500 border-1 w-full col-span-1 sm:col-span-2"></hr>
                    }
                    <div className='grid grid-col1 sm:grid-cols-2 sm:gap-x-8'>
                      <CustomTextField name={`emergencyContacts.${index}.firstName`} label="First Name" />
                      <CustomTextField name={`emergencyContacts.${index}.lastName`} label="Last Name" />
                      <CustomTextField name={`emergencyContacts.${index}.middleName`} label="Middle Name" />
                      <CustomTextField name={`emergencyContacts.${index}.relationship`} label="Relationship" />
                      <CustomTextField name={`emergencyContacts.${index}.phone`} label="Phone" />
                      <CustomTextField name={`emergencyContacts.${index}.email`} label="Email" />
                    
                      {index > 0 && (
                        <>
                          <button
                            type="button"
                            className='mt-4 mb-8 col-span-1 sm:col-span-2 w-full text-red-600 font-semibold border border-red-600 bg-red-50 rounded py-2 '
                            onClick={() => remove(index)}
                          >
                            Remove
                          </button>
                          <hr className=" border-stone-500 border-1 w-full col-span-1 sm:col-span-2"></hr>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div className='flex'>
                  <button
                    type="button"
                    className='col-span-1 sm:col-span-2 w-full bg-stone-400 font-semibold text-white rounded py-2'
                    onClick={() => push({ firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' })}
                  >
                    Add a Contact
                  </button>
                </div>
                <StepController 
                  currentStep={6} 
                  totalSteps={7} 
                  onNext={() => handleNextStep(values, setFieldError, validateForm)} 
                  onSubmit={handleSubmit} 
                />
              </>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};

export default EmergencyContact;