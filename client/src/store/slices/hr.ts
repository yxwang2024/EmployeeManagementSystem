import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { request, fileUploadRequest } from "../../utils/fetch";
import {
  VisaStatusListItemType,
  AllVisaStatusesResponseType,
  ErrorResponseType,
  HRStateType,
  HRResponseType,
  HRInstanceType,
  createMailHistoryResponseType,
  addMailHistoryResponseType,
  AuthStateType,
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

export const fetchHR = 
  (hr: string) => async (dispatch: AppDispatch) => {
    const query = `
    query GetHR($getHrId: ID!) {
      getHR(id: $getHrId) {
        id
        mailHistory {
          _id
          email
          registrationToken
          expiration
          name
          status
        }
        username
        email
      }
    }
  `;
    try {
      const response: HRResponseType = await request(query, {
        getHrId: hr,
      });
      const hrResponse = response.data.getHR;
      dispatch(updateHRInstance({ hrInstance: hrResponse }));    
    } catch (error) {
      console.log(error);
      const err = error as ErrorResponseType;
      const message = err.message;
      console.log(message);
      return Promise.reject(message);
    }
  }

const initialState: HRStateType = {
  hr: {
    id: "",
    mailHistory: [],
  },
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

export const sendEmail =
  (email: string, name: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const addMailHistory = `
      mutation AddMailHistory($hrId: ID!, $mailId: ID!) {
        addMailHistory(hrId: $hrId, mailId: $mailId) {
          id
          username
          email
          mailHistory {
            _id
            email
            registrationToken
            expiration
            name
            status
          }
        }
      }
    `;
    const query = `
      mutation CreateMailHistory($mailHistoryInput: MailHistoryInput) {
        createMailHistory(mailHistoryInput: $mailHistoryInput) {
          _id
          email
          registrationToken
          expiration
          name
          status
        }
      }
    `;
    try {
      const response: createMailHistoryResponseType = await request(query, {
        mailHistoryInput: {
          email: email,
          name: name,
        },
      });
      const mailId = response.data.createMailHistory._id;

      const state: AuthStateType = getState().auth;
      const hrId = state.user?.instance.id;
      if (!hrId) {
        return Promise.reject("HR id is not found");
      }
      const addMailHistoryResponse: addMailHistoryResponseType = await request(addMailHistory, {
        hrId: hrId,
        mailId: mailId,
      });
      const hr = addMailHistoryResponse.data.addMailHistory;

      dispatch(updateHRInstance({ hrInstance: hr }));   
    } catch (error) {
      console.log(error);
      const err = error as ErrorResponseType;
      const message = err.message;
      console.log(message);
      return Promise.reject(message);
    }
  };

export const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    updateHR: (state, action: PayloadAction<HRStateType>) => {
      state = action.payload;
    },
    updateHRInstance: (
      state,
      action: PayloadAction<{ hrInstance: HRInstanceType }>
    ) => {
      state.hr = action.payload.hrInstance;
    },
    updateAllVisaStatusList: (
      state,
      action: PayloadAction<{ allVisaStatuses: VisaStatusListItemType[] }>
    ) => {
      state.allVisaStatuses = action.payload.allVisaStatuses;
    },
  },
});

export const { updateAllVisaStatusList, updateHRInstance, updateHR } = hrSlice.actions;

export default hrSlice.reducer;
