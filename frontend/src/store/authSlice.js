import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/api';

const initialState = {
    user: null,
    users: [],
    status: 'idle',
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try
        {
            const response = await api.post('/users/login', { email, password });
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    },
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ name, email, password }, { rejectWithValue }) => {
        try
        {
            const response = await api.post('/users/register', { name, email, password });
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    },
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try
        {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error)
        {
            if (error.response?.status === 401)
            {
                return null;
            }
            return rejectWithValue(error.response?.data?.message || 'Unable to fetch current user');
        }
    },
);

export const fetchUsers = createAsyncThunk(
    'auth/fetchUsers',
    async (_, { rejectWithValue }) => {
        try
        {
            const response = await api.get('/users');
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Unable to fetch users');
        }
    },
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try
        {
            await api.post('/users/logout');
            return true;
        } catch (error)
        {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { setAuthUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
