import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

export const fetchNews = createAsyncThunk(
    'news/fetchNews',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/public/news');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch news');
        }
    }
);

export const fetchNewsDetail = createAsyncThunk(
    'news/fetchNewsDetail',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/public/news/${slug}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch news detail');
        }
    }
);

export const fetchAdminNews = createAsyncThunk(
    'news/fetchAdminNews',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/news');
            return Array.isArray(response.data) ? response.data : response.data.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin news');
        }
    }
);

export const deleteNews = createAsyncThunk(
    'news/deleteNews',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await axios.delete(`/news/${id}`);
            toast.success('Berita berhasil dihapus');
            dispatch(fetchAdminNews());
            return id;
        } catch (error) {
            toast.error('Gagal menghapus berita');
            return rejectWithValue(error.response?.data?.message || 'Failed to delete');
        }
    }
);

export const approveNews = createAsyncThunk(
    'news/approveNews',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await axios.post(`/news/${id}/approve`);
            toast.success('Berita dipublikasikan');
            dispatch(fetchAdminNews());
            return id;
        } catch (error) {
            toast.error('Gagal mengubah status berita');
            return rejectWithValue(error.response?.data?.message || 'Failed to approve');
        }
    }
);

const initialState = {
    newsList: [],
    adminNewsList: [],
    currentNews: null,
    loading: false,
    initialized: false, // For admin news
    initializedPublic: false, // For public news
    error: null,
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        clearCurrentNews: (state) => {
            state.currentNews = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchNews
            .addCase(fetchNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.loading = false;
                state.newsList = action.payload;
                state.initializedPublic = true;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchNewsDetail
            .addCase(fetchNewsDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentNews = null;
            })
            .addCase(fetchNewsDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentNews = action.payload;
            })
            .addCase(fetchNewsDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchAdminNews
            .addCase(fetchAdminNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminNews.fulfilled, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.adminNewsList = action.payload;
            })
            .addCase(fetchAdminNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentNews } = newsSlice.actions;
export default newsSlice.reducer;
