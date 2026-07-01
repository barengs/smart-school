import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTags, deleteTag } from '../../store/tagSlice';
import toast from 'react-hot-toast';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';

const TagManager = () => {
    const dispatch = useDispatch();
    const { items: tags, loading, initialized } = useSelector((state) => state.tag);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchTags());
        }
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus tag ini?')) return;
        dispatch(deleteTag(id));
    };

    const columns = [
        {
            accessorKey: 'name',
            header: 'Nama Tag',
            cell: info => <span className="font-bold bg-surface-variant text-on-surface-variant px-2 py-1 rounded text-xs">#{info.getValue()}</span>
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: info => <span className="font-code text-primary text-xs">{info.getValue()}</span>
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
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Tag Berita</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola master data tag untuk artikel dan pengumuman.</p>
                </div>
            </div>
            
            <div className="relative">
                {loading && !initialized ? (
                <TableSkeleton />
            ) : (
                <DataTable 
                    columns={columns} 
                    data={tags} 
                    searchPlaceholder="Cari tag..."
                    onAdd={() => toast('Fitur form penambahan akan segera hadir', { icon: '🚧' })}
                    addLabel="Tambah Tag"
                />
            )}</div>
        </div>
    );
};

export default TagManager;
