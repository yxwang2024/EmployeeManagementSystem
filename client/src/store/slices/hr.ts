import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { request, fileUploadRequest } from "../../utils/fetch";
import {
  VisaStatusListItemType,
  AllVisaStatusesResponseType,
  ErrorResponseType,
  HrStateType,
} from "../../utils/type";

export const fetchAllVisaStatusList =
  () => async (dispatch: AppDispatch) => {
    const query = `
      query GetVisaStatuses {
          getVisaStatuses {
            _id
            employee {
              profile {
                name {
                  firstName
                  middleName
                  lastName
                }
              }
            }
            workAuthorization {
              title
              startDate
              endDate
            }
            step
            status
          }
        }
    `;
    try {
      const response: AllVisaStatusesResponseType = await request(query);
      const allVisaStatuses = response.data.getVisaStatuses;
      dispatch(updateAllVisaStatusList({ allVisaStatuses: allVisaStatuses }));
    } catch (error) {
      console.log(error);
      const err = error as ErrorResponseType;
      const message = err.message;
      console.log(message);
      // return message;
      return Promise.reject(message);
    }
  };

const initialState: HrStateType = {
  allVisaStatuses: [
    {
      _id: "",
      employee: {
        id: "",
        email: "",
        username: "",
        profile: {
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
        onboardingApplication:{
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
          status: '',
          hrFeedback:'',
        }
      },
      step: "",
      status: "",
      hrFeedback: "",
      workAuthorization: {
        title: "",
        startDate: "",
        endDate: "",
      },
      documents: [],
    },
  ],
};

export const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    updateAllVisaStatusList: (
      state,
      action: PayloadAction<HrStateType>
    ) => {
      state.allVisaStatuses = action.payload.allVisaStatuses;
    },
  },
});

export const { updateAllVisaStatusList } = hrSlice.actions;

export default hrSlice.reducer;
