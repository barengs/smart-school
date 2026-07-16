import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchSubjects = createAsyncThunk('subject/fetchSubjects', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/subjects');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch subjects' });
    }
});

export const deleteSubject = createAsyncThunk('subject/deleteSubject', async (id, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`/subjects/${id}`);
        toast.success('Mata pelajaran dihapus');
        dispatch(fetchSubjects());
        return id;
    } catch (error) {
        toast.error('Gagal menghapus');
        return rejectWithValue(error.response?.data || { message: 'Failed to delete' });
    }
});

const subjectSlice = createSlice({
    name: 'subject',
    initialState: { items: [], loading: false, error: null, initialized: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubjects.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSubjects.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.initialized = true; })
            .addCase(fetchSubjects.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    },
});

export default subjectSlice.reducer;
