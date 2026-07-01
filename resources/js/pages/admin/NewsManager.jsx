import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdminNews, deleteNews, approveNews } from '../../store/newsSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';

const NewsManager = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { adminNewsList: news, loading, initialized } = useSelector((state) => state.news);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchAdminNews());
        }
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus berita ini?')) return;
        dispatch(deleteNews(id));
    };
    
    const handleApprove = (id) => {
        if (!window.confirm('Setujui dan publikasi berita ini?')) return;
        dispatch(approveNews(id));
    };

    const handleEdit = (item) => {
        navigate(`/admin/news/edit/${item.id}`);
    };

    const handleAdd = () => {
        navigate('/admin/news/create');
    };

    const handleExportCsv = async () => {
        try {
            const toastId = toast.loading('Memproses export CSV...');
            const response = await axios.get('/news/export', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            const contentDisposition = response.headers['content-disposition'];
            let filename = `Data_Berita_${new Date().toISOString().split('T')[0]}.csv`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.dismiss(toastId);
            toast.success('Berhasil mendownload CSV Berita');
        } catch (error) {
            console.error('Export error:', error);
            toast.dismiss();
            toast.error('Gagal melakukan export CSV');
        }
    };

    const columns = [
        {
            accessorKey: 'title',
            header: 'Judul Berita',
            cell: info => <span className="font-bold">{info.getValue()}</span>
        },
        {
            accessorKey: 'category.name',
            header: 'Kategori',
            cell: info => info.getValue() || '-'
        },
        {
            accessorKey: 'author.name',
            header: 'Penulis',
            cell: info => info.getValue() || 'Admin'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => {
                const status = info.getValue() || 'draft';
                let colorClass = 'bg-surface-variant text-on-surface-variant';
                if (status === 'published') colorClass = 'bg-[#047857]/10 text-[#047857]';
                else if (status === 'pending_approval') colorClass = 'bg-secondary-container/50 text-secondary';
                
                return (
                    <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${colorClass}`}>
                        {status}
                    </span>
                );
            }
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    {row.original.status !== 'published' && (
                        <button onClick={() => handleApprove(row.original.id)} className="text-[#047857] hover:bg-[#047857]/10 p-1 rounded transition-colors" title="Approve">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        </button>
                    )}
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
        <div className="relative w-full">
            <div className="mb-6">
                <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen Berita</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Kelola artikel, berita, dan pengumuman sekolah.</p>
            </div>
            
            {loading && !initialized ? (
                <TableSkeleton />
            ) : (
                <DataTable 
                    columns={columns} 
                    data={news} 
                    searchPlaceholder="Cari judul berita..."
                    onAdd={handleAdd}
                    addLabel="Tulis Berita Baru"
                    onExport={handleExportCsv}
                />
            )}
        </div>
    );
};

export default NewsManager;
