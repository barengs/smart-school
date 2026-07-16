import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from '../../components/DataTable';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ModuleManager = () => {
    const [modules, setModules] = useState([]);
    const [allMenus, setAllMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, code: '', name: '', description: '', menu_ids: [] });
    const [submitting, setSubmitting] = useState(false);

    const fetchModules = () => {
        setLoading(true);
        Promise.all([
            axios.get('/modules'),
            axios.get('/menus?type=admin')
        ]).then(([modRes, menuRes]) => {
            setModules(modRes.data);
            setAllMenus(menuRes.data);
        })
        .catch(err => toast.error('Gagal mengambil data modul'))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const handleAdd = () => {
        setFormData({ id: null, code: '', name: '', description: '', menu_ids: [] });
        setIsModalOpen(true);
    };

    const handleEdit = (module) => {
        setFormData({ 
            id: module.id, 
            code: module.code, 
            name: module.name, 
            description: module.description || '',
            menu_ids: module.menus ? module.menus.map(m => m.id) : []
        });
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMenuToggle = (menuId) => {
        setFormData(prev => {
            const current = prev.menu_ids || [];
            if (current.includes(menuId)) return { ...prev, menu_ids: current.filter(id => id !== menuId) };
            return { ...prev, menu_ids: [...current, menuId] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (formData.id) {
                await axios.put(`/modules/${formData.id}`, formData);
                toast.success('Modul diperbarui');
            } else {
                await axios.post('/modules', formData);
                toast.success('Modul ditambahkan');
            }
            setIsModalOpen(false);
            fetchModules();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan modul');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { accessorKey: 'code', header: 'Kode Modul', cell: info => <span className="font-bold">{info.getValue()}</span> },
        { accessorKey: 'name', header: 'Nama Modul' },
        { 
            id: 'menus', 
            header: 'Daftar Menu', 
            cell: ({row}) => {
                const menus = row.original.menus || [];
                if (menus.length === 0) return <span className="text-on-surface-variant text-sm italic">Tidak ada menu</span>;
                return (
                    <div className="flex flex-wrap gap-1 max-w-xs">
                        {menus.map(m => (
                            <span key={m.id} className="px-2 py-0.5 bg-surface-container text-on-surface text-xs rounded border border-outline-variant">
                                {m.label}
                            </span>
                        ))}
                    </div>
                );
            }
        },
        {
            id: 'actions', header: 'Aksi',
            cell: ({row}) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(row.original)} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => {
                        if (window.confirm('Hapus modul ini? Semua pengaturan yang menggunakan kode ini akan kehilangan ikatannya.')) {
                            axios.delete(`/modules/${row.original.id}`)
                                .then(() => { toast.success('Dihapus'); fetchModules(); })
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
                <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Modul (Layanan)</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Kelola daftar modul yang dapat diaktifkan pada sistem.</p>
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
                        data={modules} 
                        searchPlaceholder="Cari modul..." 
                        onAdd={handleAdd} 
                        addLabel="Tambah Modul" 
                    />
                )}
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => !submitting && setIsModalOpen(false)}
                title={formData.id ? 'Edit Modul' : 'Tambah Modul'}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input 
                        label="Kode Modul" 
                        name="code" 
                        value={formData.code} 
                        onChange={handleChange} 
                        required 
                        placeholder="Contoh: PPDB, AKADEMIK"
                        disabled={submitting}
                        helperText="Kode unik tanpa spasi, disarankan huruf kapital."
                    />
                    <Input 
                        label="Nama Modul" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        placeholder="Contoh: Modul PPDB"
                        disabled={submitting}
                    />
                    <Textarea 
                        label="Deskripsi" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        placeholder="Penjelasan singkat modul ini"
                        disabled={submitting}
                        rows={3}
                    />
                    
                    <div className="mt-2">
                        <label className="font-label-md text-label-md text-on-surface block mb-2">Menu dalam Modul Ini</label>
                        <div className="max-h-48 overflow-y-auto border border-outline-variant rounded bg-surface p-3 flex flex-col gap-2">
                            {allMenus.length === 0 ? (
                                <p className="text-sm text-on-surface-variant">Belum ada menu yang terdaftar.</p>
                            ) : allMenus.map(menu => (
                                <label key={menu.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-surface-variant/30 rounded">
                                    <input 
                                        type="checkbox" 
                                        checked={(formData.menu_ids || []).includes(menu.id)}
                                        onChange={() => handleMenuToggle(menu.id)}
                                        className="w-4 h-4 text-primary focus:ring-primary"
                                        disabled={submitting}
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-on-surface">{menu.label}</span>
                                        <span className="text-xs text-on-surface-variant block">{menu.url}</span>
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

export default ModuleManager;
