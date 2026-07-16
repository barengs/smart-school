import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers, deleteTeacher } from '../../store/teacherSlice';
import { fetchSubjects } from '../../store/subjectSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import Modal from '../../components/ui/Modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import Select from 'react-select';

const TeacherManager = () => {
    const dispatch = useDispatch();
    const { items: teachers, loading, initialized } = useSelector((state) => state.teacher);
    const { items: subjects, initialized: subjectsInit } = useSelector((state) => state.subject);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
        nip: '',
        nuptk: '',
        phone: '',
        address: '',
        gender: '',
        subject_ids: []
    });

    useEffect(() => {
        if (!initialized) dispatch(fetchTeachers());
        if (!subjectsInit) dispatch(fetchSubjects());
    }, [dispatch, initialized, subjectsInit]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus data guru ini?')) return;
        dispatch(deleteTeacher(id));
    };

    const handleEdit = (teacher) => {
        setFormData({
            id: teacher.id,
            name: teacher.user?.name || '',
            email: teacher.user?.email || '',
            nip: teacher.nip || '',
            nuptk: teacher.nuptk || '',
            phone: teacher.phone || '',
            address: teacher.address || '',
            gender: teacher.gender || '',
            subject_ids: teacher.subjects?.map(s => s.id) || []
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setFormData({
            id: null,
            name: '',
            email: '',
            nip: '',
            nuptk: '',
            phone: '',
            address: '',
            gender: '',
            subject_ids: []
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await axios.put(`/teachers/${formData.id}`, formData);
                toast.success('Data guru diperbarui');
            } else {
                await axios.post('/teachers', formData);
                toast.success('Data guru ditambahkan');
            }
            setIsModalOpen(false);
            dispatch(fetchTeachers());
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan data');
        } finally {
            setSubmitting(false);
        }
    };

    const subjectOptions = subjects.map(s => ({ value: s.id, label: s.name }));

    const columns = [
        {
            accessorKey: 'nip',
            header: 'NIP / NUPTK',
            cell: info => <span className="font-code text-primary text-xs">{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'user.name',
            header: 'Nama Lengkap',
            cell: info => <span className="font-bold">{info.row.original.user?.name || '-'}</span>
        },
        {
            accessorKey: 'subjects',
            header: 'Mata Pelajaran',
            cell: info => {
                const subs = info.row.original.subjects;
                if (!subs || subs.length === 0) return <span className="text-gray-400 text-xs">Belum ada pemetaan</span>;
                return (
                    <div className="flex flex-wrap gap-1">
                        {subs.map(s => (
                            <span key={s.id} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                                {s.name}
                            </span>
                        ))}
                    </div>
                );
            }
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => (
                <span className={`px-2 py-1 rounded text-xs ${info.getValue() === 'active' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {info.getValue() === 'active' ? 'Aktif' : 'Tidak Aktif'}
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

    return (
        <div className="w-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Data Guru</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola data tenaga pendidik dan pemetaan mata pelajaran.</p>
                </div>
            </div>
            
            <div className="relative">
                {loading && !initialized ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={teachers} 
                        searchPlaceholder="Cari guru..."
                        onAdd={handleAdd}
                        addLabel="Tambah Guru"
                    />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title={formData.id ? 'Edit Guru' : 'Tambah Guru'}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto p-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">Email (Untuk Login)</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    {!formData.id && (
                        <p className="text-xs text-on-surface-variant">Password default untuk login akun baru adalah: <strong>password</strong></p>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">NIP</label>
                            <input
                                type="text"
                                value={formData.nip}
                                onChange={(e) => setFormData({...formData, nip: e.target.value})}
                                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">NUPTK</label>
                            <input
                                type="text"
                                value={formData.nuptk}
                                onChange={(e) => setFormData({...formData, nuptk: e.target.value})}
                                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">Telepon</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">Jenis Kelamin</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                            >
                                <option value="">-- Pilih --</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Alamat</label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                            rows="2"
                        ></textarea>
                    </div>
                    
                    <div className="border-t border-outline-variant pt-4 mt-2">
                        <label className="block text-sm font-medium text-on-surface mb-1">
                            Pemetaan Mata Pelajaran
                        </label>
                        <Select
                            isMulti
                            options={subjectOptions}
                            value={subjectOptions.filter(option => formData.subject_ids.includes(option.value))}
                            onChange={(selectedOptions) => {
                                setFormData({
                                    ...formData,
                                    subject_ids: selectedOptions ? selectedOptions.map(option => option.value) : []
                                });
                            }}
                            placeholder="Pilih mata pelajaran..."
                            classNamePrefix="react-select"
                            className="react-select-container"
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

export default TeacherManager;
