import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocumentRequirements, deleteDocumentRequirement, saveDocumentRequirement } from '../../store/ppdbMasterSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const DocumentRequirementManager = () => {
    const dispatch = useDispatch();
    const { documentRequirements, loading, initialized } = useSelector(state => state.ppdbMaster);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', description: '', is_required: true, is_active: true });

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchDocumentRequirements());
        }
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus data ini?')) return;
        dispatch(deleteDocumentRequirement(id));
    };

    const handleAdd = () => {
        setFormData({ id: null, name: '', description: '', is_required: true, is_active: true });
        setIsModalOpen(true);
    };

    const handleEdit = (doc) => {
        setFormData({ ...doc, is_required: !!doc.is_required, is_active: !!doc.is_active });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await dispatch(saveDocumentRequirement(formData)).unwrap();
            setIsModalOpen(false);
        } catch (error) {
            // Error handled in thunk
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { accessorKey: 'name', header: 'Nama Dokumen', cell: info => <span className="font-bold">{info.getValue()}</span> },
        { 
            accessorKey: 'is_required', 
            header: 'Wajib?',
            cell: info => info.getValue() ? <span className="text-error font-bold">Wajib</span> : 'Opsional'
        },
        { accessorKey: 'description', header: 'Keterangan', cell: info => info.getValue() || '-' },
        {
            id: 'actions', header: 'Aksi',
            cell: ({row}) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(row.original)} className="text-primary hover:text-primary/80"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(row.original.id)} className="text-error hover:text-error/80"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
            )
        }
    ];

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Syarat Dokumen</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Kelola syarat dokumen untuk pendaftaran PPDB.</p>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto relative">
                    {loading && !initialized ? (
                        <TableSkeleton />
                    ) : (
                        <DataTable columns={columns} data={documentRequirements} searchPlaceholder="Cari syarat dokumen..." onAdd={handleAdd} addLabel="Tambah Dokumen" />
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title={formData.id ? 'Edit Dokumen' : 'Tambah Dokumen'}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Dokumen</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Keterangan</label>
                        <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" rows="3" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="is_required" checked={formData.is_required} onChange={e => setFormData({...formData, is_required: e.target.checked})} />
                        <label htmlFor="is_required" className="text-sm cursor-pointer">Wajib (Pendaftar harus unggah)</label>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} disabled={submitting} className="px-4 py-2 border rounded">Batal</button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white rounded">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DocumentRequirementManager;
