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

import MenuManager from './pages/admin/MenuManager';
import PageManager from './pages/admin/PageManager';
import ProfileManager from './pages/admin/ProfileManager';
import OrganizationManager from './pages/admin/OrganizationManager';
import PpdbManager from './pages/admin/PpdbManager';
import MasterPpdbManager from './pages/admin/MasterPpdbManager';
import Contact from './pages/public/Contact';
import ContactManager from './pages/admin/ContactManager';
import AcademicCalendarManager from './pages/admin/AcademicCalendarManager';

import CategoryManager from './pages/admin/CategoryManager';
import TagManager from './pages/admin/TagManager';
import NewsFormPage from './pages/admin/NewsFormPage';

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
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<SchoolProfile />} />
                {/* Other pages like /admissions, /academics could go here */}
            </Route>

            {/* Admin Login */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes with Layout */}
            <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/news" element={<NewsManager />} />
                <Route path="/admin/news/create" element={<NewsFormPage />} />
                <Route path="/admin/news/edit/:id" element={<NewsFormPage />} />
                <Route path="/admin/categories" element={<CategoryManager />} />
                <Route path="/admin/tags" element={<TagManager />} />
                <Route path="/admin/rbac" element={<RoleMatrix />} />
                <Route path="/admin/menus" element={<MenuManager />} />
                <Route path="/admin/pages" element={<PageManager />} />
                <Route path="/admin/profile" element={<ProfileManager />} />
                <Route path="/admin/organization" element={<OrganizationManager />} />
                <Route path="/admin/ppdb" element={<PpdbManager />} />
                <Route path="/admin/master-ppdb" element={<MasterPpdbManager />} />
                <Route path="/admin/contacts" element={<ContactManager />} />
                <Route path="/admin/academic-calendar" element={<AcademicCalendarManager />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
