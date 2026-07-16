import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import publicReducer from './publicSlice';
import newsReducer from './newsSlice';
import ppdbReducer from './ppdbSlice';
import menuReducer from './menuSlice';
import categoryReducer from './categorySlice';
import tagReducer from './tagSlice';
import pageReducer from './pageSlice';
import rbacReducer from './rbacSlice';
import organizationReducer from './organizationSlice';
import profileReducer from './profileSlice';
import ppdbMasterReducer from './ppdbMasterSlice';
import academicCalendarReducer from './academicCalendarSlice';
import subjectReducer from './subjectSlice';
import classroomReducer from './classroomSlice';
import teacherReducer from './teacherSlice';
import studentReducer from './studentSlice';
import scheduleReducer from './scheduleSlice';
import attendanceReducer from './attendanceSlice';
import lessonHourReducer from './slices/lessonHourSlice';
import academicMasterReducer from './academicMasterSlice';
import gradeReducer from './gradeSlice';
import promotionReducer from './promotionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        public: publicReducer,
        news: newsReducer,
        ppdb: ppdbReducer,
        ppdbMaster: ppdbMasterReducer,
        menu: menuReducer,
        category: categoryReducer,
        tag: tagReducer,
        page: pageReducer,
        rbac: rbacReducer,
        organization: organizationReducer,
        profile: profileReducer,
        academicCalendar: academicCalendarReducer,
        subject: subjectReducer,
        classroom: classroomReducer,
        teacher: teacherReducer,
        student: studentReducer,
        schedule: scheduleReducer,
        attendance: attendanceReducer,
        lessonHour: lessonHourReducer,
        academicMaster: academicMasterReducer,
        grade: gradeReducer,
        promotion: promotionReducer,
    },
});
