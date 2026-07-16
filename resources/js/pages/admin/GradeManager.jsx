import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGrades, saveGrade } from '../../store/gradeSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const GradeManager = () => {
    const dispatch = useDispatch();
    const { items: grades, loading } = useSelector((state) => state.grade);
    const [classrooms, setClassrooms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
    
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios.get('/classrooms').then(res => setClassrooms(res.data)).catch(console.error);
        axios.get('/subjects').then(res => setSubjects(res.data)).catch(console.error);
        axios.get('/semesters').then(res => setSemesters(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedClassroom && selectedSubject && selectedSemester) {
            loadData();
        }
    }, [selectedClassroom, selectedSubject, selectedSemester]);

    const loadData = async () => {
        dispatch(fetchGrades({
            classroom_id: selectedClassroom,
            subject_id: selectedSubject,
            semester_id: selectedSemester
        }));
        try {
            const res = await axios.get('/students');
            // Filter students by classroom manually or ideally via backend. Assuming students have classrooms relation.
            const clsStudents = res.data.filter(s => s.classrooms?.some(c => c.id == selectedClassroom));
            setStudents(clsStudents);
        } catch(e) {
            console.error(e);
        }
    };

    const handleSave = async (studentId, field, value) => {
        let val = parseFloat(value);
        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;
        if (val > 100) val = 100;

        const existing = grades.find(g => g.student_id === studentId);
        const data = {
            student_id: studentId,
            subject_id: selectedSubject,
            semester_id: selectedSemester,
            classroom_id: selectedClassroom,
            assignment_score: existing ? existing.assignment_score : 0,
            midterm_score: existing ? existing.midterm_score : 0,
            final_score: existing ? existing.final_score : 0,
        };
        data[field] = val;

        try {
            await dispatch(saveGrade(data)).unwrap();
            toast.success('Nilai berhasil disimpan');
        } catch(e) {
            toast.error('Gagal menyimpan nilai');
        }
    };

    const getGradeValue = (studentId, field) => {
        const existing = grades.find(g => g.student_id === studentId);
        return existing ? existing[field] || '' : '';
    };

    return (
        <div className="w-full flex flex-col h-full min-h-0">
            <div className="mb-6">
                <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Penilaian</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Kelola nilai akademik siswa (Tugas, UTS, UAS).</p>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Pilih Kelas</label>
                    <select value={selectedClassroom} onChange={e => setSelectedClassroom(e.target.value)} className="w-full p-2 border rounded bg-surface">
                        <option value="">-- Pilih Kelas --</option>
                        {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Pilih Mata Pelajaran</label>
                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full p-2 border rounded bg-surface">
                        <option value="">-- Pilih Mata Pelajaran --</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Pilih Semester</label>
                    <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} className="w-full p-2 border rounded bg-surface">
                        <option value="">-- Pilih Semester --</option>
                        {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            {selectedClassroom && selectedSubject && selectedSemester ? (
                <div className="flex-1 overflow-auto bg-surface-container-lowest border border-outline-variant rounded-xl">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface-container-low border-b uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Nama Siswa</th>
                                <th className="px-4 py-3 w-32">Nilai Tugas</th>
                                <th className="px-4 py-3 w-32">Nilai UTS</th>
                                <th className="px-4 py-3 w-32">Nilai UAS</th>
                                <th className="px-4 py-3 w-32 text-center">Nilai Akhir</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {students.length > 0 ? students.map(student => (
                                <tr key={student.id} className="hover:bg-surface-container-lowest/50">
                                    <td className="px-4 py-2 font-medium">{student.user?.name}</td>
                                    <td className="px-4 py-2">
                                        <input type="number" 
                                            className="w-full p-1 border rounded text-center" 
                                            defaultValue={getGradeValue(student.id, 'assignment_score')} 
                                            onBlur={e => handleSave(student.id, 'assignment_score', e.target.value)} 
                                            min="0" max="100" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input type="number" 
                                            className="w-full p-1 border rounded text-center" 
                                            defaultValue={getGradeValue(student.id, 'midterm_score')} 
                                            onBlur={e => handleSave(student.id, 'midterm_score', e.target.value)} 
                                            min="0" max="100" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input type="number" 
                                            className="w-full p-1 border rounded text-center" 
                                            defaultValue={getGradeValue(student.id, 'final_score')} 
                                            onBlur={e => handleSave(student.id, 'final_score', e.target.value)} 
                                            min="0" max="100" />
                                    </td>
                                    <td className="px-4 py-2 text-center font-bold text-primary">
                                        {getGradeValue(student.id, 'final_grade') || '-'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-on-surface-variant">Belum ada data siswa di kelas ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant">
                    Pilih Kelas, Mata Pelajaran, dan Semester untuk mulai mengisi nilai.
                </div>
            )}
        </div>
    );
};

export default GradeManager;
