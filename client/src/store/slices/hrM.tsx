import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { request } from "../../utils/fetch";
import { HRStateType, ErrorResponseType, HRResponseType } from "../../utils/type";

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
      console.log(response);
      const hrResponse = response.data.getHR;
      dispatch(updateHR({ hr: hrResponse }));      
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
};

const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    updateHR: (state, action: PayloadAction<HRStateType>) => {
      state.hr = action.payload.hr;
    },
  },
});

export const { updateHR } = hrSlice.actions;

export default hrSlice.reducer;

