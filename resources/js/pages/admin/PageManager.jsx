import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPages, deletePage } from '../../store/pageSlice';
import toast from 'react-hot-toast';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import Modal from '../../components/ui/Modal';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const PageManager = () => {
    const dispatch = useDispatch();
    const { items: pages, loading, initialized } = useSelector((state) => state.page);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        content: '',
        is_published: true
    });

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchPages());
        }
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus halaman ini?')) return;
        dispatch(deletePage(id));
    };

    const handleEdit = (page) => {
        setFormData({
            id: page.id,
            title: page.title,
            content: page.content || '',
            is_published: page.is_published
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setFormData({
            id: null,
            title: '',
            content: '',
            is_published: true
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await axios.put(`/pages/${formData.id}`, formData);
                toast.success('Halaman diperbarui');
            } else {
                await axios.post('/pages', formData);
                toast.success('Halaman dibuat');
            }
            setIsModalOpen(false);
            dispatch(fetchPages());
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan halaman');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            accessorKey: 'title',
            header: 'Judul Halaman',
            cell: info => <span className="font-bold">{info.getValue()}</span>
        },
        {
            accessorKey: 'slug',
            header: 'URL Slug',
            cell: info => <span className="text-primary bg-primary/10 px-2 py-1 rounded font-code text-xs">/p/{info.getValue()}</span>
        },
        {
            accessorKey: 'is_published',
            header: 'Status',
            cell: info => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${info.getValue() ? 'bg-success/20 text-success' : 'bg-surface-variant text-on-surface-variant'}`}>
                    {info.getValue() ? 'PUBLISHED' : 'DRAFT'}
                </span>
            )
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

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="w-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Halaman Dinamis</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola halaman kustom seperti Profil, Sejarah, dsb.</p>
                </div>
            </div>
            
            <div className="relative">
                {loading && !initialized ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={pages} 
                        searchPlaceholder="Cari halaman..."
                        onAdd={handleAdd}
                        addLabel="Buat Halaman"
                    />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title={formData.id ? 'Edit Halaman' : 'Buat Halaman Baru'}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto p-1 w-full" style={{ minWidth: '600px' }}>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Judul Halaman</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Konten</label>
                        <div className="bg-surface rounded overflow-hidden" style={{ minHeight: '300px' }}>
                            <ReactQuill 
                                theme="snow"
                                value={formData.content}
                                onChange={(val) => setFormData({...formData, content: val})}
                                modules={quillModules}
                                style={{ height: '250px' }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={formData.is_published}
                            onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                            className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary focus:ring-2"
                        />
                        <label htmlFor="is_published" className="text-sm font-medium text-on-surface">Terbitkan Halaman (Published)</label>
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
                            {submitting ? 'Menyimpan...' : 'Simpan Halaman'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PageManager;
