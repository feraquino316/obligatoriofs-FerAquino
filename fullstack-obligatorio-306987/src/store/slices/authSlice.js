import { createSlice } from '@reduxjs/toolkit';

const leerUsuario = () => {
  try {
    return JSON.parse(localStorage.getItem('usuario'));
  } catch {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    return null;
  }
};

const initialState = {
  usuario: leerUsuario(),
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
    pasarAPremium: (state, action) => {
      state.token = action.payload;      
      state.usuario.premium = true;
    },
  },
});


export const { login, logout, pasarAPremium } = authSlice.actions;
export default authSlice.reducer;