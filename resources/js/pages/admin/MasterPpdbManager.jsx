import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchAcademicYears, fetchBatches, fetchPaths, fetchDocumentRequirements,
    saveAcademicYear, saveBatch, savePath, saveDocumentRequirement,
    deleteAcademicYear, deleteBatch, deletePath, deleteDocumentRequirement 
} from '../../store/ppdbMasterSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import toast from 'react-hot-toast';

const MasterPpdbManager = () => {
    const dispatch = useDispatch();
    const { 
        academicYears, batches, paths, documentRequirements, loading, initialized 
    } = useSelector(state => state.ppdbMaster);

    const [activeTab, setActiveTab] = useState('academic_years');

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchAcademicYears());
            dispatch(fetchBatches());
            dispatch(fetchPaths());
            dispatch(fetchDocumentRequirements());
        }
    }, [dispatch, initialized]);

    const tabs = [
        { id: 'academic_years', label: 'Tahun Ajaran' },
        { id: 'batches', label: 'Gelombang' },
        { id: 'paths', label: 'Jalur Pendaftaran' },
        { id: 'docs', label: 'Syarat Dokumen' }
    ];

    const handleDelete = (id, type) => {
        if (!window.confirm('Yakin ingin menghapus data master ini?')) return;
        if (type === 'academic_years') dispatch(deleteAcademicYear(id));
        else if (type === 'batches') dispatch(deleteBatch(id));
        else if (type === 'paths') dispatch(deletePath(id));
        else if (type === 'docs') dispatch(deleteDocumentRequirement(id));
    };

    // --- Columns Definitions ---
    const academicYearCols = [
        { accessorKey: 'name', header: 'Tahun Ajaran' },
        { 
            accessorKey: 'is_active', 
            header: 'Status',
            cell: info => info.getValue() ? <span className="text-primary font-bold">Aktif</span> : 'Nonaktif'
        },
        {
            id: 'actions', header: 'Aksi',
            cell: ({row}) => (
                <div className="flex gap-2">
                    <button onClick={() => toast('Edit Form: ' + row.original.name)} className="text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(row.original.id, 'academic_years')} className="text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
            )
        }
    ];

    const batchCols = [
        { accessorKey: 'name', header: 'Nama Gelombang' },
        { accessorKey: 'academic_year.name', header: 'Tahun Ajaran', cell: info => info.getValue() || '-' },
        { accessorKey: 'start_date', header: 'Tgl Buka' },
        { accessorKey: 'end_date', header: 'Tgl Tutup' },
        { accessorKey: 'quota', header: 'Kuota', cell: info => info.getValue() || 'Tidak Dibatasi' },
        {
            id: 'actions', header: 'Aksi',
            cell: ({row}) => (
                <div className="flex gap-2">
                    <button onClick={() => toast('Edit Form: ' + row.original.name)} className="text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(row.original.id, 'batches')} className="text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
            )
        }
    ];

    const pathCols = [
        { accessorKey: 'name', header: 'Nama Jalur', cell: info => <span className="font-bold">{info.getValue()}</span> },
        { accessorKey: 'description', header: 'Keterangan', cell: info => info.getValue() || '-' },
        {
            id: 'actions', header: 'Aksi',
            cell: ({row}) => (
                <div className="flex gap-2">
                    <button onClick={() => toast('Edit Form: ' + row.original.name)} className="text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(row.original.id, 'paths')} className="text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
            )
        }
    ];

    const docCols = [
        { accessorKey: 'name', header: 'Nama Dokumen', cell: info => <span className="font-bold">{info.getValue()}</span> },
        { 
            accessorKey: 'is_required', 
            header: 'Wajib?',
            cell: info => info.getValue() ? <span className="text-error font-bold">Wajib</span> : 'Opsional'
        },
        { accessorKey: 'description', header: 'Keterangan', cell: info => info.getValue() || '-' },
        {
            id: 'actions', header: 'Aksi',
            cell: ({row}) => (
                <div className="flex gap-2">
                    <button onClick={() => toast('Edit Form: ' + row.original.name)} className="text-primary"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button onClick={() => handleDelete(row.original.id, 'docs')} className="text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
            )
        }
    ];

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="font-headline-lg text-headline-lg text-on-background">Data Master PPDB</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Kelola Tahun Ajaran, Gelombang, Jalur, dan Syarat Dokumen.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-outline-variant mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 font-label-lg whitespace-nowrap transition-colors border-b-2 ${
                            activeTab === tab.id 
                            ? 'border-primary text-primary font-bold' 
                            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="relative min-h-[400px]">
                {loading && !initialized ? (
                    <TableSkeleton />
                ) : (
                    <>
                        {activeTab === 'academic_years' && (
                            <DataTable columns={academicYearCols} data={academicYears} searchPlaceholder="Cari tahun ajaran..." onAdd={() => toast('Form Tambah hadir segera')} addLabel="Tambah Tahun Ajaran" />
                        )}
                        {activeTab === 'batches' && (
                            <DataTable columns={batchCols} data={batches} searchPlaceholder="Cari gelombang..." onAdd={() => toast('Form Tambah hadir segera')} addLabel="Tambah Gelombang" />
                        )}
                        {activeTab === 'paths' && (
                            <DataTable columns={pathCols} data={paths} searchPlaceholder="Cari jalur..." onAdd={() => toast('Form Tambah hadir segera')} addLabel="Tambah Jalur" />
                        )}
                        {activeTab === 'docs' && (
                            <DataTable columns={docCols} data={documentRequirements} searchPlaceholder="Cari syarat dokumen..." onAdd={() => toast('Form Tambah hadir segera')} addLabel="Tambah Dokumen" />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MasterPpdbManager;
