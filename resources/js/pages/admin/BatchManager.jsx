import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBatches, deleteBatch, saveBatch } from '../../store/ppdbMasterSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import axios from 'axios';

const BatchManager = () => {
    const dispatch = useDispatch();
    const { batches, loading, initialized } = useSelector(state => state.ppdbMaster);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null, academic_year_id: '', name: '', start_date: '', end_date: '', quota: '', is_active: true });
    const [academicYears, setAcademicYears] = useState([]);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchBatches());
        }
        axios.get('/academic-years').then(res => {
            setAcademicYears(res.data);
        }).catch(err => console.error(err));
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus data ini?')) return;
        dispatch(deleteBatch(id));
    };

    const handleAdd = () => {
        setFormData({ id: null, academic_year_id: '', name: '', start_date: '', end_date: '', quota: '', is_active: true });
        setIsModalOpen(true);
    };

    const handleEdit = (batch) => {
        setFormData({ ...batch, is_active: !!batch.is_active, quota: batch.quota || '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await dispatch(saveBatch(formData)).unwrap();
            setIsModalOpen(false);
        } catch (error) {
            // Error handled in thunk
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { accessorKey: 'name', header: 'Nama Gelombang' },
        { accessorKey: 'academic_year.name', header: 'Tahun Ajaran', cell: info => info.getValue() || '-' },
        { accessorKey: 'start_date', header: 'Tgl Buka' },
        { accessorKey: 'end_date', header: 'Tgl Tutup' },
        { accessorKey: 'quota', header: 'Kuota', cell: info => info.getValue() || 'Tidak Dibatasi' },
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
                <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Gelombang PPDB</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Kelola data gelombang pendaftaran PPDB.</p>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto relative">
                    {loading && !initialized ? (
                        <TableSkeleton />
                    ) : (
                        <DataTable columns={columns} data={batches} searchPlaceholder="Cari gelombang..." onAdd={handleAdd} addLabel="Tambah Gelombang" />
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title={formData.id ? 'Edit Gelombang' : 'Tambah Gelombang'}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Gelombang</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tahun Ajaran</label>
                        <select value={formData.academic_year_id} onChange={e => setFormData({...formData, academic_year_id: e.target.value})} required className="w-full p-2 border rounded">
                            <option value="">-- Pilih Tahun Ajaran --</option>
                            {academicYears.map(ay => (
                                <option key={ay.id} value={ay.id}>{ay.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tgl Buka</label>
                            <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tgl Tutup</label>
                            <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Kuota (Opsional)</label>
                        <input type="number" value={formData.quota} onChange={e => setFormData({...formData, quota: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                        <label htmlFor="is_active" className="text-sm cursor-pointer">Aktif</label>
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

export default BatchManager;
