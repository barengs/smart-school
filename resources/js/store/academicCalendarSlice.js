import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAcademicCalendars = createAsyncThunk(
    'academicCalendar/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/academic-calendars');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addAcademicCalendar = createAsyncThunk(
    'academicCalendar/add',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/academic-calendars', eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateAcademicCalendar = createAsyncThunk(
    'academicCalendar/update',
    async ({ id, ...eventData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/academic-calendars/${id}`, eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteAcademicCalendar = createAsyncThunk(
    'academicCalendar/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/academic-calendars/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const academicCalendarSlice = createSlice({
    name: 'academicCalendar',
    initialState: {
        events: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAcademicCalendars.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAcademicCalendars.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchAcademicCalendars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAcademicCalendar.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(updateAcademicCalendar.fulfilled, (state, action) => {
                const index = state.events.findIndex(e => e.id === action.payload.id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(deleteAcademicCalendar.fulfilled, (state, action) => {
                state.events = state.events.filter(e => e.id !== action.payload);
            });
    }
});

export default academicCalendarSlice.reducer;
