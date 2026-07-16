import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchSchedules, deleteSchedule } from '../../store/scheduleSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
            header: <span className="print:hidden">Aksi</span>,
            cell: ({ row }) => (
                <div className="flex gap-2 print:hidden">
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

    const handlePrintPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Jadwal Pelajaran', 14, 22);
        
        const daysOrder = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6, 'Minggu': 7 };

        const grouped = {};
        schedules.forEach(s => {
            const className = s.classroom?.name || 'Tanpa Kelas';
            if (!grouped[className]) grouped[className] = [];
            grouped[className].push(s);
        });

        const classNames = Object.keys(grouped).sort();
        let currentY = 30;

        classNames.forEach((className, index) => {
            if (index > 0 && currentY > 250) {
                doc.addPage();
                currentY = 20;
            } else if (index > 0) {
                currentY += 10;
            }

            doc.setFontSize(12);
            doc.text(`Kelas: ${className}`, 14, currentY);
            currentY += 5;

            const sortedSchedules = grouped[className].sort((a, b) => {
                const dayA = daysOrder[a.day] || 99;
                const dayB = daysOrder[b.day] || 99;
                if (dayA !== dayB) return dayA - dayB;
                const timeA = a.lesson_hour?.start_time || '99:99';
                const timeB = b.lesson_hour?.start_time || '99:99';
                return timeA.localeCompare(timeB);
            });

            const tableData = sortedSchedules.map(s => {
                const start = s.lesson_hour?.start_time?.substring(0,5) || '-';
                const end = s.lesson_hour?.end_time?.substring(0,5) || '-';
                return [
                    s.day || '-',
                    `${s.lesson_hour?.name || '-'} (${start} - ${end})`,
                    s.subject?.name || '-',
                    s.teacher?.user?.name || `Guru ID ${s.teacher_id}`
                ];
            });

            autoTable(doc, {
                startY: currentY,
                head: [['Hari', 'Jam Pelajaran', 'Mata Pelajaran', 'Guru']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [14, 165, 233] },
            });
            currentY = doc.lastAutoTable.finalY || currentY;
        });

        doc.save('Jadwal_Pelajaran.pdf');
    };

    return (
        <div className="w-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Jadwal Pelajaran</h1>
                    <p className="font-body-md text-on-surface-variant mt-1 print:hidden">Kelola daftar jadwal pelajaran.</p>
                </div>
                <button 
                    onClick={handlePrintPDF}
                    className="print:hidden flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg hover:bg-secondary/90 transition-colors"
                >
                    <span className="material-symbols-outlined">print</span>
                    Cetak PDF
                </button>
            </div>
            
            <div className="relative print:m-0 print:p-0">
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
