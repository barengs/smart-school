import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEligibleStudents = createAsyncThunk('promotion/fetchEligibleStudents', async (data) => {
    const response = await axios.post('/promotions/eligible', data);
    return response.data;
});

export const processPromotion = createAsyncThunk('promotion/processPromotion', async (data) => {
    const response = await axios.post('/promotions/process', data);
    return response.data;
});

export const processBulkPromotions = createAsyncThunk('promotion/processBulkPromotions', async (data) => {
    const response = await axios.post('/promotions/bulk', data);
    return response.data;
});

const promotionSlice = createSlice({
    name: 'promotion',
    initialState: {
        eligibleStudents: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEligibleStudents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEligibleStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.eligibleStudents = action.payload;
            })
            .addCase(fetchEligibleStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(processPromotion.fulfilled, (state, action) => {
                const index = state.eligibleStudents.findIndex(s => s.id === action.payload.student_id);
                if (index !== -1) {
                    state.eligibleStudents[index].promotion_status = action.payload.status;
                }
            })
            .addCase(processBulkPromotions.fulfilled, (state, action) => {
                action.payload.forEach(updatedPromotion => {
                    const index = state.eligibleStudents.findIndex(s => s.id === updatedPromotion.student_id);
                    if (index !== -1) {
                        state.eligibleStudents[index].promotion_status = updatedPromotion.status;
                    }
                });
            });
    }
});

export default promotionSlice.reducer;
