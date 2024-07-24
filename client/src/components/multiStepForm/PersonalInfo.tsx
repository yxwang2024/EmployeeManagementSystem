import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updatePersonalInfo, setCurrentStep } from "../../store/oaInfo";
import CustomTextField from "../../components/CustomTextField";
import CustomSelectField from "../../components/CustomSelectField";
import CustomFile from "../../components/CustomFile";
import StepController from "./StepController";
import { useLocation } from "react-router-dom";
import { GET_PROFILE_BY_ID, UPDATE_PROFILE_ADDRESS, UPDATE_PROFILE_IDENTITY, UPDATE_PROFILE_NAME, UPDATE_PROFILE_PIC } from "../../services/queries";
import { request } from "../../utils/fetch";
import { useGlobal } from "../../store/hooks";
import { delayFunctionCall } from "../../utils/utilities";
import { Typography } from "@mui/material";
import { Address, Identity, Name } from "../../utils/type";

const PersonalInfoSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  middleName: Yup.string(),
  preferredName: Yup.string(),
  profilePicture: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  ssn: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(9, "Less than 9, must be exactly 9 digits")
    .max(9, "More than 9, must be exactly 9 digits")
    .required("SSN is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .test(
      "future-date",
      "Please enter a valid date of birth",
      function (value) {
        if (!value) return true;
        const today = new Date();
        const birthDate = new Date(value);
        return birthDate <= today;
      }
    )
    .test(
      "age-test",
      "You have to be over 18 to submit the application",
      function (value) {
        if (!value) return true;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();
        if (age > 18) {
          return true;
        } else if (age === 18) {
          if (monthDifference > 0) {
            return true;
          } else if (monthDifference === 0 && dayDifference >= 0) {
            return true;
          }
        }
        return false;
      }
    )
    .test(
      "within-100-years",
      "Please select a date that is at least 100 years before now",
      function (value) {
        if (!value) return true;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        return age <= 100;
      }
    ),
  gender: Yup.string().required("Gender is required"),
});

const PersonalInfo: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboardingapplication";
  const [isEditing, setIsEditing] = useState(false);
  const personalInfo = useSelector(
    (state: RootState) => state.oaInfo.personalInfo
  );
  const [initialValues, setInitialValues] = useState(
    isOnboarding
      ? personalInfo
      : {
          firstName: "",
          lastName: "",
          middleName: "",
          preferredName: "",
          email: "",
          ssn: "",
          dob: "",
          gender: "",
          profilePicture: "",
        }
  );
  const [profileId,setProfileId] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const { showLoading, showMessage } = useGlobal();

  const getProfile = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    console.log("userId", userId);
    const response: any = await request(GET_PROFILE_BY_ID, { userId });
    const profile = response.data.getProfileByUserId;
    setProfileId(profile.id);
    console.log("profile", profile);
    setInitialValues({
      firstName: profile.name.firstName,
      lastName: profile.name.lastName,
      middleName: profile.name.middleName,
      preferredName: profile.name.preferredName,
      email: profile.email,
      ssn: profile.identity.ssn,
      dob: profile.identity.dob,
      gender: profile.identity.gender,
      profilePicture: profile.profilePicture,
    });
  }, [user]);

  useEffect(() => {
    showLoading(true);
    if (isOnboarding) {
      setInitialValues(personalInfo);
      delayFunctionCall(showLoading, 300, false);
    } else {
      getProfile()
        .then(() => delayFunctionCall(showLoading, 300, false))
        .catch(() => {
          showMessage("Failed to fetch profile information", "failed", 2000);
          showLoading(false);
        });
    }
  }, []);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "noAnswer", label: "I do not wish to answer" },
  ];

  const updateProfileName= async (profileId:string,name:Name) => {
    try {
      const response = await request(UPDATE_PROFILE_NAME, {
        input: { id: profileId, firstName:name.firstName, middleName:name.middleName,lastName:name.lastName,preferredName:name.preferredName},
      });
      console.log("Update name Response:", response);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };

  const updateProfileIdentity= async (profileId:string,identity:Identity) => {
    try {
      const response = await request(UPDATE_PROFILE_IDENTITY, {
        input: { id: profileId, ssn:identity.ssn,dob:identity.dob,gender:identity.gender},
      });
      console.log("Update identity Response:", response);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };

  const updateProfilePic = async (profileId:string,profilePicture:string) => {
    try {
      const response = await request(UPDATE_PROFILE_PIC, {
        input: { id: profileId, profilePicture},
      });
      console.log("Update ProfilePic Response:", response);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  };

  const handleValidationAndUpdate = (values: any) => {
    const isValid = PersonalInfoSchema.isValidSync(values);
    if (isValid) {
      if (isOnboarding) {
        dispatch(updatePersonalInfo(values));
      } else {
        console.log("update profile");
        console.log("values", values);

        if(!profileId){
          throw new Error("Did not get profileId");
        }

        // update name
        // update identity
        // update profile picture
        const newName:Name = {
          firstName:values.firstName,
          lastName:values.lastName,
          middleName:values.middleName||"",
          preferredName:values.preferredName||"",
        }
        updateProfileName(profileId,newName);

        const newIdentity:Identity = {
          ssn:values.ssn,
          dob:values.dob.toString(),
          gender:values.gender
        }
        updateProfileIdentity(profileId,newIdentity);
        updateProfilePic(profileId,values.profilePicture||"");
      }
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
      validationSchema={PersonalInfoSchema}
      onSubmit={(values, actions) => {
        handleSave(values, actions);
        if (isOnboarding) {
          dispatch(setCurrentStep(2));
        }
      }}
    >
      {({ handleSubmit, setFieldValue, values, resetForm }) => (
        <Form onSubmit={handleSubmit}>
          <h2 className="text-center font-semibold text-gray-700 text-2xl md:text-3xl mb-10">
            Personal Information
          </h2>
          {values.profilePicture &&
              values.profilePicture === "placeholder" ? (
                <Typography>No profile picture uploaded</Typography>
              ) : (
                <img
                  src={values.profilePicture}
                  alt="Profile"
                  className="w-28 h-28 rounded-full mx-auto mb-2"
                />
          )}
          <div className="grid grid-col1 sm:grid-cols-2 sm:gap-x-8">
            <CustomTextField
              name="firstName"
              label="First Name"
              disabled={!isOnboarding && !isEditing}
            />
            <CustomTextField
              name="lastName"
              label="Last Name"
              disabled={!isOnboarding && !isEditing}
            />
            <CustomTextField
              name="middleName"
              label="Middle Name"
              disabled={!isOnboarding && !isEditing}
            />
            <CustomTextField
              name="preferredName"
              label="Preferred Name"
              disabled={!isOnboarding && !isEditing}
            />
            <div className="col-span-1 sm:col-span-2">
              <CustomFile
                name="profilePicture"
                label="Profile Picture"
                type="file"
                disabled={!isOnboarding && !isEditing}
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0];
                    const FILE_SIZE = 3 * 1024 * 1024; // 3 MB
                    const SUPPORTED_FORMATS = [
                      "image/jpg",
                      "image/jpeg",
                      "image/png",
                    ];

                    if (!SUPPORTED_FORMATS.includes(file.type)) {
                      event.target.value = "";
                      setFieldValue("profilePicture", "", false);
                      return alert("Please upload as PNG, JPG or JPEG.");
                    } else if (file.size > FILE_SIZE) {
                      event.target.value = "";
                      setFieldValue("profilePicture", "", false);
                      return alert("Max size 3 MB");
                    } else {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () =>
                        setFieldValue("profilePicture", reader.result);
                      reader.onerror = (error) =>
                        console.error("Error reading file:", error);
                    }
                  }
                }}
              />
            </div>
            <CustomTextField name="email" label="Email" type="email" disabled />
            <CustomTextField
              name="ssn"
              label="SSN"
              disabled={!isOnboarding && !isEditing}
            />
            <CustomTextField
              name="dob"
              label="Date of Birth"
              type="date"
              disabled={!isOnboarding && !isEditing}
              onKeyDown={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
            />
            <CustomSelectField
              name="gender"
              label="Gender"
              options={genderOptions}
              disabled={!isOnboarding && !isEditing}
            />
          </div>
          {isOnboarding ? (
            <StepController
              currentStep={1}
              totalSteps={7}
              onNext={() => handleValidationAndUpdate(values)}
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

export default PersonalInfo;
