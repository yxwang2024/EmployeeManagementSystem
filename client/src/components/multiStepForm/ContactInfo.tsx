import React, { useEffect, useState, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateContactInfo, setCurrentStep } from '../../store/oaInfo';
import CustomTextField from '../../components/CustomTextField';
import StepController from './StepController';
import { useLocation } from 'react-router-dom';
import { GET_PROFILE_BY_ID, UPDATE_PROFILE_CONTACT_INFO } from "../../services/queries";
import { request } from "../../utils/fetch";
import { useGlobal } from "../../store/hooks";
import { delayFunctionCall } from "../../utils/utilities";
import { Typography } from "@mui/material";
import type { ContactInfo } from '../../utils/type';

const ContactInfoSchema = Yup.object().shape({
  cellPhone: Yup.string()
    .matches(/^[1-9][0-9]*$/, "Must be only digits and the first digit cannot be 0")
    .min(10, 'Less than 10, must be exactly 10 digits')
    .max(10, 'More than 10, must be exactly 10 digits')
    .required('Primary contact cell phone is required')
    .test(
      'cellPhone-not-equal-workPhone',
      'Cell phone cannot be the same as work phone',
      function (value) {
        const { workPhone } = this.parent;
        return !workPhone || value !== workPhone;
      }
    ),
  workPhone: Yup.string()
    .matches(/^(|[1-9][0-9]{9})$/, "Must be only 10 digits and the first digit cannot be 0")
    .test(
      'workPhone-not-equal-cellPhone',
      'Work phone cannot be the same as cell phone',
      function (value) {
        const { cellPhone } = this.parent;
        return !cellPhone || value !== cellPhone;
      }
    ),
});

const ContactInfo: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboardingapplication";
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileId,setProfileId] = useState("");
  const contactInfo = useSelector((state: RootState) => state.oaInfo.contactInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState(
    isOnboarding
      ? contactInfo
      : { cellPhone: "", workPhone: "" }
  );

  const { showLoading, showMessage } = useGlobal();

  const getProfile = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    const response: any = await request(GET_PROFILE_BY_ID, { userId });
    const profile = response.data.getProfileByUserId;
    setProfileId(profile.id);
    setInitialValues({
      cellPhone: profile.contactInfo.cellPhone,
      workPhone: profile.contactInfo.workPhone,
    });
  }, [user]);

  useEffect(() => {
    showLoading(true);
    if (isOnboarding) {
      setInitialValues(contactInfo);
      delayFunctionCall(showLoading, 300, false);
    } else {
      getProfile()
        .then(() => delayFunctionCall(showLoading, 300, false))
        .catch(() => {
          showMessage("Failed to fetch profile contact info", "failed", 2000);
          showLoading(false);
        });
    }
  }, []);

  const updateNewContactInfo = async (profileId:string,contactInfo:ContactInfo) => {
    try {
      const response = await request(UPDATE_PROFILE_CONTACT_INFO, {
        input: { id: profileId, cellPhone:contactInfo.cellPhone,workPhone:contactInfo.workPhone},
      });
      console.log("Update Profile Contact Info Response:", response);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };

  const handleValidationAndUpdate = (values: any) => {
    const isValid = ContactInfoSchema.isValidSync(values);
    if (isValid) {
      if (isOnboarding) {
        dispatch(updateContactInfo(values));
      } else {
        console.log("Updating Contact Info");
        // update address
        if(!profileId){
          throw new Error("Did not get profileId");
        }

        const newContactInfo = {
          cellPhone:values.cellPhone,
          workPhone:values.workPhone||""
        }
        updateNewContactInfo(profileId,newContactInfo);
      }
      
      // localStorage.setItem(`oaInfo-${userId}`, JSON.stringify({ ...contactInfo, ...values }));
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

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={ContactInfoSchema}
      onSubmit={(values, actions) => {
        handleSave(values, actions);
        if (isOnboarding) {
          dispatch(setCurrentStep(4));
        }
      }}
    >
      {({ handleSubmit, values, resetForm }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className='text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10'>Contact Information</h2>
          <div className='grid grid-col1 sm:grid-cols-2 sm:gap-x-8'>
            <CustomTextField name="cellPhone" label="Primary Contact Phone" label2="(US phone number only)" disabled={!isOnboarding && !isEditing} />
            <CustomTextField name="workPhone" label="Work Phone Number" label2="(US phone number only)" disabled={!isOnboarding && !isEditing} />
          </div>
          {isOnboarding ? (
            <StepController 
              currentStep={3} 
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

export default ContactInfo;