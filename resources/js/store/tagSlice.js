import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchTags = createAsyncThunk(
    'tag/fetchTags',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/tags');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch tags' });
        }
    }
);

export const deleteTag = createAsyncThunk(
    'tag/deleteTag',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await axios.delete(`/tags/${id}`);
            toast.success('Tag berhasil dihapus');
            dispatch(fetchTags());
            return id;
        } catch (error) {
            toast.error('Gagal menghapus tag');
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

const tagSlice = createSlice({
    name: 'tag',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTags.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.initialized = true;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error occurred';
                toast.error(state.error);
            });
    },
});

export default tagSlice.reducer;
