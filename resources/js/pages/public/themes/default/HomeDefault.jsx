import React, { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from '../../../../store/newsSlice';
import { NewsCardSkeleton } from '../../../../components/NewsCardSkeleton';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import idID from 'date-fns/locale/id';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
    previous: '<',
    next: '>',
    today: 'Hari Ini',
    month: 'Bulan',
    week: 'Minggu',
    day: 'Hari',
    agenda: 'Agenda',
    date: 'Tanggal',
    time: 'Waktu',
    event: 'Acara',
    noEventsInRange: 'Tidak ada kegiatan pada rentang waktu ini.',
    showMore: total => `+${total} lebih`
};

const HomeDefault = () => {
    const dispatch = useDispatch();
    const { newsList, loading, initializedPublic } = useSelector((state) => state.news);
    const { profile } = useOutletContext();
    const [calendarEvents, setCalendarEvents] = React.useState([]);
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [modalOpen, setModalOpen] = React.useState(false);

    useEffect(() => {
        if (!initializedPublic) {
            dispatch(fetchNews());
        }
        axios.get('/public/academic-calendars').then(res => {
            const formatted = res.data.map(event => ({
                ...event,
                start: new Date(event.start_date),
                end: event.end_date ? new Date(event.end_date) : new Date(event.start_date)
            }));
            setCalendarEvents(formatted);
        }).catch(err => console.error(err));
    }, [dispatch, initializedPublic]);

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3b82f6';
        if (event.type === 'holiday') backgroundColor = '#ef4444';
        if (event.type === 'exam') backgroundColor = '#eab308';
        if (event.type === 'activity') backgroundColor = '#10b981';

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block',
                fontSize: '0.75rem',
                padding: '2px 4px'
            }
        };
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };

    const latestNews = newsList.slice(0, 4);
    const schoolName = profile?.name || 'Sekolah Kita';

    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full h-[614px] min-h-[400px] flex items-center justify-center overflow-hidden bg-surface-container-high">
                <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-60" style={{ backgroundImage: `url('${profile?.hero_image_path ? '/storage/' + profile.hero_image_path : '/assets/images/islamic school building.png'}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center gap-stack-md">
                    <h1 className="font-display-lg text-display-lg text-primary-container drop-shadow-md">{profile?.hero_title || 'Membentuk Generasi Cerdas Berkarakter'}</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl bg-surface/80 p-4 rounded backdrop-blur-sm">
                        {profile?.hero_text ? (
                            <span dangerouslySetInnerHTML={{ __html: profile.hero_text.replace(/\n/g, '<br />') }}></span>
                        ) : (
                            `Selamat datang di ${schoolName}. ${profile?.mission || 'Kami berkomitmen untuk menyediakan pendidikan berkualitas tinggi, memadukan inovasi digital dengan nilai-nilai luhur untuk masa depan yang lebih baik.'}`
                        )}
                    </p>
                    <div className="flex gap-4 mt-stack-md">
                        <Link to="/info-ppdb" className="font-label-md text-label-md font-bold px-6 py-3 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors shadow-sm inline-block">Info Pendaftaran</Link>
                        <button className="font-label-md text-label-md font-bold px-6 py-3 border border-primary text-primary bg-surface rounded hover:bg-surface-container transition-colors shadow-sm">Tur Virtual</button>
                    </div>
                </div>
            </section>

            {/* Quick Links Bento Grid */}
            <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    <Link to="/info-ppdb" className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#f9bd22]/20 flex items-center justify-center text-[#b45309] mb-stack-sm">
                            <span className="material-symbols-outlined">how_to_reg</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-primary-container">Info PPDB</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">Informasi lengkap mengenai Penerimaan Peserta Didik Baru Tahun Ajaran 2024/2025. Persyaratan, alur, dan jadwal pendaftaran.</p>
                        <div className="flex items-center text-primary font-label-md text-label-md mt-stack-md">
                            Selengkapnya <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
                        </div>
                    </Link>
                    
                    <a href="#kalender-akademik" className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container mb-stack-sm">
                            <span className="material-symbols-outlined">calendar_month</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-primary-container">Kalender Akademik</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">Jadwal kegiatan belajar mengajar, ujian, hari libur, dan acara penting sekolah sepanjang tahun akademik berjalan.</p>
                        <div className="flex items-center text-primary font-label-md text-label-md mt-stack-md">
                            Lihat Jadwal <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
                        </div>
                    </a>

                    <Link to="/profile" className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-[#1e3a8a] mb-stack-sm">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-primary-container">Profil Sekolah</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">Pelajari sejarah, visi misi, fasilitas unggulan, dan jajaran staf pengajar profesional yang berdedikasi di {schoolName}.</p>
                        <div className="flex items-center text-primary font-label-md text-label-md mt-stack-md">
                            Kenali Kami <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* About Us Snippet */}
            <section className="py-stack-lg bg-surface-container-low border-y border-outline-variant">
                <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-gutter">
                        <div className="w-full md:w-1/2 flex flex-col gap-stack-md min-w-0">
                            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold uppercase tracking-widest text-secondary">Tentang Kami</h2>
                            {profile?.about_text ? (
                                <div className="font-body-md text-body-md text-on-surface-variant quill-content [&_*]:whitespace-normal [&_*]:break-normal" dangerouslySetInnerHTML={{ __html: profile.about_text.replace(/&nbsp;/g, ' ') }}></div>
                            ) : (
                                <>
                                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface whitespace-normal">Institusi Pendidikan Terkemuka dengan Fasilitas Modern</h2>
                                    <p className="font-body-md text-body-md text-on-surface-variant whitespace-normal">Sejak didirikan, {schoolName} terus bertransformasi menjadi pusat keunggulan akademik. Kami percaya bahwa lingkungan belajar yang kondusif, didukung oleh teknologi terkini, adalah kunci untuk mencetak pemimpin masa depan. Kurikulum kami dirancang untuk menantang pemikiran kritis sekaligus menumbuhkan empati sosial.</p>
                                    <ul className="flex flex-col gap-2 mt-stack-sm text-on-surface-variant font-body-sm text-body-sm">
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span> Akreditasi A Berstandar Nasional</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span> Laboratorium Sains & Komputer Lengkap</li>
                                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span> Tenaga Pengajar Tersertifikasi</li>
                                    </ul>
                                </>
                            )}
                            <Link to="/profile" className="mt-stack-md font-label-md text-label-md font-bold px-6 py-2 border border-primary text-primary w-fit rounded hover:bg-primary hover:text-on-primary transition-colors">Baca Sejarah Kami</Link>
                        </div>
                        <div className="w-full md:w-1/2 mt-stack-md md:mt-0">
                            <img className="w-full h-[400px] object-cover rounded-xl shadow-sm border border-outline-variant" src={profile?.about_image_path ? `/storage/${profile.about_image_path}` : "/assets/images/student in laboratory.png"} alt="About Us" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest News Section */}
            <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant">
                <div className="flex justify-between items-end mb-stack-md">
                    <div>
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Berita Terbaru</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">Informasi dan kegiatan terkini dari lingkungan sekolah.</p>
                    </div>
                    <Link to="/news" className="hidden md:flex items-center text-primary font-label-md text-label-md hover:underline">
                        Semua Berita <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                        {[...Array(4)].map((_, i) => <NewsCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                            {latestNews.map((news) => (
                                <Link to={`/news/${news.slug}`} key={news.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:-translate-y-1 transition-transform duration-200 group flex flex-col shadow-sm">
                                    <img src={news.cover_image ? `/storage/${news.cover_image}` : '/assets/images/robotic competition.png'} alt={news.title} className="w-full h-48 object-cover border-b border-outline-variant group-hover:scale-105 transition-transform duration-300" />
                                    <div className="p-stack-md flex flex-col gap-stack-sm h-[200px] bg-surface-container-lowest z-10 relative">
                                        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                                            <span className="material-symbols-outlined text-[16px]">calendar_today</span> 
                                            {new Date(news.published_at || news.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <h3 className="font-headline-md text-[18px] leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3" dangerouslySetInnerHTML={{ __html: news.content.replace(/<[^>]*>?/gm, '') }}></p>
                                    </div>
                                </Link>
                            ))}
                            {latestNews.length === 0 && (
                                <div className="col-span-full text-center text-on-surface-variant py-8">Belum ada berita.</div>
                            )}
                        </div>
                        <Link className="md:hidden mt-stack-md flex justify-center items-center text-primary font-label-md text-label-md hover:underline w-full py-2 border border-outline-variant rounded bg-surface-container-lowest" to="/news">
                            Lihat Semua Berita
                        </Link>
                    </>
                )}
            </section>

            {/* Academic Calendar Widget */}
            <section id="kalender-akademik" className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg scroll-mt-24">
                <div className="flex flex-col mb-stack-md">
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Kalender Akademik</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Jadwal penting {schoolName}.</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-4 h-[500px]">
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        culture="id"
                        messages={messages}
                        style={{ height: '100%' }}
                        eventPropGetter={eventStyleGetter}
                        views={['month']}
                        toolbar={true}
                        onSelectEvent={handleSelectEvent}
                    />
                </div>
            </section>

            {/* Event Detail Modal */}
            {modalOpen && selectedEvent && (
                <div className="fixed z-50 inset-0 flex items-center justify-center p-4 sm:p-0">
                    <div className="absolute inset-0 bg-gray-900/75 transition-opacity" onClick={() => setModalOpen(false)}></div>
                    <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-xl w-full max-w-lg z-10">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex justify-between items-start border-b pb-2 mb-4">
                                <h3 className="text-lg leading-6 font-bold text-gray-900">
                                    Detail Kegiatan
                                </h3>
                                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-semibold text-gray-500">Nama Kegiatan</span>
                                    <p className="text-base text-gray-900">{selectedEvent.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm font-semibold text-gray-500">Tanggal Mulai</span>
                                        <p className="text-base text-gray-900">{new Date(selectedEvent.start_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-gray-500">Tanggal Selesai</span>
                                        <p className="text-base text-gray-900">{selectedEvent.end_date ? new Date(selectedEvent.end_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-gray-500">Jenis</span>
                                    <p className="text-base text-gray-900 capitalize">{selectedEvent.type === 'general' ? 'Umum' : selectedEvent.type === 'holiday' ? 'Hari Libur' : selectedEvent.type === 'exam' ? 'Ujian' : 'Kegiatan Siswa'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-gray-500">Deskripsi</span>
                                    <div className="text-sm text-gray-700 whitespace-pre-wrap mt-1 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant">
                                        {selectedEvent.description || 'Tidak ada deskripsi.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container px-4 py-3 sm:px-6 flex flex-row-reverse border-t border-outline-variant">
                            <button 
                                type="button" 
                                className="inline-flex justify-center rounded-md px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary/90"
                                onClick={() => setModalOpen(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeDefault;
