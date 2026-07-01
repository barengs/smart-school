import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('/auth/login', credentials);
            localStorage.setItem('token', response.data.access_token);
            // Update default headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Login failed');
        }
    }
);

export const fetchMe = createAsyncThunk(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/auth/me');
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch user');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post('/auth/logout');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            return true;
        } catch (error) {
            return rejectWithValue('Logout failed');
        }
    }
);

export const unlockScreen = createAsyncThunk(
    'auth/unlockScreen',
    async (password, { rejectWithValue }) => {
        try {
            await axios.post('/auth/unlock', { password });
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Password salah');
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post('/auth/refresh');
            localStorage.setItem('token', response.data.access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            return response.data;
        } catch (error) {
            return rejectWithValue('Refresh failed');
        }
    }
);

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLocked: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        lockScreen: (state) => {
            state.isLocked = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isLocked = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.access_token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLocked = false;
            })
            .addCase(unlockScreen.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unlockScreen.fulfilled, (state) => {
                state.loading = false;
                state.isLocked = false;
            })
            .addCase(unlockScreen.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.access_token;
            })
            .addCase(refreshToken.rejected, (state) => {
                // If refresh fails (e.g. token expired beyond refresh TTL), force logout
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLocked = false;
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            });
    },
});

export const { clearError, lockScreen } = authSlice.actions;
export default authSlice.reducer;
