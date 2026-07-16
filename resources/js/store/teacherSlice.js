import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchTeachers = createAsyncThunk('teacher/fetchTeachers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/teachers');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch teachers' });
    }
});

export const deleteTeacher = createAsyncThunk('teacher/deleteTeacher', async (id, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`/teachers/${id}`);
        toast.success('Guru dihapus');
        dispatch(fetchTeachers());
        return id;
    } catch (error) {
        toast.error('Gagal menghapus');
        return rejectWithValue(error.response?.data || { message: 'Failed to delete' });
    }
});

const teacherSlice = createSlice({
    name: 'teacher',
    initialState: { items: [], loading: false, error: null, initialized: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeachers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchTeachers.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.initialized = true; })
            .addCase(fetchTeachers.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    },
});

export default teacherSlice.reducer;
