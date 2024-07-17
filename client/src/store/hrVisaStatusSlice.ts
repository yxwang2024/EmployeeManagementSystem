import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface WorkAuthorization {
  title: string
  startDate: string
  endDate: string
}

interface VisaStatus {
  employee: string
  step: string
  status: string
  hrFeedback: string
  workAuthorization: WorkAuthorization
}
interface hrVisaStatusState {
    visaStatus: VisaStatus;

  }


const initialState: hrVisaStatusState = {
  employee: '',
  step: '',
  status: '',
  hrFeedback: '',
  workAuthorization: ''
};

const hrVisaStatusSlice = createSlice({
  name: 'hrVisaStatus',
  initialState,
  reducers: {
    updateName: (state, action: PayloadAction<Name>) => {
      state.name = action.payload;
    },
  },
});

export const {
  approveVisaStatus,
  
} = hrVisaStatusSlice.actions;

export default hrVisaStatusSlice.reducer;