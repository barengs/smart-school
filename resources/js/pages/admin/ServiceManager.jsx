import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from '../../components/DataTable';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ServiceManager = () => {
    const [services, setServices] = useState([]);
    const [allModules, setAllModules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, code: '', name: '', description: '', module_ids: [] });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            axios.get('/services'),
            axios.get('/modules')
        ]).then(([servicesRes, modulesRes]) => {
            setServices(servicesRes.data);
            setAllModules(modulesRes.data);
        }).catch(err => {
            toast.error('Gagal mengambil data layanan');
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setFormData({ id: null, code: '', name: '', description: '', module_ids: [] });
        setIsModalOpen(true);
    };

    const handleEdit = (service) => {
        setFormData({ 
            id: service.id, 
            code: service.code, 
            name: service.name, 
            description: service.description || '',
            module_ids: service.modules ? service.modules.map(m => m.id) : []
        });
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleModuleToggle = (moduleId) => {
        setFormData(prev => {
            const current = prev.module_ids || [];
            if (current.includes(moduleId)) {
                return { ...prev, module_ids: current.filter(id => id !== moduleId) };
            } else {
                return { ...prev, module_ids: [...current, moduleId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (formData.id) {
                await axios.put(`/services/${formData.id}`, formData);
                toast.success('Layanan diperbarui');
            } else {
                await axios.post('/services', formData);
                toast.success('Layanan ditambahkan');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan layanan');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { accessorKey: 'code', header: 'Kode Layanan', cell: info => <span className="font-bold">{info.getValue()}</span> },
        { accessorKey: 'name', header: 'Nama Paket' },
        { accessorKey: 'description', header: 'Deskripsi' },
        { 
            id: 'modules_count', 
            header: 'Modul Tersedia', 
            cell: ({row}) => {
                const count = row.original.modules?.length || 0;
                return <span className="px-2 py-1 bg-primary-container text-on-primary-container text-xs rounded-full">{count} Modul</span>;
            } 
        },
        {
            id: 'actions', header: 'Aksi',
            cell: ({row}) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(row.original)} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => {
                        if (window.confirm('Hapus paket layanan ini? Sekolah yang menggunakannya akan kehilangan akses ke modul-modul di dalamnya.')) {
                            axios.delete(`/services/${row.original.id}`)
                                .then(() => { toast.success('Dihapus'); fetchData(); })
                                .catch(() => toast.error('Gagal hapus'));
                        }
                    }} className="text-error hover:bg-error/10 p-1 rounded transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
            )
        }
    ];

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="font-headline-lg text-headline-lg text-on-background">Paket Layanan</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Kelola daftar paket layanan yang mengelompokkan berbagai modul menjadi satu bundel.</p>
            </div>
            
            <div className="bg-surface rounded-xl shadow-sm border border-outline-variant p-6 min-h-[400px]">
                {loading ? (
                    <div className="animate-pulse flex flex-col gap-4">
                        <div className="h-10 bg-outline-variant/30 rounded w-full"></div>
                        <div className="h-10 bg-outline-variant/30 rounded w-full"></div>
                        <div className="h-10 bg-outline-variant/30 rounded w-full"></div>
                    </div>
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={services} 
                        searchPlaceholder="Cari paket layanan..." 
                        onAdd={handleAdd} 
                        addLabel="Tambah Paket" 
                    />
                )}
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => !submitting && setIsModalOpen(false)}
                title={formData.id ? 'Edit Paket Layanan' : 'Tambah Paket Layanan'}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input 
                        label="Kode Paket" 
                        name="code" 
                        value={formData.code} 
                        onChange={handleChange} 
                        required 
                        placeholder="Contoh: BASIC, PRO"
                        disabled={submitting}
                    />
                    <Input 
                        label="Nama Paket Layanan" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        placeholder="Contoh: Layanan Dasar"
                        disabled={submitting}
                    />
                    <Textarea 
                        label="Deskripsi" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        placeholder="Penjelasan layanan ini"
                        disabled={submitting}
                        rows={2}
                    />
                    
                    <div className="mt-2">
                        <label className="font-label-md text-label-md text-on-surface block mb-2">Modul dalam Paket Ini</label>
                        <div className="max-h-48 overflow-y-auto border border-outline-variant rounded bg-surface p-3 flex flex-col gap-2">
                            {allModules.length === 0 ? (
                                <p className="text-sm text-on-surface-variant">Belum ada modul yang terdaftar di sistem.</p>
                            ) : allModules.map(mod => (
                                <label key={mod.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-surface-variant/30 rounded">
                                    <input 
                                        type="checkbox" 
                                        checked={(formData.module_ids || []).includes(mod.id)}
                                        onChange={() => handleModuleToggle(mod.id)}
                                        className="w-4 h-4 text-primary focus:ring-primary"
                                        disabled={submitting}
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-on-surface">{mod.name}</span>
                                        <span className="text-xs text-on-surface-variant block">{mod.code}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-outline-variant">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            disabled={submitting}
                            className="px-4 py-2 text-on-surface-variant hover:bg-surface-variant/50 rounded transition-colors"
                        >
                            Batal
                        </button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ServiceManager;
