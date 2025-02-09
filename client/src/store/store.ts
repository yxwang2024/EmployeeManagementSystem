import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
// import onboardingApplicationReducer from './onboardingApplicationSlice';
import oaInfoReducer from './oaInfo';
import globalReducer from './global';
import employeeReducer from './slices/employee';
import hrReducer from './slices/hr'
import searchReducer from './slices/search';
import optionReducer from './slices/option'

const store = configureStore({
  reducer: {
    auth: authReducer,
    // onboardingApplication: onboardingApplicationReducer,
    oaInfo: oaInfoReducer,
    global: globalReducer,
    employee: employeeReducer,
    hr:hrReducer,
    search:searchReducer,
    option:optionReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;