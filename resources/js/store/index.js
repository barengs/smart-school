import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import publicReducer from './publicSlice';
import newsReducer from './newsSlice';
import ppdbReducer from './ppdbSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        public: publicReducer,
        news: newsReducer,
        ppdb: ppdbReducer,
    },
});
