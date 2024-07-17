import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: { id: string; username: string; email: string; role: string } }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    rehydrate: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        state.isAuthenticated = true;
        state.token = token;
        state.user = JSON.parse(user);
      }
    },
  },
});

export const { login, logout, rehydrate } = authSlice.actions;
export default authSlice.reducer;