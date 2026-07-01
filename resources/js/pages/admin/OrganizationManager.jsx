import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganization, deleteOrganization, addOrganization, updateOrganization } from '../../store/organizationSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Tree, TreeNode } from 'react-organizational-chart';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

const OrgNode = ({ node, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="relative inline-block bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary hover:shadow-md transition-all group">
            {/* Floating Menu Toggle */}
            <div className="absolute top-2 right-2 z-20">
                <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
                    className="p-1 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-full transition-colors flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute right-0 mt-1 w-32 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg py-1 z-50 flex flex-col overflow-hidden">
                        <button 
                            onClick={() => { setMenuOpen(false); onEdit(node); }}
                            className="px-4 py-2 text-sm text-left text-on-surface hover:bg-surface-container flex items-center gap-2 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px] text-primary">edit</span>
                            Edit
                        </button>
                        <button 
                            onClick={() => { setMenuOpen(false); onDelete(node.id); }}
                            className="px-4 py-2 text-sm text-left text-error hover:bg-error/10 flex items-center gap-2 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            Hapus
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center min-w-[140px] pt-3 pb-1">
                {/* Circular Photo */}
                {node.image_path ? (
                    <img src={`/storage/${node.image_path}`} alt={node.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 mb-3 shadow-sm" />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-2xl mb-3 shadow-sm border-2 border-primary/20">
                        {node.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <span className="font-bold text-sm text-on-surface whitespace-nowrap px-3">{node.name}</span>
                <span className="text-[10px] bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full mt-2 font-bold uppercase tracking-wider">{node.position}</span>
            </div>
        </div>
    );
};

const OrganizationManager = () => {
    const dispatch = useDispatch();
    const { items: members, loading, initialized } = useSelector((state) => state.organization);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        parent_id: '',
        order_number: 0,
        image: null,
    });

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchOrganization());
        }
    }, [dispatch, initialized]);

    const handleDeleteClick = (id) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = () => {
        if (deleteConfirmId) {
            dispatch(deleteOrganization(deleteConfirmId));
            setDeleteConfirmId(null);
        }
    };

    const handleAdd = () => {
        setEditingNode(null);
        setFormData({
            name: '',
            position: '',
            parent_id: '',
            order_number: 0,
            image: null,
        });
        setIsModalOpen(true);
    };

    const handleEdit = (node) => {
        setEditingNode(node);
        setFormData({
            name: node.name,
            position: node.position || '',
            parent_id: node.parent_id || '',
            order_number: node.order_number || 0,
            image: null,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            parent_id: formData.parent_id === '' ? null : formData.parent_id
        };
        
        if (editingNode) {
            dispatch(updateOrganization({ id: editingNode.id, data: payload })).then((res) => {
                if (!res.error) setIsModalOpen(false);
            });
        } else {
            dispatch(addOrganization(payload)).then((res) => {
                if (!res.error) setIsModalOpen(false);
            });
        }
    };

    const buildTree = (flatList) => {
        const tree = [];
        const mappedArr = {};
        for (let i = 0; i < flatList.length; i++) {
            mappedArr[flatList[i].id] = { ...flatList[i], children: [] };
        }
        for (let id in mappedArr) {
            if (mappedArr.hasOwnProperty(id)) {
                let mappedElem = mappedArr[id];
                if (mappedElem.parent_id && mappedArr[mappedElem.parent_id]) {
                    mappedArr[mappedElem.parent_id].children.push(mappedElem);
                } else {
                    tree.push(mappedElem);
                }
            }
        }
        const sortNodes = (nodes) => {
            nodes.sort((a, b) => a.order_number - b.order_number);
            nodes.forEach(node => sortNodes(node.children));
        };
        sortNodes(tree);
        return tree;
    };

    const handleExport = async () => {
        try {
            const toastId = toast.loading('Memproses export...');
            const response = await axios.get('/organization/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Struktur_Organisasi_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.dismiss(toastId);
            toast.success('Berhasil mendownload Excel');
        } catch (error) {
            toast.dismiss();
            toast.error('Gagal melakukan export');
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get('/organization/template', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Template_Import_Organisasi.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Template berhasil diunduh');
        } catch (error) {
            toast.error('Gagal mengunduh template');
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const toastId = toast.loading('Memproses import...');
            await axios.post('/organization/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.dismiss(toastId);
            toast.success('Data berhasil diimpor');
            dispatch(fetchOrganization());
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.error || 'Gagal mengimpor data');
        }
        // Reset file input
        e.target.value = null;
    };

    const treeData = buildTree(members);

    const renderTreeNodes = (node) => (
        <TreeNode key={node.id} label={<OrgNode node={node} onEdit={handleEdit} onDelete={handleDeleteClick} />}>
            {node.children && node.children.map(child => renderTreeNodes(child))}
        </TreeNode>
    );

    return (
        <div className="w-full">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Struktur Organisasi</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola data staf dan jajaran kepengurusan sekolah.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button onClick={handleDownloadTemplate} variant="outline" className="gap-2">
                        <span className="material-symbols-outlined text-[18px]">description</span>
                        Template
                    </Button>
                    <label className="cursor-pointer inline-flex items-center justify-center rounded px-4 py-2 text-sm font-bold bg-[#047857]/10 text-[#047857] hover:bg-[#047857]/20 transition-colors gap-2">
                        <span className="material-symbols-outlined text-[18px]">upload</span>
                        Import
                        <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
                    </label>
                    <Button onClick={handleExport} variant="outline" className="gap-2 text-[#047857] hover:bg-[#047857]/10 border-[#047857]">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Export
                    </Button>
                    <Button onClick={handleAdd} className="gap-2">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Tambah Personil
                    </Button>
                </div>
            </div>
            
            <div className="relative bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-8 overflow-x-auto min-h-[400px]">
                {loading && !initialized ? (
                    <div className="absolute inset-0 bg-white/80 z-10 p-8">
                        <TableSkeleton />
                    </div>
                ) : null}
                
                {treeData.length === 0 && !loading ? (
                    <div className="text-center py-10 text-on-surface-variant">
                        Belum ada struktur organisasi. Silakan tambah personil pertama (Root).
                    </div>
                ) : (
                    <div className="flex justify-center min-w-max">
                        {treeData.length === 1 ? (
                            <Tree 
                                lineWidth={'2px'} 
                                lineColor={'rgba(0,0,0,0.1)'} 
                                lineBorderRadius={'10px'} 
                                label={<OrgNode node={treeData[0]} onEdit={handleEdit} onDelete={handleDeleteClick} />}
                            >
                                {treeData[0].children.map(child => renderTreeNodes(child))}
                            </Tree>
                        ) : treeData.length > 1 ? (
                            <Tree 
                                lineWidth={'2px'} 
                                lineColor={'rgba(0,0,0,0.1)'} 
                                lineBorderRadius={'10px'} 
                                label={
                                    <div className="inline-block bg-primary/10 border border-primary/20 rounded-xl px-6 py-3 font-bold text-primary">
                                        Dewan Sekolah
                                    </div>
                                }
                            >
                                {treeData.map(root => renderTreeNodes(root))}
                            </Tree>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Modal Form Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-lg flex flex-col">
                        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                            <h2 className="font-headline-sm text-lg font-bold">{editingNode ? 'Edit Personil' : 'Tambah Personil'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-error">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <Input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} label="Nama Lengkap" placeholder="Cth: Dr. Budi Santoso" />
                            <Input type="text" required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} label="Jabatan" placeholder="Cth: Kepala Sekolah" />
                            
                            <Select 
                                value={formData.parent_id} 
                                onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
                                label="Atasan Langsung (Parent)"
                                options={[
                                    { value: '', label: '-- Puncak Hirarki (Tanpa Atasan) --' },
                                    ...members.filter(m => m.id !== editingNode?.id).map(m => ({
                                        value: m.id,
                                        label: `${m.name} (${m.position})`
                                    }))
                                ]}
                            />

                            <div className="flex flex-col gap-1">
                                <label className="font-label-md text-label-md text-on-surface">Foto Personil (Opsional)</label>
                                <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} className="px-3 py-2 border border-outline/30 rounded focus:border-primary focus:ring-1 outline-none text-sm" />
                                {editingNode && editingNode.image_path && (
                                    <span className="text-xs text-on-surface-variant italic mt-1">Abaikan jika tidak ingin mengubah foto saat ini.</span>
                                )}
                            </div>

                            <Input type="number" required min="0" value={formData.order_number} onChange={(e) => setFormData({...formData, order_number: e.target.value})} label="Urutan Tampil (Sort Order)" />

                            <div className="mt-4 flex justify-end gap-2">
                                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline">Batal</Button>
                                <Button type="submit">Simpan Personil</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Khusus */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest w-full max-w-sm rounded-xl shadow-lg flex flex-col overflow-hidden">
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-[32px]">warning</span>
                            </div>
                            <h2 className="font-headline-sm text-lg font-bold mb-2">Hapus Personil?</h2>
                            <p className="text-sm text-on-surface-variant">
                                Tindakan ini tidak dapat dibatalkan. Personil akan dihapus secara permanen dari struktur organisasi.
                            </p>
                        </div>
                        <div className="bg-surface-container-low px-6 py-4 flex justify-end gap-3">
                            <Button onClick={() => setDeleteConfirmId(null)} variant="outline">Batal</Button>
                            <Button onClick={confirmDelete} variant="danger">Ya, Hapus</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationManager;
