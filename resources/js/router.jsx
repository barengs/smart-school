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
import DynamicPage from './pages/public/DynamicPage';
import CbtExamClient from './pages/public/CbtExamClient';
import { Navigate } from 'react-router-dom';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import CbtManager from './pages/admin/CbtManager';
import CbtExamBuilder from './pages/admin/CbtExamBuilder';
import NewsManager from './pages/admin/NewsManager';
import RoleMatrix from './pages/admin/RoleMatrix';

import MenuManager from './pages/admin/MenuManager';
import PageManager from './pages/admin/PageManager';
import ProfileManager from './pages/admin/ProfileManager';
import MyProfile from './pages/admin/MyProfile';
import OrganizationManager from './pages/admin/OrganizationManager';
import PpdbManager from './pages/admin/PpdbManager';
import BatchManager from './pages/admin/BatchManager';
import PathManager from './pages/admin/PathManager';
import DocumentRequirementManager from './pages/admin/DocumentRequirementManager';
import AcademicMasterManager from './pages/admin/AcademicMasterManager';
import Contact from './pages/public/Contact';
import ContactManager from './pages/admin/ContactManager';
import AcademicCalendarManager from './pages/admin/AcademicCalendarManager';
import ModuleManager from './pages/admin/ModuleManager';
import ServiceManager from './pages/admin/ServiceManager';
import AttendanceManager from './pages/admin/AttendanceManager';

import CategoryManager from './pages/admin/CategoryManager';
import TagManager from './pages/admin/TagManager';
import NewsFormPage from './pages/admin/NewsFormPage';

import SubjectManager from './pages/admin/SubjectManager';
import LessonHourManager from './pages/admin/academic/LessonHourManager';
import ClassroomManager from './pages/admin/ClassroomManager';
import ScheduleManager from './pages/admin/ScheduleManager';
import ScheduleFormPage from './pages/admin/ScheduleFormPage';
import TeacherManager from './pages/admin/TeacherManager';
import StaffManager from './pages/admin/StaffManager';
import StudentManager from './pages/admin/StudentManager';
import GradeManager from './pages/admin/GradeManager';
import PromotionManager from './pages/admin/PromotionManager';

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
                <Route path="/p/:slug" element={<DynamicPage />} />
                {/* Other pages like /admissions, /academics could go here */}
            </Route>

            {/* Admin Login */}
            <Route path="/login" element={<Login />} />
            <Route path="/cbt" element={<CbtExamClient />} />

            {/* Admin Routes with Layout */}
            <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/cbt/exams" element={<CbtManager />} />
                <Route path="/admin/cbt/exams/:id/builder" element={<CbtExamBuilder />} />
                <Route path="/admin/news" element={<NewsManager />} />
                <Route path="/admin/news/create" element={<NewsFormPage />} />
                <Route path="/admin/news/edit/:id" element={<NewsFormPage />} />
                <Route path="/admin/categories" element={<CategoryManager />} />
                <Route path="/admin/tags" element={<TagManager />} />
                <Route path="/admin/rbac" element={<RoleMatrix />} />
                <Route path="/admin/menus" element={<MenuManager />} />
                <Route path="/admin/pages" element={<PageManager />} />
                <Route path="/admin/profile" element={<ProfileManager />} />
                <Route path="/admin/my-profile" element={<MyProfile />} />
                <Route path="/admin/organization" element={<OrganizationManager />} />
                <Route path="/admin/ppdb" element={<PpdbManager />} />
                <Route path="/admin/ppdb/batches" element={<BatchManager />} />
                <Route path="/admin/master-ppdb" element={<Navigate to="/admin/master-ppdb/paths" replace />} />
                <Route path="/admin/master-ppdb/paths" element={<PathManager />} />
                <Route path="/admin/master-ppdb/docs" element={<DocumentRequirementManager />} />
                <Route path="/admin/academic-years" element={<AcademicMasterManager />} />
                <Route path="/admin/contacts" element={<ContactManager />} />
                <Route path="/admin/academic-calendar" element={<AcademicCalendarManager />} />
                <Route path="/admin/attendance" element={<AttendanceManager />} />
                <Route path="/admin/modules" element={<ModuleManager />} />
                <Route path="/admin/services" element={<ServiceManager />} />
                
                <Route path="/admin/subjects" element={<SubjectManager />} />
                <Route path="/admin/lesson-hours" element={<LessonHourManager />} />
                <Route path="/admin/classrooms" element={<ClassroomManager />} />
                <Route path="/admin/schedules" element={<ScheduleManager />} />
                <Route path="/admin/schedules/create" element={<ScheduleFormPage />} />
                <Route path="/admin/schedules/edit/:id" element={<ScheduleFormPage />} />
                <Route path="/admin/teachers" element={<TeacherManager />} />
                <Route path="/admin/staffs" element={<StaffManager />} />
                <Route path="/admin/students" element={<StudentManager />} />
                <Route path="/admin/grades" element={<GradeManager />} />
                <Route path="/admin/promotions" element={<PromotionManager />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
