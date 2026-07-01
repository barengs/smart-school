import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';

// Default Axios settings
import axios from 'axios';
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

import { Provider } from 'react-redux';
import { store } from './store';

import { Toaster } from 'react-hot-toast';

const App = () => {
    return (
        <React.StrictMode>
            <Provider store={store}>
                <BrowserRouter>
                    <Toaster position="top-right" />
                    <AppRouter />
                </BrowserRouter>
            </Provider>
        </React.StrictMode>
    );
};

let root = window.reactRoot;
if (!root) {
    root = createRoot(document.getElementById('root'));
    window.reactRoot = root;
}
root.render(<App />);
