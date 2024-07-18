import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { UserLoginType } from '../utils/type';

export interface AuthStateType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserLoginType | null;
}

const tokenFromLocalStorage = localStorage.getItem('token');

const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;

if (tokenFromLocalStorage) {
  try {
    const decoded: any = jwtDecode(tokenFromLocalStorage);
    if (decoded.id !== initialUser?.id) {
      throw new Error('Token and user mismatch');
    }
  } catch (error) {
    console.error('Token decoding failed:', error);
  }
}

const initialState: AuthStateType = {
  isAuthenticated: !!tokenFromLocalStorage,
  token: tokenFromLocalStorage,
  user: initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: UserLoginType }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;