import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenus, saveReorderMenus } from '../../store/menuSlice';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

const MenuManager = () => {
    const dispatch = useDispatch();
    const { frontMenus, adminMenus, loading, initializedFront, initializedAdmin } = useSelector((state) => state.menu);
    
    const [activeTab, setActiveTab] = useState('front');
    
    // Draft State for Reordering
    const [draftMenus, setDraftMenus] = useState([]);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [formData, setFormData] = useState({
        label: '',
        url: '',
        icon: '',
        sort_order: 0,
        type: 'front',
        parent_id: ''
    });

    // Determine current Redux data based on tab
    const currentReduxMenus = activeTab === 'front' ? frontMenus : adminMenus;
    const initialized = activeTab === 'front' ? initializedFront : initializedAdmin;

    useEffect(() => {
        if (activeTab === 'front' && !initializedFront) {
            dispatch(fetchMenus('front'));
        } else if (activeTab === 'admin' && !initializedAdmin) {
            dispatch(fetchMenus('admin'));
        }
    }, [activeTab, initializedFront, initializedAdmin, dispatch]);

    // Sync draftMenus whenever currentReduxMenus changes or tab changes
    useEffect(() => {
        setDraftMenus(JSON.parse(JSON.stringify(currentReduxMenus))); // deep copy
    }, [currentReduxMenus, activeTab]);

    const isDirty = useMemo(() => {
        return JSON.stringify(draftMenus) !== JSON.stringify(currentReduxMenus);
    }, [draftMenus, currentReduxMenus]);

    const handleSaveReorder = () => {
        dispatch(saveReorderMenus({ type: activeTab, menus: draftMenus }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus menu ini? (Sub-menu juga akan terhapus)')) return;
        try {
            await axios.delete(`/menus/${id}`);
            toast.success('Menu berhasil dihapus');
            dispatch(fetchMenus(activeTab));
        } catch (error) {
            toast.error('Gagal menghapus menu');
        }
    };

    const handleAdd = () => {
        setEditingMenu(null);
        setFormData({
            label: '',
            url: '',
            icon: '',
            sort_order: draftMenus.length,
            type: activeTab,
            parent_id: ''
        });
        setIsModalOpen(true);
    };

    const handleEdit = (menu) => {
        setEditingMenu(menu);
        setFormData({
            label: menu.label,
            url: menu.url || '',
            icon: menu.icon || '',
            sort_order: menu.sort_order || 0,
            type: menu.type,
            parent_id: menu.parent_id || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            parent_id: formData.parent_id === '' ? null : formData.parent_id
        };
        try {
            if (editingMenu) {
                await axios.put(`/menus/${editingMenu.id}`, payload);
                toast.success('Menu berhasil diperbarui');
            } else {
                await axios.post('/menus', payload);
                toast.success('Menu berhasil ditambahkan');
            }
            setIsModalOpen(false);
            dispatch(fetchMenus(activeTab));
        } catch (error) {
            toast.error('Gagal menyimpan menu');
        }
    };

    const handleMove = (menu, direction) => {
        // Create a new copy of draft
        const newDraft = [...draftMenus];
        
        // Find siblings
        const siblings = newDraft.filter(m => m.parent_id === menu.parent_id).sort((a, b) => a.sort_order - b.sort_order);
        const index = siblings.findIndex(m => m.id === menu.id);
        
        if (direction === 'up' && index > 0) {
            const prevSibling = siblings[index - 1];
            
            // Swap sort_order
            const tempOrder = menu.sort_order;
            const menuRef = newDraft.find(m => m.id === menu.id);
            const prevRef = newDraft.find(m => m.id === prevSibling.id);
            
            menuRef.sort_order = prevSibling.sort_order;
            prevRef.sort_order = tempOrder;
            
        } else if (direction === 'down' && index < siblings.length - 1) {
            const nextSibling = siblings[index + 1];
            
            // Swap sort_order
            const tempOrder = menu.sort_order;
            const menuRef = newDraft.find(m => m.id === menu.id);
            const nextRef = newDraft.find(m => m.id === nextSibling.id);
            
            menuRef.sort_order = nextSibling.sort_order;
            nextRef.sort_order = tempOrder;
        }
        
        setDraftMenus(newDraft);
    };

    // Build hierarchical tree from draftMenus
    const buildTree = (flatList) => {
        const tree = [];
        const mappedArr = {};
        let arrElem;
        let mappedElem;

        for (let i = 0, len = flatList.length; i < len; i++) {
            arrElem = flatList[i];
            mappedArr[arrElem.id] = { ...arrElem, children: [] };
        }

        for (let id in mappedArr) {
            if (mappedArr.hasOwnProperty(id)) {
                mappedElem = mappedArr[id];
                if (mappedElem.parent_id && mappedArr[mappedElem.parent_id]) {
                    mappedArr[mappedElem.parent_id].children.push(mappedElem);
                } else {
                    tree.push(mappedElem);
                }
            }
        }
        
        const sortNodes = (nodes) => {
            nodes.sort((a, b) => a.sort_order - b.sort_order);
            nodes.forEach(node => sortNodes(node.children));
        };
        sortNodes(tree);

        return tree;
    };

    const treeData = buildTree(draftMenus);
    const rootMenus = draftMenus.filter(m => !m.parent_id).sort((a, b) => a.sort_order - b.sort_order);

    const renderMenuItem = (menu, depth = 0) => {
        return (
            <div key={menu.id} className="flex flex-col">
                <div 
                    className={`flex items-center justify-between py-3 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg mb-2 hover:border-primary/50 hover:shadow-sm transition-all`}
                    style={{ marginLeft: `${depth * 2.5}rem` }}
                >
                    <div className="flex items-center gap-3">
                        {menu.icon && <span className="material-symbols-outlined text-[20px] text-primary">{menu.icon}</span>}
                        <div className="flex flex-col gap-0.5">
                            <span className="font-label-md font-bold text-on-surface">{menu.label}</span>
                            <span className="text-[11px] font-code text-on-surface-variant/70">{menu.url}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="flex items-center mr-4 bg-surface-container-low rounded-full px-1 py-1 shadow-sm border border-outline-variant">
                            <button onClick={() => handleMove(menu, 'up')} className="hover:text-primary hover:bg-black/5 rounded-full p-0.5 flex items-center justify-center transition-colors" title="Pindah ke Atas">
                                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                            </button>
                            <div className="w-px h-3 bg-outline-variant mx-1"></div>
                            <button onClick={() => handleMove(menu, 'down')} className="hover:text-primary hover:bg-black/5 rounded-full p-0.5 flex items-center justify-center transition-colors" title="Pindah ke Bawah">
                                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                            </button>
                        </div>
                        
                        <button onClick={() => handleEdit(menu)} className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors flex items-center justify-center" title="Edit">
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(menu.id)} className="text-error hover:bg-error/10 p-1.5 rounded-full transition-colors flex items-center justify-center" title="Hapus">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                    </div>
                </div>
                {menu.children && menu.children.length > 0 && (
                    <div className="flex flex-col w-full relative">
                        <div className="absolute left-[1.25rem] top-0 bottom-4 w-px bg-outline-variant/50 -z-10"></div>
                        {menu.children.map(child => renderMenuItem(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto w-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Menu</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola tautan navigasi website dan admin panel dengan mudah.</p>
                </div>
                <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('front')}
                        className={`px-4 py-2 text-sm font-label-md rounded-md transition-colors ${activeTab === 'front' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
                    >
                        Menu Depan
                    </button>
                    <button 
                        onClick={() => setActiveTab('admin')}
                        className={`px-4 py-2 text-sm font-label-md rounded-md transition-colors ${activeTab === 'admin' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
                    >
                        Menu Sidebar
                    </button>
                </div>
            </div>
            
            <div className="mb-4 flex items-center gap-4">
                <Button onClick={handleAdd} className="gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tambah Menu Baru
                </Button>
                
                {isDirty && (
                    <Button onClick={handleSaveReorder} variant="secondary" className="gap-2 shadow-sm animate-pulse">
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Simpan Perubahan Urutan
                    </Button>
                )}
            </div>

            {loading && !initialized ? (
                <TableSkeleton />
            ) : (
                <div className="flex flex-col mt-4 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                        </div>
                    )}
                    {treeData.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant">
                            Belum ada menu di kategori ini.
                        </div>
                    ) : (
                        treeData.map(menu => renderMenuItem(menu))
                    )}
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-lg flex flex-col">
                        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                            <h2 className="font-headline-sm text-lg font-bold">{editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-error">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <Input type="text" required value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})} label="Label Menu" placeholder="Contoh: Beranda" />
                            <Input type="text" required value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} label="URL / Path" placeholder="Contoh: / atau /news" className="font-code text-sm" />
                            
                            <Select 
                                value={formData.parent_id} 
                                onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
                                label="Induk Menu (Parent)"
                                options={[
                                    { value: '', label: '-- Menu Utama (Tidak ada induk) --' },
                                    ...rootMenus.filter(m => m.id !== editingMenu?.id).map(m => ({
                                        value: m.id,
                                        label: m.label
                                    }))
                                ]}
                            />

                            <div className="flex gap-4">
                                <div className="flex flex-col gap-1 flex-1">
                                    <Input type="text" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} label="Ikon (Opsional)" placeholder="home" className="font-code text-sm" />
                                    <p className="text-[10px] text-on-surface-variant -mt-1">Gunakan ID Google Material Symbols</p>
                                </div>
                                <div className="w-24">
                                    <Input type="number" required min="0" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: e.target.value})} label="Urutan" />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline">Batal</Button>
                                <Button type="submit">Simpan Menu</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManager;
