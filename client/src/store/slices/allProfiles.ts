import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { request, fileUploadRequest } from "../../utils/fetch";
import {
  ErrorResponseType,
  AllProfilesResponseType,
  AllProfilesStateType
} from "../../utils/type";


export const fetchAllProfiles =
() => async (dispatch: AppDispatch) => {
  const query = `
    query fetchAllProfiles {
      getAllProfiles {
        id
        name {
          firstName
          middleName
          lastName
        }
        identity {
          ssn
        }
        employment {
          visaTitle
        }
        contactInfo {
          cellPhone
        }
        email
      }
    }
  `;
  try {
    const response: AllProfilesResponseType = await request(query);
    const allProfiles = response.data.getAllProfiles;
    dispatch(updateAllVisaStatusList({ allProfiles: allProfiles }));
  } catch (error) {
    console.log(error);
    const err = error as ErrorResponseType;
    const message = err.message;
    console.log(message);
    // return message;
    return Promise.reject(message);
  }
};

const allProfilesInitialState: AllProfilesStateType = {
    allProfiles: [
        {
            id: "",
            email: "",
            name: {
                firstName: "",
                middleName: "",
                lastName: "",
                preferredName: "",
            },
            profilePicture: "",
            identity: {
                ssn: "",
                dob: "",
                gender: "",
            },
            currentAddress: {
                street: "",
                building: "",
                city: "",
                state: "",
                zip: "",
            },
            contactInfo: {
                cellPhone: "",
                workPhone: "",
            },
            employment: {
                visaTitle: "",
                startDate: "",
                endDate: "",
            },
            reference: {
                firstName: "",
                lastName: "",
                middleName: "",
                phone: "",
                email: "",
                relationship: "",
            },
            emergencyContacts: [
                {
                id: "",
                firstName: "",
                lastName: "",
                middleName: "",
                phone: "",
                email: "",
                relationship: "",
                },
            ],
            documents: [],
        },
    ],
  };

  export const allProfilesSlice = createSlice({
    name: "allProfiles",
    initialState:allProfilesInitialState,
    reducers: {
      updateAllVisaStatusList: (
        state,
        action: PayloadAction<AllProfilesStateType>
      ) => {
        state.allProfiles = action.payload.allProfiles;
      },
    },
  });
  
  export const { updateAllVisaStatusList } = allProfilesSlice.actions;
  
  export default allProfilesSlice.reducer;
  