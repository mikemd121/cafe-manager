// src/redux/slices/cafeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCafe: null,
};

const cafeSlice = createSlice({
  name: 'cafe',
  initialState,
  reducers: {
    setSelectedCafe: (state, action) => {
      state.selectedCafe = action.payload;
    },
    clearSelectedCafe: (state) => {
      state.selectedCafe = null;
    },
  },
});

export const { setSelectedCafe, clearSelectedCafe } = cafeSlice.actions;
export default cafeSlice.reducer;
