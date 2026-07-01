import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchOrganization = createAsyncThunk(
    'organization/fetchOrganization',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/organization');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch organization data');
        }
    }
);

export const deleteOrganization = createAsyncThunk(
    'organization/deleteOrganization',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await axios.delete(`/organization/${id}`);
            toast.success('Data berhasil dihapus');
            dispatch(fetchOrganization());
            return id;
        } catch (error) {
            toast.error('Gagal menghapus data');
            return rejectWithValue(error.response?.data?.message || 'Failed to delete');
        }
    }
);

export const addOrganization = createAsyncThunk(
    'organization/addOrganization',
    async (payload, { rejectWithValue, dispatch }) => {
        try {
            const formData = new FormData();
            for (const key in payload) {
                if (payload[key] !== null && payload[key] !== undefined) {
                    formData.append(key, payload[key]);
                }
            }

            const response = await axios.post('/organization', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Personil berhasil ditambahkan');
            dispatch(fetchOrganization());
            return response.data;
        } catch (error) {
            toast.error('Gagal menambahkan personil');
            return rejectWithValue(error.response?.data?.message || 'Failed to add');
        }
    }
);

export const updateOrganization = createAsyncThunk(
    'organization/updateOrganization',
    async ({ id, data }, { rejectWithValue, dispatch }) => {
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            for (const key in data) {
                if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            }

            const response = await axios.post(`/organization/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Personil berhasil diperbarui');
            dispatch(fetchOrganization());
            return response.data;
        } catch (error) {
            toast.error('Gagal memperbarui personil');
            return rejectWithValue(error.response?.data?.message || 'Failed to update');
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
    initialized: false,
};

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.initialized = true;
            })
            .addCase(fetchOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default organizationSlice.reducer;
