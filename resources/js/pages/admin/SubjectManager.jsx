import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubjects, deleteSubject } from '../../store/subjectSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import Modal from '../../components/ui/Modal';
import axios from 'axios';

const SubjectManager = () => {
    const dispatch = useDispatch();
    const { items: subjects, loading, initialized } = useSelector((state) => state.subject);
    
    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, code: '', name: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchSubjects());
        }
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus mata pelajaran ini?')) return;
        dispatch(deleteSubject(id));
    };

    const handleEdit = (subject) => {
        setFormData({ id: subject.id, code: subject.code, name: subject.name });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setFormData({ id: null, code: '', name: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await axios.put(`/subjects/${formData.id}`, formData);
                toast.success('Mata pelajaran diperbarui');
            } else {
                await axios.post('/subjects', formData);
                toast.success('Mata pelajaran ditambahkan');
            }
            setIsModalOpen(false);
            dispatch(fetchSubjects());
        } catch (error) {
            toast.error('Gagal menyimpan data');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            accessorKey: 'code',
            header: 'Kode',
            cell: info => <span className="font-code text-primary text-xs">{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'name',
            header: 'Nama Mata Pelajaran',
            cell: info => <span className="font-bold">{info.getValue() || '-'}</span>
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
            const response = await axios.get('/subjects/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Mata_Pelajaran.xlsx');
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
            const response = await axios.get('/subjects/template', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Template_Import_Mata_Pelajaran.xlsx');
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
            await axios.post('/subjects/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Data mata pelajaran berhasil diimpor', { id: toastId });
            dispatch(fetchSubjects());
        } catch (error) {
            toast.error(error.response?.data?.error || 'Gagal mengimpor data', { id: toastId });
        }
        e.target.value = ''; // Reset file input
    };

    return (
        <div className="w-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Mata Pelajaran</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola daftar mata pelajaran.</p>
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
                        data={subjects} 
                        searchPlaceholder="Cari mata pelajaran..."
                        onAdd={handleAdd}
                        addLabel="Tambah Mapel"
                    />
                )}
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => !submitting && setIsModalOpen(false)}
                title={formData.id ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Kode Mapel</label>
                        <input 
                            type="text" 
                            value={formData.code} 
                            onChange={(e) => setFormData({...formData, code: e.target.value})}
                            required 
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Nama Mata Pelajaran</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
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

export default SubjectManager;
