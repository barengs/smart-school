import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessonHours, deleteLessonHour } from '../../../store/slices/lessonHourSlice';
import { DataTable } from '../../../components/DataTable';
import { TableSkeleton } from '../../../components/TableSkeleton';
import Modal from '../../../components/ui/Modal';
import axios from 'axios';

export default function LessonHourManager() {
    const dispatch = useDispatch();
    const { data: lessonHours, status } = useSelector((state) => state.lessonHour);
    const loading = status === 'loading';
    const initialized = status !== 'idle';
    
    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', start_time: '', end_time: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchLessonHours());
        }
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus jam pelajaran ini?')) return;
        dispatch(deleteLessonHour(id));
    };

    const handleEdit = (item) => {
        setFormData({ 
            id: item.id, 
            name: item.name, 
            start_time: item.start_time.substring(0, 5), 
            end_time: item.end_time.substring(0, 5) 
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setFormData({ id: null, name: '', start_time: '', end_time: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await axios.put(`/lesson-hours/${formData.id}`, formData);
                toast.success('Jam pelajaran diperbarui');
            } else {
                await axios.post('/lesson-hours', formData);
                toast.success('Jam pelajaran ditambahkan');
            }
            setIsModalOpen(false);
            dispatch(fetchLessonHours());
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan data');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            header: 'Nama',
            cell: info => <span className="font-bold">{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'start_time',
            header: 'Jam Mulai',
            cell: info => <span>{info.getValue() ? info.getValue().substring(0, 5) : '-'}</span>
        },
        {
            accessorKey: 'end_time',
            header: 'Jam Selesai',
            cell: info => <span>{info.getValue() ? info.getValue().substring(0, 5) : '-'}</span>
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
            const response = await axios.get('/lesson-hours/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Jam_Pelajaran.xlsx');
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
            const response = await axios.get('/lesson-hours/template', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Template_Import_Jam_Pelajaran.xlsx');
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

        const formDataFile = new FormData();
        formDataFile.append('file', file);

        const toastId = toast.loading('Mengimpor data...');
        try {
            await axios.post('/lesson-hours/import', formDataFile, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Data jam pelajaran berhasil diimpor', { id: toastId });
            dispatch(fetchLessonHours());
        } catch (error) {
            toast.error(error.response?.data?.error || 'Gagal mengimpor data', { id: toastId });
        }
        e.target.value = ''; // Reset file input
    };

    return (
        <div className="w-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Master Jam Pelajaran</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola data jam pelajaran.</p>
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
                {loading && !initialized ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={lessonHours} 
                        searchPlaceholder="Cari jam pelajaran..."
                        onAdd={handleAdd}
                        addLabel="Tambah Jam Pelajaran"
                    />
                )}
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => !submitting && setIsModalOpen(false)}
                title={formData.id ? 'Edit Jam Pelajaran' : 'Tambah Jam Pelajaran'}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Nama (Misal: Jam ke-1)</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Jam Mulai</label>
                        <input 
                            type="time" 
                            value={formData.start_time} 
                            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                            required 
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Jam Selesai</label>
                        <input 
                            type="time" 
                            value={formData.end_time} 
                            onChange={(e) => setFormData({...formData, end_time: e.target.value})}
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
}
