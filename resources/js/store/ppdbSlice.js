import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitPPDB = createAsyncThunk(
    'ppdb/submitPPDB',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/public/ppdb', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit PPDB');
        }
    }
);

const initialState = {
    registrationResult: null,
    loading: false,
    error: null,
    success: false,
};

const ppdbSlice = createSlice({
    name: 'ppdb',
    initialState,
    reducers: {
        resetPPDBState: (state) => {
            state.registrationResult = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitPPDB.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitPPDB.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.registrationResult = action.payload;
            })
            .addCase(submitPPDB.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { resetPPDBState } = ppdbSlice.actions;
export default ppdbSlice.reducer;
