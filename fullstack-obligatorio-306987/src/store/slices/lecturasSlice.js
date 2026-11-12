import { createSlice } from '@reduxjs/toolkit';

const lecturasSlice = createSlice({
  name: 'lecturas',
  initialState: { lista: [] },
  reducers: {
    setLecturas: (state, action) => {
      state.lista = action.payload;
    },
    agregarLectura: (state, action) => {
      state.lista.unshift(action.payload);
    },
    eliminarLectura: (state, action) => {
      state.lista = state.lista.filter((l) => l._id !== action.payload);
    },
    actualizarLectura: (state, action) => {
      const i = state.lista.findIndex((l) => l._id === action.payload._id);
      state.lista[i] = action.payload;
    },
  },
});

export const { setLecturas, agregarLectura, eliminarLectura, actualizarLectura } = lecturasSlice.actions;
export default lecturasSlice.reducer;