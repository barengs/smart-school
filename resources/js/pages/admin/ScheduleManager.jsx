import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchSchedules, deleteSchedule } from '../../store/scheduleSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';

const ScheduleManager = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: schedules, loading, initialized } = useSelector((state) => state.schedule);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchSchedules());
        }
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus jadwal ini?')) return;
        dispatch(deleteSchedule(id));
    };

    const columns = [
        {
            accessorKey: 'day',
            header: 'Hari',
            cell: info => <span className="font-bold">{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'lessonHour',
            header: 'Jam Pelajaran',
            cell: info => {
                const lh = info.row.original.lesson_hour;
                if (!lh) return '-';
                const start = lh.start_time?.substring(0,5) || '-';
                const end = lh.end_time?.substring(0,5) || '-';
                return <span>{lh.name} ({start} - {end})</span>;
            }
        },
        {
            accessorKey: 'subject.name',
            header: 'Mata Pelajaran',
            cell: info => <span>{info.row.original.subject?.name || '-'}</span>
        },
        {
            accessorKey: 'classroom.name',
            header: 'Kelas',
            cell: info => <span>{info.row.original.classroom?.name || '-'}</span>
        },
        {
            accessorKey: 'teacher',
            header: 'Guru',
            cell: info => <span>{info.row.original.teacher?.user?.name || `Guru ID ${info.row.original.teacher_id}`}</span>
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/schedules/edit/${row.original.id}`)} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors" title="Edit">
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
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Jadwal Pelajaran</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola daftar jadwal pelajaran.</p>
                </div>
            </div>
            
            <div className="relative">
                {loading && !initialized ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns.filter(c => c.header !== 'Kelas')} 
                        data={[...schedules].sort((a, b) => (a.classroom?.name || '').localeCompare(b.classroom?.name || ''))} 
                        groupBy="classroom.name"
                        searchPlaceholder="Cari jadwal..."
                        onAdd={() => navigate('/admin/schedules/create')}
                        addLabel="Tambah Jadwal"
                    />
                )}
            </div>
        </div>
    );
};

export default ScheduleManager;
