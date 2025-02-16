// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cafeReducer from './slices/cafeSlice';
import employeeSlice from './slices/employeeSlice';

const store = configureStore({
  reducer: {
    cafe: cafeReducer,
    employee:employeeSlice
  },
});

export default store;
