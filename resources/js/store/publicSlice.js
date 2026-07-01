import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSchoolProfile = createAsyncThunk(
    'public/fetchSchoolProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/public/profile');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const fetchMenus = createAsyncThunk(
    'public/fetchMenus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/public/menus');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch menus');
        }
    }
);

const initialState = {
    profile: null,
    menus: [],
    initializedProfile: false,
    initializedMenus: false,
    loading: false,
    error: null,
};

const publicSlice = createSlice({
    name: 'public',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSchoolProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchoolProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.initializedProfile = true;
            })
            .addCase(fetchSchoolProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMenus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenus.fulfilled, (state, action) => {
                state.loading = false;
                state.menus = action.payload;
                state.initializedMenus = true;
            })
            .addCase(fetchMenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default publicSlice.reducer;
