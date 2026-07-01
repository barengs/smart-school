import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchMenus = createAsyncThunk(
    'menu/fetchMenus',
    async (type, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/menus?type=${type}`);
            return { type, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch menus' });
        }
    }
);

export const saveReorderMenus = createAsyncThunk(
    'menu/saveReorderMenus',
    async (payload, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post('/menus/reorder', { menus: payload.menus });
            toast.success('Urutan berhasil disimpan');
            // Refresh data
            dispatch(fetchMenus(payload.type));
            return response.data;
        } catch (error) {
            toast.error('Gagal menyimpan urutan');
            return rejectWithValue(error.response?.data || { message: 'Failed to save order' });
        }
    }
);

const initialState = {
    frontMenus: [],
    adminMenus: [],
    loading: false,
    error: null,
    // Add a flag to track if we have initialized the data to avoid refetching
    initializedFront: false,
    initializedAdmin: false,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        // We can add optimistic update reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenus.fulfilled, (state, action) => {
                state.loading = false;
                const { type, data } = action.payload;
                if (type === 'front') {
                    state.frontMenus = data;
                    state.initializedFront = true;
                } else if (type === 'admin') {
                    state.adminMenus = data;
                    state.initializedAdmin = true;
                }
            })
            .addCase(fetchMenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error occurred';
                toast.error(state.error);
            });
    },
});

export default menuSlice.reducer;
