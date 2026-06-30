import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/public/Home';
import PublicNews from './pages/public/PublicNews';
import PublicNewsDetail from './pages/public/PublicNewsDetail';
import PublicPPDB from './pages/public/PublicPPDB';
import InfoPPDB from './pages/public/InfoPPDB';
import SchoolProfile from './pages/public/SchoolProfile';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import NewsManager from './pages/admin/NewsManager';
import RoleMatrix from './pages/admin/RoleMatrix';

const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes with Layout */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/news" element={<PublicNews />} />
                <Route path="/news/:slug" element={<PublicNewsDetail />} />
                <Route path="/info-ppdb" element={<InfoPPDB />} />
                <Route path="/form-ppdb" element={<PublicPPDB />} />
                <Route path="/profile" element={<SchoolProfile />} />
                {/* Other pages like /admissions, /academics could go here */}
            </Route>

            {/* Admin Login */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes with Layout */}
            <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/news" element={<NewsManager />} />
                <Route path="/admin/rbac" element={<RoleMatrix />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
