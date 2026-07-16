import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createSchedule, updateSchedule } from '../../store/scheduleSlice';
import { fetchTeachers } from '../../store/teacherSlice';
import { fetchClassrooms } from '../../store/classroomSlice';
import { fetchSubjects } from '../../store/subjectSlice';
import { fetchLessonHours } from '../../store/slices/lessonHourSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const ScheduleFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        semester_id: '',
        classroom_id: '',
        subject_id: '',
        teacher_id: '',
        day: 'Senin',
        lesson_hour_id: ''
    });
    
    const [submitting, setSubmitting] = useState(false);
    const [academicYears, setAcademicYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
    
    const { items: teachers, initialized: teachersInit } = useSelector(state => state.teacher);
    const { items: classrooms, initialized: classInit } = useSelector(state => state.classroom);
    const { items: subjects, initialized: subInit } = useSelector(state => state.subject);
    const { data: lessonHours, status: lessonHourStatus } = useSelector(state => state.lessonHour);

    useEffect(() => {
        if (!teachersInit) dispatch(fetchTeachers());
        if (!classInit) dispatch(fetchClassrooms());
        if (!subInit) dispatch(fetchSubjects());
        if (lessonHourStatus === 'idle') dispatch(fetchLessonHours());
        
        axios.get('/academic-years').then(res => {
            const ays = res.data;
            setAcademicYears(ays);
            if (!id && ays.length > 0) {
                const active = ays.find(ay => ay.is_active);
                if (active) setSelectedAcademicYear(active.id);
            }
        });
        
        if (id) {
            axios.get(`/schedules/${id}`).then(res => {
                setFormData({...res.data});
                // Assuming res.data.semester has academic_year_id, but if not we fetch the semester detail
                if (res.data.semester_id) {
                    axios.get(`/semesters/${res.data.semester_id}`).then(semRes => {
                        setSelectedAcademicYear(semRes.data.academic_year_id);
                    });
                }
            });
        }
    }, [dispatch, id, teachersInit, classInit, subInit]);

    useEffect(() => {
        if (selectedAcademicYear) {
            axios.get(`/semesters?academic_year_id=${selectedAcademicYear}`).then(res => {
                const sems = res.data;
                setSemesters(sems);
                if (!id && sems.length > 0 && !formData.semester_id) {
                    const active = sems.find(s => s.is_active);
                    if (active) setFormData(prev => ({...prev, semester_id: active.id}));
                }
            });
        } else {
            setSemesters([]);
        }
    }, [selectedAcademicYear, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (id) {
                await dispatch(updateSchedule({ id, data: formData })).unwrap();
            } else {
                await dispatch(createSchedule(formData)).unwrap();
            }
            navigate('/admin/schedules');
        } catch (error) {
            // Error is handled by thunk/toast
        } finally {
            setSubmitting(false);
        }
    };

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => navigate('/admin/schedules')} className="text-on-surface-variant hover:bg-surface-variant/50 p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">{id ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Isi formulir di bawah ini untuk mengatur jadwal pelajaran.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Tahun Ajaran</label>
                        <select 
                            value={selectedAcademicYear} 
                            onChange={(e) => {
                                setSelectedAcademicYear(e.target.value);
                                setFormData({...formData, semester_id: ''});
                            }}
                            required 
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        >
                            <option value="">-- Pilih Tahun Ajaran --</option>
                            {academicYears.map(ay => <option key={ay.id} value={ay.id}>{ay.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Semester</label>
                        <select 
                            value={formData.semester_id} 
                            onChange={(e) => setFormData({...formData, semester_id: e.target.value})}
                            required 
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                            disabled={!selectedAcademicYear}
                        >
                            <option value="">-- Pilih Semester --</option>
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Hari</label>
                        <select 
                            value={formData.day} 
                            onChange={(e) => setFormData({...formData, day: e.target.value})}
                            required 
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        >
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Jam Pelajaran</label>
                    <select 
                        value={formData.lesson_hour_id} 
                        onChange={(e) => setFormData({...formData, lesson_hour_id: e.target.value})}
                        required 
                        className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                    >
                        <option value="">-- Pilih Jam --</option>
                        {lessonHours.map(lh => (
                            <option key={lh.id} value={lh.id}>{lh.name} ({lh.start_time.substring(0,5)} - {lh.end_time.substring(0,5)})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Mata Pelajaran</label>
                    <select 
                        value={formData.subject_id} 
                        onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                        required 
                        className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                    >
                        <option value="">-- Pilih Mata Pelajaran --</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Guru Pengajar</label>
                    <select 
                        value={formData.teacher_id} 
                        onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                        required 
                        className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                    >
                        <option value="">-- Pilih Guru --</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name || `Guru ID ${t.id}`}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Kelas</label>
                    <select 
                        value={formData.classroom_id} 
                        onChange={(e) => setFormData({...formData, classroom_id: e.target.value})}
                        required 
                        className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                    >
                        <option value="">-- Pilih Kelas --</option>
                        {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/schedules')}
                        disabled={submitting}
                        className="px-4 py-2 text-on-surface-variant hover:bg-surface-variant/50 rounded transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Menyimpan...' : 'Simpan Jadwal'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScheduleFormPage;
