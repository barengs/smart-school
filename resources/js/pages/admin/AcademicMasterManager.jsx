import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchAcademicYears, saveAcademicYear, deleteAcademicYear,
    fetchSemesters, saveSemester, deleteSemester
} from '../../store/academicMasterSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import toast from 'react-hot-toast';

const AcademicMasterManager = () => {
    const dispatch = useDispatch();
    const { 
        academicYears, semesters, loading, 
        initializedAcademicYears, initializedSemesters 
    } = useSelector(state => state.academicMaster);

    const [activeTab, setActiveTab] = useState('academic_years');
    
    // Modal states
    const [isYearModalOpen, setIsYearModalOpen] = useState(false);
    const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (!initializedAcademicYears) {
            dispatch(fetchAcademicYears());
        }
        if (!initializedSemesters) {
            dispatch(fetchSemesters());
        }
    }, [dispatch, initializedAcademicYears, initializedSemesters]);

    const handleDelete = (id, type) => {
        if (!window.confirm('Yakin ingin menghapus data ini?')) return;
        if (type === 'academic_years') dispatch(deleteAcademicYear(id));
        else if (type === 'semesters') dispatch(deleteSemester(id));
    };

    const handleEditYear = (data) => {
        setEditData(data);
        setIsYearModalOpen(true);
    };

    const handleEditSemester = (data) => {
        setEditData(data);
        setIsSemesterModalOpen(true);
    };

    // Columns
    const yearCols = [
        { accessorKey: 'name', header: 'Tahun Ajaran' },
        { 
            accessorKey: 'is_active', 
            header: 'Status',
            cell: (info) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${info.getValue() ? 'bg-success/20 text-success' : 'bg-surface-container text-on-surface-variant'}`}>
                    {info.getValue() ? 'Aktif' : 'Nonaktif'}
                </span>
            )
        },
        {
            accessorKey: 'id',
            header: 'Aksi',
            cell: (info) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEditYear(info.row.original)} className="text-primary hover:text-primary-container"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                    <button onClick={() => handleDelete(info.getValue(), 'academic_years')} className="text-error hover:text-error-container"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                </div>
            )
        }
    ];

    const semesterCols = [
        { 
            accessorKey: 'academicYear', 
            header: 'Tahun Ajaran',
            cell: (info) => info.row.original.academic_year?.name || '-'
        },
        { accessorKey: 'name', header: 'Semester' },
        { 
            accessorKey: 'is_active', 
            header: 'Status',
            cell: (info) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${info.getValue() ? 'bg-success/20 text-success' : 'bg-surface-container text-on-surface-variant'}`}>
                    {info.getValue() ? 'Aktif' : 'Nonaktif'}
                </span>
            )
        },
        {
            accessorKey: 'id',
            header: 'Aksi',
            cell: (info) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEditSemester(info.row.original)} className="text-primary hover:text-primary-container"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                    <button onClick={() => handleDelete(info.getValue(), 'semesters')} className="text-error hover:text-error-container"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                </div>
            )
        }
    ];

    return (
        <div className="p-margin-desktop space-y-stack-lg max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-display-sm text-display-sm text-on-surface">Data Master Akademik</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Kelola data tahun ajaran dan semester yang aktif.</p>
                </div>
            </div>

            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="flex border-b border-outline-variant overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('academic_years')}
                        className={`px-6 py-4 font-label-lg text-label-lg whitespace-nowrap transition-colors ${activeTab === 'academic_years' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                    >
                        Tahun Ajaran
                    </button>
                    <button 
                        onClick={() => setActiveTab('semesters')}
                        className={`px-6 py-4 font-label-lg text-label-lg whitespace-nowrap transition-colors ${activeTab === 'semesters' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                    >
                        Semester
                    </button>
                </div>

                <div className="p-stack-lg bg-surface-container-lowest min-h-[400px]">
                    {loading ? (
                        <TableSkeleton />
                    ) : (
                        <>
                            {activeTab === 'academic_years' && (
                                <DataTable 
                                    columns={yearCols} 
                                    data={academicYears} 
                                    searchPlaceholder="Cari tahun ajaran..." 
                                    onAdd={() => { setEditData(null); setIsYearModalOpen(true); }} 
                                    addLabel="Tambah Tahun Ajaran" 
                                />
                            )}
                            {activeTab === 'semesters' && (
                                <DataTable 
                                    columns={semesterCols} 
                                    data={semesters} 
                                    searchPlaceholder="Cari semester..." 
                                    onAdd={() => { setEditData(null); setIsSemesterModalOpen(true); }} 
                                    addLabel="Tambah Semester" 
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modals will be rendered here. For simplicity, we use simple forms in modals */}
            {isYearModalOpen && (
                <YearModal 
                    data={editData} 
                    onClose={() => setIsYearModalOpen(false)} 
                    onSave={(data) => {
                        dispatch(saveAcademicYear(data)).unwrap().then(() => {
                            toast.success('Berhasil menyimpan Tahun Ajaran');
                            setIsYearModalOpen(false);
                        }).catch(err => toast.error('Gagal menyimpan'));
                    }} 
                />
            )}

            {isSemesterModalOpen && (
                <SemesterModal 
                    data={editData} 
                    academicYears={academicYears}
                    onClose={() => setIsSemesterModalOpen(false)} 
                    onSave={(data) => {
                        dispatch(saveSemester(data)).unwrap().then(() => {
                            toast.success('Berhasil menyimpan Semester');
                            setIsSemesterModalOpen(false);
                        }).catch(err => toast.error('Gagal menyimpan'));
                    }} 
                />
            )}
        </div>
    );
};

// Modal Components
const YearModal = ({ data, onClose, onSave }) => {
    const [name, setName] = useState(data?.name || '');
    const [isActive, setIsActive] = useState(data?.is_active || false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                    <h3 className="font-headline-sm">{data ? 'Edit' : 'Tambah'} Tahun Ajaran</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave({ id: data?.id, name, is_active: isActive }); }}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Tahun Ajaran</label>
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: 2024/2025" className="w-full p-2 border rounded" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="y-active" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                            <label htmlFor="y-active">Jadikan sebagai Tahun Ajaran Aktif</label>
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-2 bg-surface-container-lowest">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-container">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SemesterModal = ({ data, academicYears, onClose, onSave }) => {
    const [name, setName] = useState(data?.name || '');
    const [ayId, setAyId] = useState(data?.academic_year_id || '');
    const [isActive, setIsActive] = useState(data?.is_active || false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                    <h3 className="font-headline-sm">{data ? 'Edit' : 'Tambah'} Semester</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onSave({ id: data?.id, name, academic_year_id: ayId, is_active: isActive }); }}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tahun Ajaran</label>
                            <select required value={ayId} onChange={e => setAyId(e.target.value)} className="w-full p-2 border rounded">
                                <option value="">-- Pilih Tahun Ajaran --</option>
                                {academicYears.map(ay => (
                                    <option key={ay.id} value={ay.id}>{ay.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Semester</label>
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Ganjil / Genap" className="w-full p-2 border rounded" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="s-active" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                            <label htmlFor="s-active">Jadikan sebagai Semester Aktif (di Tahun Ajaran ini)</label>
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-2 bg-surface-container-lowest">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-container">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AcademicMasterManager;
