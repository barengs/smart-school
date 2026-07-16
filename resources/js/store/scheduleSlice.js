import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchSchedules = createAsyncThunk('schedule/fetchSchedules', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/schedules');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch schedules' });
    }
});

export const deleteSchedule = createAsyncThunk('schedule/deleteSchedule', async (id, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`/schedules/${id}`);
        toast.success('Jadwal dihapus');
        dispatch(fetchSchedules());
        return id;
    } catch (error) {
        toast.error('Gagal menghapus');
        return rejectWithValue(error.response?.data || { message: 'Failed to delete' });
    }
});

export const createSchedule = createAsyncThunk('schedule/createSchedule', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post('/schedules', data);
        toast.success('Jadwal berhasil ditambahkan');
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal menambahkan jadwal');
        return rejectWithValue(error.response?.data || { message: 'Failed to add' });
    }
});

export const updateSchedule = createAsyncThunk('schedule/updateSchedule', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/schedules/${id}`, data);
        toast.success('Jadwal berhasil diperbarui');
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal memperbarui jadwal');
        return rejectWithValue(error.response?.data || { message: 'Failed to update' });
    }
});

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: { items: [], loading: false, error: null, initialized: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSchedules.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSchedules.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.initialized = true; })
            .addCase(fetchSchedules.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    },
});

export default scheduleSlice.reducer;
