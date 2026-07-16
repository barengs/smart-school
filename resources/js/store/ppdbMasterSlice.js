import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';



// Batches
export const fetchBatches = createAsyncThunk('ppdbMaster/fetchBatches', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/ppdb-batches');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Gagal memuat gelombang');
    }
});
export const saveBatch = createAsyncThunk('ppdbMaster/saveBatch', async (data, { rejectWithValue, dispatch }) => {
    try {
        if (data.id) await axios.put(`/ppdb-batches/${data.id}`, data);
        else await axios.post('/ppdb-batches', data);
        toast.success('Data gelombang disimpan');
        dispatch(fetchBatches());
        return true;
    } catch (err) {
        toast.error('Gagal menyimpan gelombang');
        return rejectWithValue(err.response?.data?.message || 'Error saving');
    }
});
export const deleteBatch = createAsyncThunk('ppdbMaster/deleteBatch', async (id, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`/ppdb-batches/${id}`);
        toast.success('Gelombang dihapus');
        dispatch(fetchBatches());
        return id;
    } catch (err) {
        toast.error('Gagal menghapus gelombang');
        return rejectWithValue(err.response?.data?.message || 'Error deleting');
    }
});

// Paths
export const fetchPaths = createAsyncThunk('ppdbMaster/fetchPaths', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/ppdb-paths');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Gagal memuat jalur');
    }
});
export const savePath = createAsyncThunk('ppdbMaster/savePath', async (data, { rejectWithValue, dispatch }) => {
    try {
        if (data.id) await axios.put(`/ppdb-paths/${data.id}`, data);
        else await axios.post('/ppdb-paths', data);
        toast.success('Data jalur disimpan');
        dispatch(fetchPaths());
        return true;
    } catch (err) {
        toast.error('Gagal menyimpan jalur');
        return rejectWithValue(err.response?.data?.message || 'Error saving');
    }
});
export const deletePath = createAsyncThunk('ppdbMaster/deletePath', async (id, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`/ppdb-paths/${id}`);
        toast.success('Jalur dihapus');
        dispatch(fetchPaths());
        return id;
    } catch (err) {
        toast.error('Gagal menghapus jalur');
        return rejectWithValue(err.response?.data?.message || 'Error deleting');
    }
});

// Document Requirements
export const fetchDocumentRequirements = createAsyncThunk('ppdbMaster/fetchDocumentRequirements', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/ppdb-document-requirements');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Gagal memuat dokumen');
    }
});
export const saveDocumentRequirement = createAsyncThunk('ppdbMaster/saveDocumentRequirement', async (data, { rejectWithValue, dispatch }) => {
    try {
        if (data.id) await axios.put(`/ppdb-document-requirements/${data.id}`, data);
        else await axios.post('/ppdb-document-requirements', data);
        toast.success('Data syarat dokumen disimpan');
        dispatch(fetchDocumentRequirements());
        return true;
    } catch (err) {
        toast.error('Gagal menyimpan syarat dokumen');
        return rejectWithValue(err.response?.data?.message || 'Error saving');
    }
});
export const deleteDocumentRequirement = createAsyncThunk('ppdbMaster/deleteDocumentRequirement', async (id, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`/ppdb-document-requirements/${id}`);
        toast.success('Syarat dokumen dihapus');
        dispatch(fetchDocumentRequirements());
        return id;
    } catch (err) {
        toast.error('Gagal menghapus syarat dokumen');
        return rejectWithValue(err.response?.data?.message || 'Error deleting');
    }
});

const initialState = {
    batches: [],
    paths: [],
    documentRequirements: [],
    loading: false,
    initialized: false,
    error: null,
};

const ppdbMasterSlice = createSlice({
    name: 'ppdbMaster',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            
            .addCase(fetchBatches.pending, (state) => { state.loading = true; })
            .addCase(fetchBatches.fulfilled, (state, action) => { state.loading = false; state.batches = action.payload; })
            
            .addCase(fetchPaths.pending, (state) => { state.loading = true; })
            .addCase(fetchPaths.fulfilled, (state, action) => { state.loading = false; state.paths = action.payload; })
            
            .addCase(fetchDocumentRequirements.pending, (state) => { state.loading = true; })
            .addCase(fetchDocumentRequirements.fulfilled, (state, action) => { state.loading = false; state.documentRequirements = action.payload; });
    }
});

export default ppdbMasterSlice.reducer;
