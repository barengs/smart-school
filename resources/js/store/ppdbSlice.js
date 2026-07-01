import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitPPDB = createAsyncThunk(
    'ppdb/submitPPDB',
    async (formData, { rejectWithValue }) => {
        try {
            let dataToSend = formData;
            if (!(formData instanceof FormData) && formData.photo) {
                dataToSend = new FormData();
                for (const key in formData) {
                    if (formData[key] !== null && formData[key] !== undefined) {
                        dataToSend.append(key, formData[key]);
                    }
                }
            }
            const response = await axios.post('/public/ppdb', dataToSend, {
                headers: dataToSend instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
            });
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
    // Admin state
    items: [],
    adminLoading: false,
    adminInitialized: false,
};

export const fetchPpdbAdmin = createAsyncThunk(
    'ppdb/fetchPpdbAdmin',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/ppdb');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch PPDB');
        }
    }
);

export const updateStatusPpdb = createAsyncThunk(
    'ppdb/updateStatusPpdb',
    async ({ id, status }, { rejectWithValue, dispatch }) => {
        try {
            await axios.put(`/ppdb/${id}`, { status });
            dispatch(fetchPpdbAdmin()); // Refresh list
            return { id, status };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update status');
        }
    }
);

export const savePpdbAdmin = createAsyncThunk(
    'ppdb/savePpdbAdmin',
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            let dataToSend = formData;
            if (!(formData instanceof FormData)) {
                dataToSend = new FormData();
                for (const key in formData) {
                    if (key === 'documents' && typeof formData.documents === 'object') {
                        for (const req_id in formData.documents) {
                            if (formData.documents[req_id]) {
                                dataToSend.append(`documents[${req_id}]`, formData.documents[req_id]);
                            }
                        }
                    } else if (formData[key] !== null && formData[key] !== undefined) {
                        dataToSend.append(key, formData[key]);
                    }
                }
            }

            const response = await axios.post('/ppdb', dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            dispatch(fetchPpdbAdmin());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to save PPDB');
        }
    }
);

export const updatePpdbAdmin = createAsyncThunk(
    'ppdb/updatePpdbAdmin',
    async ({ id, formData }, { rejectWithValue, dispatch }) => {
        try {
            let dataToSend = formData;
            if (!(formData instanceof FormData)) {
                dataToSend = new FormData();
                for (const key in formData) {
                    if (key === 'documents' && typeof formData.documents === 'object') {
                        for (const req_id in formData.documents) {
                            if (formData.documents[req_id]) {
                                dataToSend.append(`documents[${req_id}]`, formData.documents[req_id]);
                            }
                        }
                    } else if (formData[key] !== null && formData[key] !== undefined) {
                        dataToSend.append(key, formData[key]);
                    }
                }
            }
            // Add _method=PUT for Laravel to handle multipart/form-data as PUT
            dataToSend.append('_method', 'PUT');

            const response = await axios.post(`/ppdb/${id}`, dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            dispatch(fetchPpdbAdmin());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update PPDB');
        }
    }
);

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
            // Public Submit
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
            })
            // Admin Fetch
            .addCase(fetchPpdbAdmin.pending, (state) => {
                state.adminLoading = true;
            })
            .addCase(fetchPpdbAdmin.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.items = action.payload;
                state.adminInitialized = true;
            })
            .addCase(fetchPpdbAdmin.rejected, (state) => {
                state.adminLoading = false;
            });
    },
});

export const { resetPPDBState } = ppdbSlice.actions;
export default ppdbSlice.reducer;
