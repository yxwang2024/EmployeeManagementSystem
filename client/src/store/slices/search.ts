import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    value: '',
    trigger: false
  },
  reducers: {
    updateSearchValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    triggerSearch: (state) => {
      state.trigger = !state.trigger;
    },
  },
});

export const { updateSearchValue, triggerSearch } = searchSlice.actions;

export default searchSlice.reducer;