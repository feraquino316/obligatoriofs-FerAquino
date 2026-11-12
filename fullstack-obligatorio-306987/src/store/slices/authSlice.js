import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usuario: JSON.parse(localStorage.getItem('usuario')),
  token: localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.usuario = action.payload.usuario;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.usuario = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;