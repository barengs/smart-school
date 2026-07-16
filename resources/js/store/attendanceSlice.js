import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchAttendances = createAsyncThunk('attendance/fetchAttendances', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/attendances');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch attendances' });
    }
});

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: { items: [], loading: false, error: null, initialized: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAttendances.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAttendances.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.initialized = true; })
            .addCase(fetchAttendances.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    },
});

export default attendanceSlice.reducer;
