import { configureStore, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import onboardingApplicationReducer from './onboardingApplicationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    onboardingApplication: onboardingApplicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

export default store;