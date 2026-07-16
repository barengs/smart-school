import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchClassrooms = createAsyncThunk('classroom/fetchClassrooms', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/classrooms');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch classrooms' });
    }
});

export const deleteClassroom = createAsyncThunk('classroom/deleteClassroom', async (id, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`/classrooms/${id}`);
        toast.success('Kelas dihapus');
        dispatch(fetchClassrooms());
        return id;
    } catch (error) {
        toast.error('Gagal menghapus');
        return rejectWithValue(error.response?.data || { message: 'Failed to delete' });
    }
});

const classroomSlice = createSlice({
    name: 'classroom',
    initialState: { items: [], loading: false, error: null, initialized: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassrooms.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchClassrooms.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.initialized = true; })
            .addCase(fetchClassrooms.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    },
});

export default classroomSlice.reducer;
