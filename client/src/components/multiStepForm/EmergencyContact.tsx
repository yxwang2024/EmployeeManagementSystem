import React, { useEffect, useState, useCallback } from 'react';
import { Formik, Form, FieldArray, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrentStep, updateEmergencyContact } from '../../store/oaInfo';
import CustomTextField from '../../components/CustomTextField';
import StepController from './StepController';
import { useLocation } from "react-router-dom";
import { GET_PROFILE_BY_ID, UPDATE_PROFILE_EMERGENCY_CONTACTS } from "../../services/queries";
import { request } from "../../utils/fetch";
import { useGlobal } from "../../store/hooks";
import { delayFunctionCall } from "../../utils/utilities";
import type { EmergencyContact } from '../../utils/type';

const EmergencyContactSchema = Yup.object().shape({
  emergencyContacts: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      relationship: Yup.string().required('Relationship is required'),
      middleName: Yup.string(),
      phone: Yup.string()
        .matches(/^(|[1-9][0-9]{9})$/, "Must be only 10 digits and the first digit cannot be 0"),
      email: Yup.string().email('Invalid email'),
    })
  )
});

const EmergencyContact: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboardingapplication";
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileId,setProfileId] = useState("");
  const emergencyContacts = useSelector((state: RootState) => state.oaInfo.emergencyContacts);
  const [isEditing, setIsEditing] = useState(false);
  // const [initialValues, setInitialValues] = useState({
  //   emergencyContacts: emergencyContacts.length ? emergencyContacts : [{ firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' }],
  // });
  const init = emergencyContacts.length ? emergencyContacts : [{ firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' }];

  const [initialValues, setInitialValues] = useState(
    isOnboarding
      ? { emergencyContacts: init }
      : { emergencyContacts: [ { firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' } ] }

  );

  const { showLoading, showMessage } = useGlobal();

  const getProfile = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    const response: any = await request(GET_PROFILE_BY_ID, { userId });
    const profile = response.data.getProfileByUserId;
    setProfileId(profile.id);
    const contacts = profile.emergencyContacts;
    setInitialValues({
      emergencyContacts: contacts.length ? contacts : [{ firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' }],
    });
  }, [user]);

  useEffect(() => {
    showLoading(true);
    if (isOnboarding) {
      setInitialValues({ emergencyContacts });
      delayFunctionCall(showLoading, 300, false);
    } else {
      getProfile()
        .then(() => delayFunctionCall(showLoading, 300, false))
        .catch(() => {
          showMessage('Failed to fetch emergency contacts', 'failed', 2000);
          showLoading(false);
        });
    }
  }, []);

  // useEffect(() => {
  //   setInitialValues({
  //     emergencyContacts: emergencyContacts.length ? emergencyContacts : [{ firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' }],
  //   });
  // }, [emergencyContacts]);

  const updateNewEmergencyContact= async (profileId:string,emergencyContacts:EmergencyContact) => {
    try {
      const response = await request(UPDATE_PROFILE_EMERGENCY_CONTACTS, {
        input: { id: profileId,emergencyContacts },
      });
      console.log("Update Profile Address Response:", response);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };

  const handleValidationAndUpdate = async (values: any, setFieldError: (field: string, message: string) => void) => {
    try {
      await EmergencyContactSchema.validate(values, { abortEarly: false });
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

      if (duplicates.length > 0) {
        duplicates.forEach(index => {
          setFieldError(`emergencyContacts.${index}.firstName`, 'Duplicate contact found');
          setFieldError(`emergencyContacts.${index}.lastName`, 'Duplicate contact found');
          setFieldError(`emergencyContacts.${index}.relationship`, 'Duplicate contact found');
        });
      } else {
        if (isOnboarding) {
          dispatch(updateEmergencyContact(values.emergencyContacts));
        } else {
          console.log("Updating emergency contacts");
          // update emergency contacts
        if(!profileId){
          throw new Error("Did not get profileId");
        }

        const newEmergencyContact = values.emergencyContacts.map(({ id, ...rest }) => rest);
        updateNewEmergencyContact(profileId,newEmergencyContact);        

        }
        dispatch(updateEmergencyContact(values.emergencyContacts));
        // const savedData = JSON.parse(localStorage.getItem(`oaInfo-${userId}`) || '{}');
        // localStorage.setItem(`oaInfo-${userId}`, JSON.stringify({ ...savedData, emergencyContacts: values.emergencyContacts }));
      }
    } catch (err) {
      err.inner.forEach((error: any) => {
        setFieldError(error.path, error.message);
      });
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

  const handleSave = async (values: any, actions: FormikHelpers<typeof initialValues>) => {
    await handleValidationAndUpdate(values, actions.setFieldError);
    actions.setSubmitting(false);
    setIsEditing(false);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={EmergencyContactSchema}
      onSubmit={(values, actions) => {
        handleSave(values, actions);
        if (isOnboarding) {
          dispatch(setCurrentStep(7));
        }
      }
      }
    >
      {({ handleSubmit, values, setFieldError, validateForm, resetForm }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Emergency Contact</h2>
          <FieldArray name="emergencyContacts">
            {({ remove, push }) => (
              <>
                {values.emergencyContacts.map((_, index) => (
                  <div key={index} className='mb-8'>
                    {index === 1 && <hr className="mb-8 border-stone-500 border-1 w-full col-span-1 sm:col-span-2" />}
                    <div className='grid grid-col1 sm:grid-cols-2 sm:gap-x-8'>
                      <CustomTextField name={`emergencyContacts.${index}.firstName`} label="First Name" disabled={!isOnboarding && !isEditing} />
                      <CustomTextField name={`emergencyContacts.${index}.lastName`} label="Last Name" disabled={!isOnboarding && !isEditing} />
                      <CustomTextField name={`emergencyContacts.${index}.middleName`} label="Middle Name" disabled={!isOnboarding && !isEditing} />
                      <CustomTextField name={`emergencyContacts.${index}.relationship`} label="Relationship" disabled={!isOnboarding && !isEditing} />
                      <CustomTextField name={`emergencyContacts.${index}.phone`} label="Phone" disabled={!isOnboarding && !isEditing} />
                      <CustomTextField name={`emergencyContacts.${index}.email`} label="Email" disabled={!isOnboarding && !isEditing} />
                      {index > 0 && (
                        <>
                          <button
                            type="button"
                            className='mt-4 mb-8 col-span-1 sm:col-span-2 w-full text-red-600 font-semibold border border-red-600 bg-red-50 rounded py-2'
                            onClick={() => remove(index)}
                            disabled={!isOnboarding && !isEditing}
                          >
                            Remove
                          </button>
                          <hr className="border-stone-500 border-1 w-full col-span-1 sm:col-span-2" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {isOnboarding || isEditing ? (
                  <div className='flex'>
                    <button
                      type="button"
                      className='col-span-1 sm:col-span-2 w-full bg-stone-400 font-semibold text-white rounded py-2'
                      onClick={() => push({ firstName: '', middleName: '', lastName: '', relationship: '', phone: '', email: '' })}
                    >
                      Add a Contact
                    </button>
                  </div>
                ) : null}
                {isOnboarding ? (
                  <StepController 
                    currentStep={6} 
                    totalSteps={7} 
                    onNext={async () => {
                      await validateForm();
                      handleValidationAndUpdate(values, setFieldError);
                    }}
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
              </>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};

export default EmergencyContact;