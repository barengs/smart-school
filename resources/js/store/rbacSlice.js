import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchMatrixData = createAsyncThunk(
    'rbac/fetchMatrixData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/rbac/matrix');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch rbac matrix' });
        }
    }
);



export const createRole = createAsyncThunk(
    'rbac/createRole',
    async (payload, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post('/roles', payload);
            toast.success('Peran baru berhasil ditambahkan!');
            dispatch(fetchMatrixData()); 
            return response.data;
        } catch (error) {
            toast.error('Gagal menambahkan peran.');
            return rejectWithValue(error.response?.data || { message: 'Failed to create role' });
        }
    }
);

export const updateRole = createAsyncThunk(
    'rbac/updateRole',
    async ({ id, ...payload }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.put(`/roles/${id}`, payload);
            toast.success('Peran berhasil diperbarui!');
            dispatch(fetchMatrixData());
            return response.data;
        } catch (error) {
            toast.error('Gagal memperbarui peran.');
            return rejectWithValue(error.response?.data || { message: 'Failed to update role' });
        }
    }
);

export const deleteRole = createAsyncThunk(
    'rbac/deleteRole',
    async (roleId, { rejectWithValue, dispatch }) => {
        try {
            await axios.delete(`/roles/${roleId}`);
            toast.success('Peran berhasil dihapus!');
            dispatch(fetchMatrixData());
            return roleId;
        } catch (error) {
            toast.error('Gagal menghapus peran.');
            return rejectWithValue(error.response?.data || { message: 'Failed to delete role' });
        }
    }
);

const initialState = {
    roles: [],
    menus: [],
    matrix: {},
    loading: false,
    error: null,
    initialized: false,
};

const rbacSlice = createSlice({
    name: 'rbac',
    initialState,
    reducers: {
        // Reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMatrixData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMatrixData.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload.roles || [];
                state.menus = action.payload.menus || [];
                state.matrix = action.payload.matrix || {};
                state.initialized = true;
            })
            .addCase(fetchMatrixData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error occurred';
                toast.error(state.error);
            });
    },
});

export default rbacSlice.reducer;
