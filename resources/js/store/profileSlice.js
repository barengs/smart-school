import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/profile');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const saveProfile = createAsyncThunk(
    'profile/saveProfile',
    async (payload, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in payload) {
                if (payload[key] !== null && payload[key] !== undefined) {
                    formData.append(key, payload[key]);
                }
            }
            formData.append('_method', 'PUT');

            const response = await axios.post('/profile', formData);
            toast.success('Profil sekolah berhasil diperbarui!');
            return response.data.data;
        } catch (error) {
            toast.error('Gagal menyimpan profil.');
            return rejectWithValue(error.response?.data?.message || 'Failed to save profile');
        }
    }
);

const initialState = {
    data: {
        name: '',
        npsn: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        vision: '',
        mission: '',
        history: ''
    },
    loading: false,
    error: null,
    initialized: false,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.data = { ...state.data, ...action.payload };
                }
                state.initialized = true;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(saveProfile.pending, (state) => {
                // optional: add saving state
            })
            .addCase(saveProfile.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = { ...state.data, ...action.payload };
                }
            });
    },
});

export default profileSlice.reducer;
