import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGrades = createAsyncThunk('grade/fetchGrades', async (params) => {
    const response = await axios.get('/grades', { params });
    return response.data;
});

export const saveGrade = createAsyncThunk('grade/saveGrade', async (data) => {
    const response = await axios.post('/grades', data);
    return response.data;
});

const gradeSlice = createSlice({
    name: 'grade',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGrades.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGrades.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchGrades.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(saveGrade.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i.student_id === action.payload.student_id && i.subject_id === action.payload.subject_id && i.semester_id === action.payload.semester_id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            });
    }
});

export default gradeSlice.reducer;
