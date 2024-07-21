// import React from 'react';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
// import { addEmergencyContact, updateEmergencyContact, setCurrentStep } from '../../store/onboardingApplicationSlice';
// import CustomTextField from '../../components/CustomTextField';

// const EmergencyContactSchema = Yup.object().shape({
//   firstName: Yup.string().required('First name is required'),
//   lastName: Yup.string().required('Last name is required'),
//   relationship: Yup.string().required('Relationship is required'),
//   middleName: Yup.string(),
//   phone: Yup.string(),
//   email: Yup.string().email('Invalid email'),
// });

// const EmergencyContact: React.FC = () => {
//   const dispatch = useDispatch();
//   const emergencyContacts = useSelector((state: RootState) => state.onboardingApplication.emergencyContacts);

//   return (
//     <Formik
//       initialValues={{ firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' }}
//       validationSchema={EmergencyContactSchema}
//       onSubmit={(values) => {
//         dispatch(addEmergencyContact(values));
//       }}
//     >
//       {({ handleSubmit }) => (
//         <Form onSubmit={handleSubmit}>
//           <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Emergency Contact</h2>
//           <CustomTextField name="firstName" label="First Name" />
//           <CustomTextField name="middleName" label="Middle Name" />
//           <CustomTextField name="lastName" label="Last Name" />
//           <CustomTextField name="relationship" label="Relationship" />
//           <CustomTextField name="phone" label="Phone" />
//           <CustomTextField name="email" label="Email" />
//           <div className='flex'>
//             <button 
//               type="button" 
//               className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
//               onClick={() => dispatch(setCurrentStep(5))}>
//               Previous
//             </button>
//             <button 
//               type="submit"
//               onClick={() => dispatch(setCurrentStep(7))}
//               className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit ms-auto px-4 py-2 text-md md:text-lg font-semibold'>
//               Next
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default EmergencyContact;

import React from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
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
      phone: Yup.string(),
      email: Yup.string().email('Invalid email'),
    })
  )
});

const EmergencyContact: React.FC = () => {
  const dispatch = useDispatch();
  const emergencyContacts = useSelector((state: RootState) => state.oaInfo.emergencyContacts);

  const handleNextStep = async (values: any, setErrors: Function, validateForm: Function) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      dispatch(updateEmergencyContact(values.emergencyContacts));
      const savedData = JSON.parse(localStorage.getItem('oaInfo') || '{}');
      localStorage.setItem('oaInfo', JSON.stringify({ ...savedData, emergencyContacts: values.emergencyContacts }));
      dispatch(setCurrentStep(7));
    } else {
      setErrors(errors);
    }
  };

  return (
    <Formik
      initialValues={{ emergencyContacts: emergencyContacts.length ? emergencyContacts : [{ firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' }] }}
      validationSchema={EmergencyContactSchema}
      onSubmit={(values, { setErrors, validateForm }) => handleNextStep(values, setErrors, validateForm)}
    >
      {({ handleSubmit, values, setErrors, validateForm }) => (
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
                            className='mt-4 mb-8 col-span-1 sm:col-span-2 w-full text-red-600 font-semibold border border-stone-300 rounded py-2'
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
                  onNext={() => handleSubmit()}
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