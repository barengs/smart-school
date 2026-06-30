import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

const initialState = {
    newsList: [],
    currentNews: null,
    loading: false,
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
            });
    },
});

export const { clearCurrentNews } = newsSlice.actions;
export default newsSlice.reducer;
