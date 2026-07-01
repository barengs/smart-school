import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableSkeleton } from '../../components/TableSkeleton';
import { fetchMatrixData, createRole, updateRole, deleteRole } from '../../store/rbacSlice';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const RoleMatrix = () => {
    const dispatch = useDispatch();
    const { roles, menus, matrix, loading, initialized } = useSelector((state) => state.rbac);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [activeRole, setActiveRole] = useState(null);
    const [formName, setFormName] = useState('');
    const [localMatrix, setLocalMatrix] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchMatrixData());
        }
    }, [dispatch, initialized]);

    const handleOpenCreate = () => {
        setModalMode('create');
        setActiveRole(null);
        setFormName('');
        setLocalMatrix({});
        setIsModalOpen(true);
    };

    const handleOpenEdit = (role) => {
        setModalMode('edit');
        setActiveRole(role);
        setFormName(role.name);
        
        // Deep copy the matrix for this role
        const roleMatrix = matrix[role.name] || {};
        const copiedMatrix = {};
        Object.keys(roleMatrix).forEach(menuId => {
            copiedMatrix[menuId] = [...roleMatrix[menuId]];
        });
        setLocalMatrix(copiedMatrix);
        setIsModalOpen(true);
    };

    const handleDelete = async (role) => {
        if (role.name === 'Super Admin') return;
        if (window.confirm(`Yakin ingin menghapus peran ${role.name}?`)) {
            await dispatch(deleteRole(role.id));
        }
    };

    const handleCheckboxChange = (menuId, action) => {
        const currentMenuActions = localMatrix[menuId] || [];
        const newLocalMatrix = { ...localMatrix };
        
        if (currentMenuActions.includes(action)) {
            newLocalMatrix[menuId] = currentMenuActions.filter(a => a !== action);
        } else {
            newLocalMatrix[menuId] = [...currentMenuActions, action];
        }
        setLocalMatrix(newLocalMatrix);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formName.trim()) {
            toast.error("Nama peran harus diisi.");
            return;
        }

        setSaving(true);
        if (modalMode === 'create') {
            await dispatch(createRole({ name: formName.trim(), permissions: localMatrix }));
        } else {
            await dispatch(updateRole({ id: activeRole.id, name: formName.trim(), permissions: localMatrix }));
        }
        setSaving(false);
        setIsModalOpen(false);
    };

    if (loading && !initialized) return <div className="p-6"><TableSkeleton /></div>;

    return (
        <div className="w-full relative">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Peran (Role)</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola peran pengguna dan matriks hak akses sistem.</p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tambah Role Baru
                </Button>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                <table className="w-full text-left text-sm text-on-surface">
                    <thead className="bg-surface-container-low border-b border-outline-variant font-label-md text-on-surface-variant text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Nama Peran</th>
                            <th className="px-6 py-4">Total Hak Akses</th>
                            <th className="px-6 py-4 w-32 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/50">
                        {roles.map(role => {
                            const roleMatrix = matrix[role.name] || {};
                            const totalPermissions = Object.values(roleMatrix).reduce((acc, actions) => acc + actions.length, 0);
                            
                            return (
                                <tr key={role.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                                    <td className="px-6 py-4 font-body-sm text-body-sm font-medium">
                                        {role.name}
                                        {role.name === 'Super Admin' && <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-[10px] rounded uppercase font-bold">Default</span>}
                                    </td>
                                    <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                                        {role.name === 'Super Admin' ? 'Akses Penuh (Semua)' : `${totalPermissions} izin akses`}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button 
                                                onClick={() => handleOpenEdit(role)}
                                                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
                                                title="Edit Role & Matriks"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            {role.name !== 'Super Admin' && (
                                                <button 
                                                    onClick={() => handleDelete(role)}
                                                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-error hover:bg-error hover:text-on-error transition-colors"
                                                    title="Hapus Role"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {roles.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-on-surface-variant">
                                    Tidak ada data peran.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Matrix */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-surface w-full max-w-4xl rounded-xl shadow-lg border border-outline-variant my-8 flex flex-col max-h-full">
                        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
                            <h2 className="font-headline-sm text-headline-sm text-on-background">
                                {modalMode === 'create' ? 'Tambah Role Baru' : `Edit Role: ${activeRole.name}`}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-on-surface-variant hover:text-error transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="mb-6 flex flex-col gap-1">
                                <Input 
                                    type="text"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    disabled={modalMode === 'edit' && activeRole?.name === 'Super Admin'}
                                    placeholder="Contoh: Manajer Operasional"
                                    required
                                    label="Nama Peran"
                                />
                                {modalMode === 'edit' && activeRole?.name === 'Super Admin' && (
                                    <p className="text-xs text-on-surface-variant mt-1">Nama peran Super Admin tidak dapat diubah.</p>
                                )}
                            </div>

                            <h3 className="font-label-lg text-label-lg text-on-surface mb-3 border-b border-outline-variant pb-2">Matriks Hak Akses</h3>
                            {activeRole?.name === 'Super Admin' ? (
                                <div className="p-4 bg-primary/10 text-primary rounded-lg font-body-sm">
                                    Super Admin secara otomatis memiliki semua hak akses di seluruh modul sistem. Mengubah centang di bawah ini tidak akan mengurangi akses aktual Super Admin.
                                </div>
                            ) : (
                                <div className="overflow-x-auto border border-outline-variant rounded-lg">
                                    <table className="w-full text-left text-sm text-on-surface">
                                        <thead className="bg-surface-container-low border-b border-outline-variant font-label-md text-on-surface-variant text-xs uppercase">
                                            <tr>
                                                <th className="px-4 py-3 min-w-[200px]">Modul / Menu</th>
                                                {['view', 'create', 'update', 'delete', 'approve'].map(action => (
                                                    <th key={action} className="px-2 py-3 text-center w-20">{action}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/50">
                                            {menus.map(menu => (
                                                <tr key={menu.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                                                    <td className="px-4 py-3 font-body-sm flex items-center whitespace-nowrap">
                                                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">{menu.icon || 'menu'}</span>
                                                        {menu.label}
                                                    </td>
                                                    {['view', 'create', 'update', 'delete', 'approve'].map(action => (
                                                        <td key={action} className="px-2 py-3 text-center">
                                                            <input 
                                                                type="checkbox" 
                                                                className="w-4 h-4 text-primary rounded border-outline-variant cursor-pointer"
                                                                checked={localMatrix[menu.id]?.includes(action) || false}
                                                                onChange={() => handleCheckboxChange(menu.id, action)}
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            {menus.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-6 text-center text-on-surface-variant">
                                                        Tidak ada data menu.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-3 rounded-b-xl sticky bottom-0 z-10">
                            <Button onClick={() => setIsModalOpen(false)} disabled={saving} variant="outline">
                                Batal
                            </Button>
                            <Button onClick={handleSave} disabled={saving} className="gap-2">
                                {saving ? <span className="material-symbols-outlined text-[18px] animate-spin">sync</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
                                {saving ? 'Menyimpan...' : 'Simpan Peran'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleMatrix;
