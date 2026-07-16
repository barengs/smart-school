import React, { useEffect, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import Modal from '../../components/ui/Modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import Select from 'react-select';

const StaffManager = () => {
    const [staffs, setStaffs] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        nip: '',
        phone: '',
        address: '',
        gender: '',
        position: '',
        roles: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [staffRes, roleRes] = await Promise.all([
                axios.get('/staffs'),
                axios.get('/roles')
            ]);
            setStaffs(staffRes.data);
            setRoles(roleRes.data);
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus data staff ini?')) return;
        try {
            await axios.delete(`/staffs/${id}`);
            toast.success('Data staff dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus data');
        }
    };

    const handleEdit = (staff) => {
        setFormData({
            id: staff.id,
            name: staff.user?.name || '',
            email: staff.user?.email || '',
            password: '',
            nip: staff.nip || '',
            phone: staff.phone || '',
            address: staff.address || '',
            gender: staff.gender || '',
            position: staff.position || '',
            roles: staff.user?.roles?.map(r => r.name) || []
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setFormData({
            id: null,
            name: '',
            email: '',
            password: '',
            nip: '',
            phone: '',
            address: '',
            gender: '',
            position: '',
            roles: []
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await axios.put(`/staffs/${formData.id}`, formData);
                toast.success('Data staff diperbarui');
            } else {
                await axios.post('/staffs', formData);
                toast.success('Data staff ditambahkan');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan data');
        } finally {
            setSubmitting(false);
        }
    };

    const roleOptions = roles.map(r => ({ value: r.name, label: r.name }));

    const columns = [
        {
            accessorKey: 'nip',
            header: 'NIP / ID',
            cell: info => <span className="font-code text-primary text-xs">{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'user.name',
            header: 'Nama Lengkap',
            cell: info => <span className="font-bold">{info.row.original.user?.name || '-'}</span>
        },
        {
            accessorKey: 'position',
            header: 'Jabatan',
            cell: info => info.getValue() || '-'
        },
        {
            accessorKey: 'roles',
            header: 'Hak Akses (Role)',
            cell: info => {
                const userRoles = info.row.original.user?.roles;
                if (!userRoles || userRoles.length === 0) return <span className="text-gray-400 text-xs">Belum ada role</span>;
                return (
                    <div className="flex flex-wrap gap-1">
                        {userRoles.map(r => (
                            <span key={r.id} className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-xs">
                                {r.name}
                            </span>
                        ))}
                    </div>
                );
            }
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
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Staff</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola data staff dan hak akses (role) administrator.</p>
                </div>
            </div>
            
            <div className="relative">
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={staffs} 
                        searchPlaceholder="Cari staff..."
                        onAdd={handleAdd}
                        addLabel="Tambah Staff"
                    />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title={formData.id ? 'Edit Staff' : 'Tambah Staff'}>
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
                    
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Password {formData.id && '(Opsional - Isi jika ingin mengubah)'}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder={formData.id ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
                            className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">NIP / ID Staff</label>
                            <input
                                type="text"
                                value={formData.nip}
                                onChange={(e) => setFormData({...formData, nip: e.target.value})}
                                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">Jabatan</label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => setFormData({...formData, position: e.target.value})}
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
                            Hak Akses (Role)
                        </label>
                        <Select
                            isMulti
                            options={roleOptions}
                            value={roleOptions.filter(option => formData.roles.includes(option.value))}
                            onChange={(selectedOptions) => {
                                setFormData({
                                    ...formData,
                                    roles: selectedOptions ? selectedOptions.map(option => option.value) : []
                                });
                            }}
                            placeholder="Pilih role..."
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

export default StaffManager;
