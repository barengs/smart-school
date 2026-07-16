import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaths, deletePath, savePath } from '../../store/ppdbMasterSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import axios from 'axios';

const PathManager = () => {
    const dispatch = useDispatch();
    const { paths, loading, initialized } = useSelector(state => state.ppdbMaster);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', description: '', is_active: true, requires_cbt: false, cbt_exam_id: '' });
    const [exams, setExams] = useState([]);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchPaths());
        }
        axios.get('/admin/cbt/exams').then(res => {
            setExams(res.data.filter(e => e.type === 'ppdb' && e.is_active));
        }).catch(err => console.error(err));
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus data ini?')) return;
        dispatch(deletePath(id));
    };

    const handleAdd = () => {
        setFormData({ id: null, name: '', description: '', is_active: true, requires_cbt: false, cbt_exam_id: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (path) => {
        setFormData({ ...path, is_active: !!path.is_active, requires_cbt: !!path.requires_cbt, cbt_exam_id: path.cbt_exam_id || '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const dataToSubmit = { ...formData };
            if (!dataToSubmit.requires_cbt) dataToSubmit.cbt_exam_id = null;
            await dispatch(savePath(dataToSubmit)).unwrap();
            setIsModalOpen(false);
        } catch (error) {
            // Error handled in thunk
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { accessorKey: 'name', header: 'Nama Jalur', cell: info => <span className="font-bold">{info.getValue()}</span> },
        { accessorKey: 'description', header: 'Keterangan', cell: info => info.getValue() || '-' },
        { accessorKey: 'requires_cbt', header: 'Tes CBT', cell: info => info.getValue() ? <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Ya</span> : <span className="px-2 py-1 bg-surface-variant text-on-surface-variant text-xs rounded-full">Tidak</span> },
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
                <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Jalur Pendaftaran</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Kelola data jalur pendaftaran PPDB.</p>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto relative">
                    {loading && !initialized ? (
                        <TableSkeleton />
                    ) : (
                        <DataTable columns={columns} data={paths} searchPlaceholder="Cari jalur..." onAdd={handleAdd} addLabel="Tambah Jalur" />
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title={formData.id ? 'Edit Jalur' : 'Tambah Jalur'}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Jalur</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Keterangan</label>
                        <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" rows="3" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="requires_cbt" checked={formData.requires_cbt} onChange={e => setFormData({...formData, requires_cbt: e.target.checked})} />
                        <label htmlFor="requires_cbt" className="text-sm cursor-pointer">Wajib Tes CBT</label>
                    </div>
                    {formData.requires_cbt && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Pilih Ujian CBT</label>
                            <select 
                                value={formData.cbt_exam_id || ''} 
                                onChange={e => setFormData({...formData, cbt_exam_id: e.target.value})} 
                                className="w-full p-2 border rounded"
                                required={formData.requires_cbt}
                            >
                                <option value="">-- Pilih Ujian --</option>
                                {exams.map(exam => (
                                    <option key={exam.id} value={exam.id}>{exam.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} disabled={submitting} className="px-4 py-2 border rounded">Batal</button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white rounded">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};


export default PathManager;
