import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassrooms, deleteClassroom } from '../../store/classroomSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import Modal from '../../components/ui/Modal';
import axios from 'axios';

const ClassroomManager = () => {
    const dispatch = useDispatch();
    const { items: classrooms, loading, initialized } = useSelector((state) => state.classroom);
    
    const [academicYears, setAcademicYears] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', level: '', academic_year_id: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchClassrooms());
        }
        fetchAcademicYears();
    }, [dispatch, initialized]);

    const fetchAcademicYears = async () => {
        try {
            const res = await axios.get('/academic-years');
            setAcademicYears(res.data);
        } catch (error) {
            console.error('Failed to fetch academic years');
        }
    };

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus kelas ini?')) return;
        dispatch(deleteClassroom(id));
    };

    const handleEdit = (classroom) => {
        setFormData({ 
            id: classroom.id, 
            name: classroom.name, 
            level: classroom.level || '', 
            academic_year_id: classroom.academic_year_id || '' 
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setFormData({ id: null, name: '', level: '', academic_year_id: academicYears.length > 0 ? academicYears[0].id : '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await axios.put(`/classrooms/${formData.id}`, formData);
                toast.success('Kelas diperbarui');
            } else {
                await axios.post('/classrooms', formData);
                toast.success('Kelas ditambahkan');
            }
            setIsModalOpen(false);
            dispatch(fetchClassrooms());
        } catch (error) {
            toast.error('Gagal menyimpan data');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            header: 'Nama Kelas',
            cell: info => <span className="font-bold">{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'level',
            header: 'Tingkat',
            cell: info => <span>{info.getValue() || '-'}</span>
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(row.original)} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(row.original.id)} className="text-error hover:bg-error/10 p-1 rounded transition-colors" title="Hapus">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            )
        }
    ];

    const handleExport = async () => {
        try {
            const toastId = toast.loading('Menyiapkan file export...');
            const response = await axios.get('/classrooms/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Kelas_Rombel.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('File berhasil diunduh', { id: toastId });
        } catch (error) {
            toast.error('Gagal mengunduh file export');
        }
    };

    const handleTemplate = async () => {
        try {
            const toastId = toast.loading('Menyiapkan template...');
            const response = await axios.get('/classrooms/template', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Template_Import_Kelas_Rombel.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Template berhasil diunduh', { id: toastId });
        } catch (error) {
            toast.error('Gagal mengunduh template');
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading('Mengimpor data...');
        try {
            await axios.post('/classrooms/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Data kelas berhasil diimpor', { id: toastId });
            dispatch(fetchClassrooms());
        } catch (error) {
            toast.error(error.response?.data?.error || 'Gagal mengimpor data', { id: toastId });
        }
        e.target.value = ''; // Reset file input
    };

    return (
        <div className="w-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Kelas & Rombel</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola data kelas dan rombongan belajar.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="px-4 py-2 bg-surface border border-outline-variant text-on-surface rounded hover:bg-surface-variant/50 transition-colors flex items-center gap-2 text-sm font-medium">
                        <span className="material-symbols-outlined text-[18px]">download</span> Export
                    </button>
                    <label className="px-4 py-2 bg-surface border border-outline-variant text-on-surface rounded hover:bg-surface-variant/50 transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">upload</span> Import
                        <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
                    </label>
                    <button onClick={handleTemplate} className="px-4 py-2 bg-surface border border-outline-variant text-primary rounded hover:bg-surface-variant/50 transition-colors flex items-center gap-2 text-sm font-medium">
                        <span className="material-symbols-outlined text-[18px]">description</span> Template
                    </button>
                </div>
            </div>
            
            <div className="relative">
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={classrooms} 
                        searchPlaceholder="Cari kelas..."
                        onAdd={handleAdd}
                        addLabel="Tambah Kelas"
                    />
                )}
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => !submitting && setIsModalOpen(false)}
                title={formData.id ? 'Edit Kelas' : 'Tambah Kelas'}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Nama Kelas</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Tingkat</label>
                        <input 
                            type="text" 
                            value={formData.level} 
                            onChange={(e) => setFormData({...formData, level: e.target.value})}
                            placeholder="Contoh: 10, 11, 12"
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
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
                            {submitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClassroomManager;
