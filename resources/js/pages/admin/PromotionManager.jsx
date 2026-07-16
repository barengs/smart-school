import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEligibleStudents, processBulkPromotions } from '../../store/promotionSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const PromotionManager = () => {
    const dispatch = useDispatch();
    const { eligibleStudents, loading } = useSelector((state) => state.promotion);
    const [classrooms, setClassrooms] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    
    const [selectedFromClassroom, setSelectedFromClassroom] = useState('');
    const [selectedTargetYear, setSelectedTargetYear] = useState('');
    const [bulkTargetClass, setBulkTargetClass] = useState('');
    
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        axios.get('/classrooms').then(res => setClassrooms(res.data)).catch(console.error);
        axios.get('/academic-years').then(res => {
            setAcademicYears(res.data);
            const activeYear = res.data.find(ay => ay.is_active);
            if (activeYear) {
                setSelectedTargetYear(activeYear.id);
            }
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedFromClassroom && selectedTargetYear) {
            setSelectedStudents([]);
            dispatch(fetchEligibleStudents({
                classroom_id: selectedFromClassroom,
                academic_year_id: selectedTargetYear
            }));
        }
    }, [selectedFromClassroom, selectedTargetYear, dispatch]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const processable = eligibleStudents.filter(s => s.promotion_status !== 'approved' && s.promotion_status !== 'rejected').map(s => s.id);
            setSelectedStudents(processable);
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (id, checked) => {
        if (checked) {
            setSelectedStudents([...selectedStudents, id]);
        } else {
            setSelectedStudents(selectedStudents.filter(sId => sId !== id));
        }
    };

    const handleProcessBulk = async () => {
        if (selectedStudents.length === 0) {
            toast.error('Pilih setidaknya satu siswa!');
            return;
        }
        if (!bulkTargetClass) {
            toast.error('Pilih kelas tujuan terlebih dahulu!');
            return;
        }

        try {
            await dispatch(processBulkPromotions({
                student_ids: selectedStudents,
                from_classroom_id: selectedFromClassroom,
                academic_year_id: selectedTargetYear,
                to_classroom_id: bulkTargetClass,
                status: 'approved'
            })).unwrap();
            setSelectedStudents([]);
            toast.success(`${selectedStudents.length} siswa berhasil dinaikkan kelas`);
        } catch (e) {
            toast.error('Gagal memproses kenaikan kelas');
        }
    };

    const handleCancel = () => {
        setSelectedStudents([]);
        toast.success('Pilihan dibatalkan');
    };

    const processableStudents = eligibleStudents.filter(s => s.promotion_status !== 'approved' && s.promotion_status !== 'rejected');
    const isAllSelected = processableStudents.length > 0 && selectedStudents.length === processableStudents.length;

    return (
        <div className="w-full flex flex-col h-full min-h-0">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Kenaikan Kelas</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Pilih kelas asal dan kelas tujuan untuk proses kenaikan kelas.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleCancel} 
                        disabled={selectedStudents.length === 0}
                        className="px-4 py-2 border border-outline bg-surface rounded font-medium hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleProcessBulk} 
                        disabled={selectedStudents.length === 0}
                        className="px-4 py-2 bg-primary text-on-primary rounded font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Simpan
                    </button>
                </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Kelas Asal</label>
                    <select value={selectedFromClassroom} onChange={e => setSelectedFromClassroom(e.target.value)} className="w-full p-2 border rounded bg-surface">
                        <option value="">-- Pilih Kelas Asal --</option>
                        {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Kelas Tujuan</label>
                    <select value={bulkTargetClass} onChange={e => setBulkTargetClass(e.target.value)} className="w-full p-2 border rounded bg-surface">
                        <option value="">-- Pilih Kelas Tujuan --</option>
                        {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tahun Ajaran Kenaikan</label>
                    <select value={selectedTargetYear} onChange={e => setSelectedTargetYear(e.target.value)} className="w-full p-2 border rounded bg-surface">
                        <option value="">-- Pilih Tahun Ajaran --</option>
                        {academicYears.map(ay => <option key={ay.id} value={ay.id}>{ay.name}</option>)}
                    </select>
                </div>
            </div>

            {selectedFromClassroom && selectedTargetYear ? (
                <div className="flex-1 overflow-auto bg-surface-container-lowest border border-outline-variant rounded-xl">
                    {loading && <div className="p-4 text-center">Loading...</div>}
                    {!loading && (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-surface-container-low border-b uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 w-12 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            disabled={processableStudents.length === 0}
                                        />
                                    </th>
                                    <th className="px-4 py-3">Nama Siswa</th>
                                    <th className="px-4 py-3 text-center">Rata-rata Nilai</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {eligibleStudents.length > 0 ? eligibleStudents.map(student => {
                                    const isApproved = student.promotion_status === 'approved';
                                    const isRejected = student.promotion_status === 'rejected';
                                    return (
                                        <tr key={student.id} className={`hover:bg-surface-container-lowest/50 ${isApproved ? 'bg-success/5' : ''}`}>
                                            <td className="px-4 py-2 text-center">
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                                                    disabled={isApproved || isRejected}
                                                />
                                            </td>
                                            <td className="px-4 py-2 font-medium">{student.user?.name}</td>
                                            <td className="px-4 py-2 text-center font-bold">{parseFloat(student.average_grade).toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">
                                                {isApproved && <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-medium">Naik Kelas</span>}
                                                {isRejected && <span className="px-2 py-1 bg-error/20 text-error rounded text-xs font-medium">Tinggal Kelas</span>}
                                                {!isApproved && !isRejected && <span className="px-2 py-1 bg-surface-container text-on-surface-variant rounded text-xs">Menunggu</span>}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-on-surface-variant">Belum ada data siswa di kelas ini.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant">
                    Pilih Kelas Asal dan Tahun Ajaran untuk menampilkan daftar siswa.
                </div>
            )}
        </div>
    );
};

export default PromotionManager;
