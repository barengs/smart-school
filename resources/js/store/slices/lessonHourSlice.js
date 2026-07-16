import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLessonHours = createAsyncThunk(
    'lessonHours/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/lesson-hours');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Gagal memuat jam pelajaran');
        }
    }
);

export const createLessonHour = createAsyncThunk(
    'lessonHours/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post('/lesson-hours', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Gagal membuat jam pelajaran');
        }
    }
);

export const updateLessonHour = createAsyncThunk(
    'lessonHours/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/lesson-hours/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Gagal mengubah jam pelajaran');
        }
    }
);

export const deleteLessonHour = createAsyncThunk(
    'lessonHours/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/lesson-hours/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Gagal menghapus jam pelajaran');
        }
    }
);

const lessonHourSlice = createSlice({
    name: 'lessonHours',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessonHours.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLessonHours.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchLessonHours.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createLessonHour.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(updateLessonHour.fulfilled, (state, action) => {
                const index = state.data.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteLessonHour.fulfilled, (state, action) => {
                state.data = state.data.filter((item) => item.id !== action.payload);
            });
    },
});

export default lessonHourSlice.reducer;
