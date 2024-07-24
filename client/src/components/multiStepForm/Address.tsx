import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateAddress, setCurrentStep } from "../../store/oaInfo";
import CustomTextField from "../../components/CustomTextField";
import StepController from "./StepController";
import { useLocation } from "react-router-dom";
import { GET_PROFILE_BY_ID } from "../../services/queries";
import { request } from "../../utils/fetch";
import { useGlobal } from "../../store/hooks";
import { delayFunctionCall } from "../../utils/utilities";
import { Typography } from "@mui/material";

const AddressSchema = Yup.object().shape({
  street: Yup.string().required("Street is required"),
  building: Yup.string(),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zip: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(5, "Less than 5, must be exactly 5 digits")
    .max(5, "More than 5, must be exactly 5 digits")
    .required("Zip code is required"),
});

const Address: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboardingapplication";
  const user = useSelector((state: RootState) => state.auth.user);
  const address = useSelector((state: RootState) => state.oaInfo.address);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState(
    isOnboarding
      ? address
      : { street: "", building: "", city: "", state: "", zip: "" }
  );
  const { showLoading, showMessage } = useGlobal();

  const getProfile = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    console.log("userId", userId);
    const response: any = await request(GET_PROFILE_BY_ID, { userId });
    const profile = response.data.getProfileByUserId;
    console.log("profile", profile);
    setInitialValues({
      street: profile.currentAddress.street,
      building: profile.currentAddress.building,
      city: profile.currentAddress.city,
      state: profile.currentAddress.state,
      zip: profile.currentAddress.zip,
    });
  }, [user]);

  useEffect(() => {
    showLoading(true);
    if (isOnboarding) {
      setInitialValues(address);
      delayFunctionCall(showLoading, 300, false);
    } else {
      getProfile()
        .then(() => delayFunctionCall(showLoading, 300, false))
        .catch(() => {
          showMessage("Failed to fetch profile address", "failed", 2000);
          showLoading(false);
        });
    }
  }, []);

  const handleValidationAndUpdate = (values: any) => {
    const isValid = AddressSchema.isValidSync(values);
    if (isValid) {
      if (isOnboarding) {
        dispatch(updateAddress(values));
      } else {
        console.log("Updating address");
        // update address
      }
      // dispatch(updateAddress(values));
      // localStorage.setItem(`oaInfo-${userId}`, JSON.stringify({ ...address, ...values }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = (
    resetForm: (nextState?: Partial<typeof initialValues>) => void
  ) => {
    const confirmCancel = window.confirm("Do you want to discard all changes?");
    if (confirmCancel) {
      resetForm();
      setIsEditing(false);
    }
  };

  const handleSave = (
    values: any,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    handleValidationAndUpdate(values);
    setIsEditing(false);
    actions.setSubmitting(false);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={AddressSchema}
      onSubmit={(values, actions) => {
        handleSave(values, actions);
        if (isOnboarding) {
          dispatch(setCurrentStep(3));
        }
      }}
    >
      {({ handleSubmit, values, resetForm }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className="text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10">
            Address
          </h2>
          <div className="grid grid-col1 sm:grid-cols-2 sm:gap-x-8">
            <div className="col-span-1 sm:col-span-2">
              <CustomTextField
                name="street"
                label="Street Name"
                disabled={!isOnboarding && !isEditing}
              />
            </div>
            <CustomTextField
              name="building"
              label="Building/Apt Number"
              disabled={!isOnboarding && !isEditing}
            />
            <CustomTextField
              name="city"
              label="City"
              disabled={!isOnboarding && !isEditing}
            />
            <CustomTextField
              name="state"
              label="State"
              disabled={!isOnboarding && !isEditing}
            />
            <CustomTextField
              name="zip"
              label="Zip"
              disabled={!isOnboarding && !isEditing}
            />
          </div>
          {isOnboarding ? (
            <StepController
              currentStep={2}
              totalSteps={7}
              onNext={handleSubmit}
              onSubmit={handleSubmit}
            />
          ) : (
            <div className="mt-8">
              {isEditing ? (
                <div className="flex">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded mr-4 flex me-auto"
                    onClick={() => handleCancel(resetForm)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded flex ms-auto"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default Address;
