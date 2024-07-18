import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import onboardingApplicationReducer from './onboardingApplicationSlice';
import globalReducer from './global';
import employeeReducer from './slices/employee';
import hrReducer from './slices/hr'

const store = configureStore({
  reducer: {
    auth: authReducer,
    onboardingApplication: onboardingApplicationReducer,
    global: globalReducer,
    employee: employeeReducer,
    hr:hrReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;