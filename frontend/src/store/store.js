import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import foodReducer from './foodSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        food: foodReducer,
        orders: orderReducer,
    },
});

export default store;
