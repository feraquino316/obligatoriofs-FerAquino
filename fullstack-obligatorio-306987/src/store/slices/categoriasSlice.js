import { createSlice } from '@reduxjs/toolkit';

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState: { lista: [] },
  reducers: {
    setCategorias: (state, action) => {
      state.lista = action.payload;
    },
    agregarCategoria: (state, action) => {
      state.lista.push(action.payload);
    },
    actualizarCategoria: (state, action) => {
      const i = state.lista.findIndex((c) => c._id === action.payload._id);
      state.lista[i] = action.payload;
    },
    eliminarCategoria: (state, action) => {
      state.lista = state.lista.filter((c) => c._id !== action.payload);
    },
  },
});

export const { setCategorias, agregarCategoria, actualizarCategoria, eliminarCategoria } = categoriasSlice.actions;
export default categoriasSlice.reducer;