import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/categories');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch categories' });
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await axios.delete(`/categories/${id}`);
            toast.success('Kategori berhasil dihapus');
            dispatch(fetchCategories());
            return id;
        } catch (error) {
            toast.error('Gagal menghapus kategori');
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

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.initialized = true;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error occurred';
                toast.error(state.error);
            });
    },
});

export default categorySlice.reducer;
