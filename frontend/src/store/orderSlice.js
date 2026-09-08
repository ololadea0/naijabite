import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/api';

const initialState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (_, { rejectWithValue }) => {
        try
        {
            const response = await api.get('/orders/myorders');
            return response.data;
        } catch (error)
        {
            if (error.response?.status === 401)
            {
                return [];
            }
            return rejectWithValue(error.response?.data?.message || 'Unable to load your orders');
        }
    },
);

export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try
        {
            const response = await api.get('/orders');
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to load all orders');
        }
    },
);

export const createOrderThunk = createAsyncThunk(
    'orders/createOrderThunk',
    async (payload, { rejectWithValue }) => {
        try
        {
            const response = await api.post('/orders', payload);
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to place order');
        }
    },
);

export const updateOrderStatusThunk = createAsyncThunk(
    'orders/updateOrderStatusThunk',
    async ({ id, status }, { rejectWithValue }) => {
        try
        {
            const response = await api.put(`/orders/${id}/status`, { status });
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to update order status');
        }
    },
);

export const cancelOrderThunk = createAsyncThunk(
    'orders/cancelOrderThunk',
    async (id, { rejectWithValue }) => {
        try
        {
            const response = await api.put(`/orders/${id}/cancel`);
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to cancel order');
        }
    },
);

export const confirmDeliveryThunk = createAsyncThunk(
    'orders/confirmDeliveryThunk',
    async (id, { rejectWithValue }) => {
        try
        {
            const response = await api.put(`/orders/${id}/confirm-delivery`);
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to confirm delivery');
        }
    },
);

export const createCommentThunk = createAsyncThunk(
    'orders/createCommentThunk',
    async ({ id, message, type }, { rejectWithValue }) => {
        try
        {
            const response = await api.post(`/orders/${id}/comments`, { message, type });
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to post comment');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(createOrderThunk.fulfilled, (state, action) => {
                state.items = [action.payload, ...state.items];
            })
            .addCase(cancelOrderThunk.fulfilled, (state, action) => {
                // replace updated order
                state.items = state.items.map((order) =>
                    order._id === action.payload._id ? action.payload : order,
                );
            })
            .addCase(confirmDeliveryThunk.fulfilled, (state, action) => {
                state.items = state.items.map((order) => order._id === action.payload._id ? action.payload : order);
            })
            .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
                state.items = state.items.map((order) => order._id === action.payload._id ? action.payload : order);
            })
            .addCase(createCommentThunk.fulfilled, (state, action) => {
                state.items = state.items.map((order) => order._id === action.payload._id ? action.payload : order);
            });

    },
});

export default orderSlice.reducer;
