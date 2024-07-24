import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const optionSlice = createSlice({
  name: 'option',
  initialState: {
    value: 'InProgress'
  },
  reducers: {
    toInProgressOption: (state) => {
      state.value = 'InProgress';
    },
    toAllOption: (state) => {
        state.value = 'All';
      },
  },
});

export const { toInProgressOption,toAllOption } = optionSlice.actions;

export default optionSlice.reducer;