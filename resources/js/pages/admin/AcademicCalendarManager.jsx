import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAcademicCalendars, addAcademicCalendar, updateAcademicCalendar, deleteAcademicCalendar } from '../../store/academicCalendarSlice';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import idID from 'date-fns/locale/id';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';

const locales = {
  'id': idID,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const messages = {
    allDay: 'Seharian',
    previous: 'Sebelumnya',
    next: 'Selanjutnya',
    today: 'Hari Ini',
    month: 'Bulan',
    week: 'Minggu',
    day: 'Hari',
    agenda: 'Agenda',
    date: 'Tanggal',
    time: 'Waktu',
    event: 'Acara',
    noEventsInRange: 'Tidak ada kegiatan pada rentang waktu ini.',
    showMore: total => `+ Tampilkan lebih (${total})`
};

const AcademicCalendarManager = () => {
    const dispatch = useDispatch();
    const { events, loading } = useSelector((state) => state.academicCalendar);
    
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        type: 'general'
    });

    // Import State
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        dispatch(fetchAcademicCalendars());
    }, [dispatch]);

    const formattedEvents = events.map(event => ({
        ...event,
        start: new Date(event.start_date),
        end: event.end_date ? new Date(event.end_date) : new Date(event.start_date)
    }));

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3b82f6'; // default general (blue)
        if (event.type === 'holiday') backgroundColor = '#ef4444'; // red
        if (event.type === 'exam') backgroundColor = '#eab308'; // yellow
        if (event.type === 'activity') backgroundColor = '#10b981'; // green

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    const handleSelectSlot = ({ start, end }) => {
        const adjustedEnd = new Date(start);
        
        setFormData({
            title: '',
            description: '',
            start_date: format(start, 'yyyy-MM-dd'),
            end_date: format(adjustedEnd, 'yyyy-MM-dd'),
            type: 'general'
        });
        setSelectedEvent(null);
        setModalOpen(true);
    };

    const handleSelectEvent = (event) => {
        setFormData({
            title: event.title,
            description: event.description || '',
            start_date: event.start_date,
            end_date: event.end_date || event.start_date,
            type: event.type
        });
        setSelectedEvent(event);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedEvent) {
                await dispatch(updateAcademicCalendar({ id: selectedEvent.id, ...formData })).unwrap();
                toast.success('Kegiatan berhasil diperbarui');
            } else {
                await dispatch(addAcademicCalendar(formData)).unwrap();
                toast.success('Kegiatan berhasil ditambahkan');
            }
            setModalOpen(false);
        } catch (error) {
            toast.error(error.message || 'Gagal menyimpan kegiatan');
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent) return;
        if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
            try {
                await dispatch(deleteAcademicCalendar(selectedEvent.id)).unwrap();
                toast.success('Kegiatan berhasil dihapus');
                setModalOpen(false);
            } catch (error) {
                toast.error('Gagal menghapus kegiatan');
            }
        }
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (!importFile) {
            toast.error('Pilih file terlebih dahulu');
            return;
        }

        const formData = new FormData();
        formData.append('file', importFile);

        setImporting(true);
        try {
            await axios.post('/admin/academic-calendars/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Data kalender akademik berhasil diimpor');
            setImportModalOpen(false);
            setImportFile(null);
            dispatch(fetchAcademicCalendars());
        } catch (error) {
            toast.error(error.response?.data?.error || 'Gagal mengimpor data');
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Kalender Akademik</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola jadwal ujian, hari libur, dan kegiatan penting sekolah.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setImportModalOpen(true)}
                        className="inline-flex justify-center rounded-md px-4 py-2 border border-primary text-sm font-medium text-primary hover:bg-surface-container-lowest"
                    >
                        Import Excel
                    </button>
                    <button 
                        onClick={() => {
                            setSelectedEvent(null);
                            setFormData({ title: '', description: '', start_date: format(new Date(), 'yyyy-MM-dd'), end_date: format(new Date(), 'yyyy-MM-dd'), type: 'general' });
                            setModalOpen(true);
                        }}
                        className="inline-flex justify-center rounded-md px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary/90"
                    >
                        Tambah Kegiatan
                    </button>
                </div>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant h-[700px]">
                {loading && events.length === 0 ? (
                    <div className="flex justify-center items-center h-full">Memuat kalender...</div>
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={formattedEvents}
                        startAccessor="start"
                        endAccessor="end"
                        culture="id"
                        messages={messages}
                        style={{ height: '100%' }}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventStyleGetter}
                        views={['month', 'week', 'day', 'agenda']}
                    />
                )}
            </div>

            {/* Modal Form */}
            {modalOpen && (
                <div className="fixed z-[100] inset-0 flex items-center justify-center p-4 sm:p-0">
                    <div className="absolute inset-0 bg-gray-900/75 transition-opacity" onClick={() => setModalOpen(false)}></div>
                    <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-xl w-full max-w-lg z-10">
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-bold text-gray-900 border-b pb-2 mb-4">
                                    {selectedEvent ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                                </h3>
                                <div className="space-y-4">
                                    <Input 
                                        label="Nama Kegiatan" 
                                        value={formData.title} 
                                        onChange={e => setFormData({...formData, title: e.target.value})} 
                                        required 
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input 
                                            label="Tanggal Mulai" 
                                            type="date" 
                                            value={formData.start_date} 
                                            onChange={e => setFormData({...formData, start_date: e.target.value})} 
                                            required 
                                        />
                                        <Input 
                                            label="Tanggal Selesai" 
                                            type="date" 
                                            value={formData.end_date} 
                                            onChange={e => setFormData({...formData, end_date: e.target.value})} 
                                        />
                                    </div>
                                    <Select 
                                        label="Jenis Kegiatan" 
                                        value={formData.type} 
                                        onChange={e => setFormData({...formData, type: e.target.value})}
                                        required
                                    >
                                        <option value="general">Umum</option>
                                        <option value="activity">Kegiatan Siswa</option>
                                        <option value="exam">Ujian</option>
                                        <option value="holiday">Hari Libur</option>
                                    </Select>
                                    <Textarea 
                                        label="Deskripsi (Opsional)" 
                                        value={formData.description} 
                                        onChange={e => setFormData({...formData, description: e.target.value})} 
                                        rows={3} 
                                    />
                                </div>
                            </div>
                            <div className="bg-surface-container px-4 py-3 sm:px-6 flex flex-row-reverse justify-between border-t border-outline-variant">
                                <div className="flex gap-2">
                                    <button 
                                        type="button" 
                                        className="inline-flex justify-center rounded-md border border-outline-variant px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-surface-container-lowest"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="inline-flex justify-center rounded-md px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary/90"
                                    >
                                        Simpan
                                    </button>
                                </div>
                                {selectedEvent && (
                                    <button 
                                        type="button" 
                                        className="inline-flex justify-center rounded-md border border-red-500 text-red-500 px-4 py-2 bg-white text-sm font-medium hover:bg-red-50"
                                        onClick={handleDelete}
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {importModalOpen && (
                <div className="fixed z-[100] inset-0 flex items-center justify-center p-4 sm:p-0">
                    <div className="absolute inset-0 bg-gray-900/75 transition-opacity" onClick={() => !importing && setImportModalOpen(false)}></div>
                    <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-xl w-full max-w-md z-10">
                        <form onSubmit={handleImport}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-bold text-gray-900 border-b pb-2 mb-4">
                                    Import Kalender Akademik
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                                        <p className="text-sm text-on-surface-variant mb-2">
                                            Unduh template Excel berikut, isi data sesuai format, lalu unggah kembali ke sini.
                                        </p>
                                        <a href="/api/admin/academic-calendars/template" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                                            <span className="material-symbols-outlined text-[18px] mr-1">download</span>
                                            Download Template.xlsx
                                        </a>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload File Excel (.xlsx, .csv)</label>
                                        <input 
                                            type="file" 
                                            accept=".xlsx, .xls, .csv" 
                                            onChange={(e) => setImportFile(e.target.files[0])}
                                            className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20 border border-outline-variant rounded p-1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-surface-container px-4 py-3 sm:px-6 flex flex-row-reverse gap-2 border-t border-outline-variant">
                                <button 
                                    type="submit" 
                                    disabled={importing || !importFile}
                                    className="inline-flex justify-center rounded-md px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {importing ? 'Mengimpor...' : 'Mulai Import'}
                                </button>
                                <button 
                                    type="button" 
                                    disabled={importing}
                                    className="inline-flex justify-center rounded-md border border-outline-variant px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-surface-container-lowest"
                                    onClick={() => setImportModalOpen(false)}
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicCalendarManager;
