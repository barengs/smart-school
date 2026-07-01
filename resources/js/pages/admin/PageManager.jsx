import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPages, deletePage } from '../../store/pageSlice';
import toast from 'react-hot-toast';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';

const PageManager = () => {
    const dispatch = useDispatch();
    const { items: pages, loading, initialized } = useSelector((state) => state.page);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchPages());
        }
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus halaman ini?')) return;
        dispatch(deletePage(id));
    };

    const columns = [
        {
            accessorKey: 'title',
            header: 'Judul Halaman',
        },
        {
            accessorKey: 'slug',
            header: 'URL Slug',
            cell: info => <span className="text-primary bg-primary/10 px-2 py-1 rounded font-code text-xs">/{info.getValue()}</span>
        },
        {
            accessorKey: 'is_published',
            header: 'Status',
            cell: info => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${info.getValue() ? 'bg-[#047857]/10 text-[#047857]' : 'bg-surface-variant text-on-surface-variant'}`}>
                    {info.getValue() ? 'PUBLISHED' : 'DRAFT'}
                </span>
            )
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
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Halaman Dinamis</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola halaman kustom seperti Profil, Sejarah, dsb.</p>
                </div>
            </div>
            
            <div className="relative">
                {loading && !initialized ? (
                <TableSkeleton />
            ) : (
                <DataTable 
                    columns={columns} 
                    data={pages} 
                    searchPlaceholder="Cari halaman..."
                    onAdd={() => toast('Fitur form penambahan akan segera hadir', { icon: '🚧' })}
                    addLabel="Buat Halaman"
                />
            )}</div>
        </div>
    );
};

export default PageManager;
