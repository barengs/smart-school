import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory } from '../../store/categorySlice';
import toast from 'react-hot-toast';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';

const CategoryManager = () => {
    const dispatch = useDispatch();
    const { items: categories, loading, initialized } = useSelector((state) => state.category);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchCategories());
        }
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;
        dispatch(deleteCategory(id));
    };

    const columns = [
        {
            accessorKey: 'name',
            header: 'Nama Kategori',
            cell: info => <span className="font-bold">{info.getValue()}</span>
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: info => <span className="font-code text-primary text-xs">{info.getValue()}</span>
        },
        {
            accessorKey: 'description',
            header: 'Deskripsi',
            cell: info => <span className="text-on-surface-variant text-sm truncate max-w-xs block">{info.getValue() || '-'}</span>
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button className="text-primary hover:bg-primary/10 p-1 rounded transition-colors" title="Edit">
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
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Kategori Berita</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola master data kategori untuk artikel dan pengumuman.</p>
                </div>
            </div>
            
            <div className="relative">
                {loading && !initialized ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={categories} 
                        searchPlaceholder="Cari kategori..."
                        onAdd={() => toast('Fitur form penambahan akan segera hadir', { icon: '🚧' })}
                        addLabel="Tambah Kategori"
                    />
                )}
            </div>
        </div>
    );
};

export default CategoryManager;
