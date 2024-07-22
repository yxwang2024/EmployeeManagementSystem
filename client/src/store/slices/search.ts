import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    value: '',
    trigger: false
  },
  reducers: {
    updateValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    triggerSearch: (state) => {
      state.trigger = !state.trigger;
    },
  },
});

export const { updateValue, triggerSearch } = searchSlice.actions;

export default searchSlice.reducer;