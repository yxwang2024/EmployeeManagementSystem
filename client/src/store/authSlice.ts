import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    username: string;
    email: string;
    userId: string;
  } | null;
}

const tokenFromLocalStorage = localStorage.getItem('token');
let initialUser = null;

if (tokenFromLocalStorage) {
  try {
    const decoded: any = jwtDecode(tokenFromLocalStorage);
    initialUser = {
      username: decoded.username,
      email: decoded.email,
      userId: decoded.id, // 确保这里解码了userId
    };
  } catch (error) {
    console.error('Token decoding failed:', error);
  }
}

const initialState: AuthState = {
  isAuthenticated: !!tokenFromLocalStorage,
  token: tokenFromLocalStorage,
  user: initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: { username: string; email: string; userId: string } }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
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