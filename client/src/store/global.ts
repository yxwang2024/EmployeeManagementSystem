import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    isLoading: false,
    showMessage: false,
    messageText: '',
    messageType: '',
  },
  reducers: {
    updateLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateMessage: (state, action: PayloadAction<{show: boolean, msg: string, type: string}>) => {
      state.showMessage = action.payload.show;
      state.messageText = action.payload.msg;
      state.messageType = action.payload.type;
    },
  },
});

export const { updateLoading, updateMessage } = globalSlice.actions;

export default globalSlice.reducer;