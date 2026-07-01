import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchPages = createAsyncThunk(
    'page/fetchPages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/pages');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch pages' });
        }
    }
);

export const deletePage = createAsyncThunk(
    'page/deletePage',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await axios.delete(`/pages/${id}`);
            toast.success('Halaman berhasil dihapus');
            dispatch(fetchPages());
            return id;
        } catch (error) {
            toast.error('Gagal menghapus halaman');
            return rejectWithValue(error.response?.data || { message: 'Failed to delete' });
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
    initialized: false,
};

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPages.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.initialized = true;
            })
            .addCase(fetchPages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error occurred';
                toast.error(state.error);
            });
    },
});

export default pageSlice.reducer;
