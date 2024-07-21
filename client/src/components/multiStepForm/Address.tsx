// import React from 'react';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
// import { updateAddress, setCurrentStep, updateOACurrentAddress } from '../../store/onboardingApplicationSlice';
// import CustomTextField from '../../components/CustomTextField';

// const AddressSchema = Yup.object().shape({
//   street: Yup.string().required('Street is required'),
//   building: Yup.string(),
//   city: Yup.string().required('City is required'),
//   state: Yup.string().required('State is required'),
//   zip: Yup.string().matches(/^[0-9]+$/, "Must be only digits").min(5, 'Less than 5, must be exactly 5 digits').max(5, 'More than 5, must be exactly 5 digits').required('Zip code is required'),
// });

// const Address: React.FC = () => {
//   const dispatch = useDispatch();
//   const address = useSelector((state: RootState) => state.onboardingApplication.address);

//   return (
//     <Formik
//       enableReinitialize
//       initialValues={address}
//       validationSchema={AddressSchema}
//       onSubmit={(values) => {
//         console.log('Form submitted with values:', values);
//         dispatch(updateAddress(values));
//         dispatch(updateOACurrentAddress(values));
//         dispatch(setCurrentStep(3)); 
//       }}
//     >
//       {({ handleSubmit }) => (
//         <Form onSubmit={handleSubmit}>
//           <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Address</h2>
//           <CustomTextField name="street" label="Street Name" />
//           <CustomTextField name="building" label="Building/Apt Number" />
//           <CustomTextField name="city" label="City" />
//           <CustomTextField name="state" label="State" />
//           <CustomTextField name="zip" label="Zip" />
//           <div className='flex'>
//             <button 
//               type="button" 
//               className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit e-auto px-4 py-2 text-md md:text-lg font-semibold'
//               onClick={() => dispatch(setCurrentStep(1))}>
//               Previous
//             </button>
//             <button 
//             type="submit"
//             className='bg-blue-600 text-white border rounded text-center w-1/2 sm:w-fit ms-auto px-4 py-2 text-md md:text-lg font-semibold'>
//               Next
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default Address;

import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateAddress, setCurrentStep } from '../../store/oaInfo';
import CustomTextField from '../../components/CustomTextField';
import StepController from './StepController';

const AddressSchema = Yup.object().shape({
  street: Yup.string().required('Street is required'),
  building: Yup.string(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().matches(/^[0-9]+$/, "Must be only digits").min(5, 'Less than 5, must be exactly 5 digits').max(5, 'More than 5, must be exactly 5 digits').required('Zip code is required'),
});

const Address: React.FC = () => {
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.oaInfo.address);

  const handleValidationAndUpdate = (values: any) => {
    const isValid = AddressSchema.isValidSync(values);
    if (isValid) {
      dispatch(updateAddress(values));
      localStorage.setItem('oaInfo', JSON.stringify({ ...address, ...values }));
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={address}
      validationSchema={AddressSchema}
      onSubmit={(values) => {
        handleValidationAndUpdate(values);
        dispatch(setCurrentStep(3));
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Address</h2>
          <div className='grid grid-col1 sm:grid-cols-2 sm:gap-x-8'>
            <div className='col-span-1 sm:col-span-2'>
            <CustomTextField name="street" label="Street Name" />
            </div>
            <CustomTextField name="building" label="Building/Apt Number" />
            <CustomTextField name="city" label="City" />
            <CustomTextField name="state" label="State" />
            <CustomTextField name="zip" label="Zip" />
          </div>
          <StepController 
            currentStep={2} 
            totalSteps={7} 
            onNext={handleSubmit}
            onSubmit={handleSubmit} 
          />
        </Form>
      )}
    </Formik>
  );
};

export default Address;