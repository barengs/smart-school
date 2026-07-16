import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';

import Modal from '../../components/ui/Modal';

const CbtManager = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', type: 'academic', duration_minutes: 60, randomize_questions: false, is_active: true });

    const fetchExams = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/cbt/exams');
            setExams(res.data);
        } catch (error) {
            toast.error('Gagal mengambil data ujian');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleAdd = () => {
        setFormData({ id: null, title: '', type: 'academic', duration_minutes: 60, randomize_questions: false, is_active: true });
        setIsModalOpen(true);
    };

    const handleEdit = (exam) => {
        setFormData({ ...exam, randomize_questions: !!exam.randomize_questions, is_active: !!exam.is_active });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus ujian ini beserta semua soal dan data sesinya?')) return;
        try {
            await axios.delete(`/admin/cbt/exams/${id}`);
            toast.success('Ujian dihapus');
            fetchExams();
        } catch (error) {
            toast.error('Gagal menghapus ujian');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await axios.put(`/admin/cbt/exams/${formData.id}`, formData);
                toast.success('Ujian diperbarui');
            } else {
                await axios.post('/admin/cbt/exams', formData);
                toast.success('Ujian ditambahkan');
            }
            setIsModalOpen(false);
            fetchExams();
        } catch (error) {
            toast.error('Gagal menyimpan ujian');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { accessorKey: 'title', header: 'Judul Ujian' },
        { accessorKey: 'type', header: 'Tipe', cell: info => info.getValue() === 'ppdb' ? 'PPDB' : 'Akademik' },
        { accessorKey: 'duration_minutes', header: 'Durasi (Menit)' },
        { accessorKey: 'questions_count', header: 'Jml Soal' },
        { accessorKey: 'participants_count', header: 'Peserta' },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/admin/cbt/exams/${row.original.id}/builder`)}>
                        Kelola Soal
                    </Button>
                    <button onClick={() => handleEdit(row.original)} className="text-primary hover:text-primary/80" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(row.original.id)} className="text-error hover:text-error/80" title="Hapus">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-6 flex justify-between items-end shrink-0">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Ujian (CBT)</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola data ujian, bank soal, dan peserta.</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto relative">
                    <DataTable 
                        columns={columns} 
                        data={exams} 
                        searchPlaceholder="Cari ujian..."
                        onAdd={handleAdd}
                        addLabel="Tambah Ujian"
                    />
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => !submitting && setIsModalOpen(false)}
                title={formData.id ? 'Edit Ujian' : 'Tambah Ujian'}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Judul Ujian</label>
                        <input 
                            type="text" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required 
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Tipe Ujian</label>
                        <select 
                            value={formData.type} 
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        >
                            <option value="academic">Akademik (Siswa)</option>
                            <option value="ppdb">PPDB (Pendaftar)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Durasi (Menit)</label>
                        <input 
                            type="number" 
                            min="1"
                            value={formData.duration_minutes} 
                            onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                            required 
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="randomize_questions"
                            checked={formData.randomize_questions} 
                            onChange={(e) => setFormData({...formData, randomize_questions: e.target.checked})}
                        />
                        <label htmlFor="randomize_questions" className="text-sm font-medium text-on-surface cursor-pointer">Acak Soal</label>
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

export default CbtManager;
