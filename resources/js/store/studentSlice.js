import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchStudents = createAsyncThunk('student/fetchStudents', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/students');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch students' });
    }
});

export const deleteStudent = createAsyncThunk('student/deleteStudent', async (id, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`/students/${id}`);
        toast.success('Siswa dihapus');
        dispatch(fetchStudents());
        return id;
    } catch (error) {
        toast.error('Gagal menghapus');
        return rejectWithValue(error.response?.data || { message: 'Failed to delete' });
    }
});

export const saveStudent = createAsyncThunk('student/saveStudent', async (data, { rejectWithValue, dispatch }) => {
    try {
        if (data.id) {
            await axios.put(`/students/${data.id}`, data);
        } else {
            // Note: create may fail if user_id is missing, usually requires a proper endpoint for full registration
            await axios.post('/students', data);
        }
        toast.success('Data siswa disimpan');
        dispatch(fetchStudents());
        return true;
    } catch (error) {
        toast.error('Gagal menyimpan data');
        return rejectWithValue(error.response?.data || { message: 'Failed to save' });
    }
});

const studentSlice = createSlice({
    name: 'student',
    initialState: { items: [], loading: false, error: null, initialized: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudents.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchStudents.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.initialized = true; })
            .addCase(fetchStudents.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    },
});

export default studentSlice.reducer;
