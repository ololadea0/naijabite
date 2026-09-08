import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/api';

const initialState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchFoods = createAsyncThunk(
    'food/fetchFoods',
    async (_, { rejectWithValue }) => {
        try
        {
            const response = await api.get('/foods');
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Failed to load menu');
        }
    },
);

export const createFoodThunk = createAsyncThunk(
    'food/createFoodThunk',
    async (payload, { rejectWithValue }) => {
        try
        {
            let response;
            if (payload instanceof FormData)
            {
                response = await api.post('/foods', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else
            {
                response = await api.post('/foods', payload);
            }
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to add menu item');
        }
    },
);

export const updateFoodThunk = createAsyncThunk(
    'food/updateFoodThunk',
    async ({ id, payload }, { rejectWithValue }) => {
        try
        {
            let response;
            if (payload instanceof FormData)
            {
                response = await api.put(`/foods/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else
            {
                response = await api.put(`/foods/${id}`, payload);
            }
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to update menu item');
        }
    },
);

export const deleteFoodThunk = createAsyncThunk(
    'food/deleteFoodThunk',
    async (id, { rejectWithValue }) => {
        try
        {
            await api.delete(`/foods/${id}`);
            return id;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to delete menu item');
        }
    },
);

const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoods.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchFoods.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchFoods.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createFoodThunk.fulfilled, (state, action) => {
                state.items = [action.payload, ...state.items];
            })
            .addCase(updateFoodThunk.fulfilled, (state, action) => {
                state.items = state.items.map((food) =>
                    (food._id || food.id) === (action.payload._id || action.payload.id)
                        ? action.payload
                        : food,
                );
            })
            .addCase(deleteFoodThunk.fulfilled, (state, action) => {
                state.items = state.items.filter((food) => (food._id || food.id) !== action.payload);
            });
    },
});

export default foodSlice.reducer;
