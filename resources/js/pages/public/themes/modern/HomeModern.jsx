import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from '../../../../store/newsSlice';
import axios from 'axios';

const HomeModern = () => {
    const { profile } = useOutletContext();
    const dispatch = useDispatch();
    const { newsList, loading: loadingNewsState, initializedPublic } = useSelector((state) => state.news);
    
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {
        if (!initializedPublic) {
            dispatch(fetchNews());
        }

        // Fetch upcoming events
        axios.get('/public/academic-calendars', { params: { limit: 2 } })
            .then(res => {
                setEvents(res.data || []);
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingEvents(false));
    }, [dispatch, initializedPublic]);

    const heroImage = profile?.hero_image_path ? `/storage/${profile.hero_image_path}` : 'https://lh3.googleusercontent.com/aida/AP1WRLupnXtenOj3_QsQRaP0kbrPOe9Wi1CwsCj3J9-1WLZlSG5PfnYxLQaKbvAzKh-sWBO6C4WwePD9euAvaLbAl2vSUUPIPBVqENjgXeN5AYTzND5FjM-sGuMTAF9hy0BxnnKkdQ9Gbz5MWF4Nl_FJ01RPmYOGNmpv_8llwKH9E7lkjTusko3HX5kdqKytgvbswpXwkx79BoEsubwUmM7_WsjfA-4jRSV0xm6INdGvW1zw0uHUkWjDTfSfpA';
    const heroTitle = profile?.hero_title || 'Membentuk Generasi Cerdas Berkarakter';
    const heroText = profile?.hero_text || 'Pendidikan berkualitas tinggi dengan nilai-nilai luhur Islam untuk mempersiapkan pemimpin masa depan yang berwawasan global.';
    
    const aboutImage = profile?.about_image_path ? `/storage/${profile.about_image_path}` : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlW3sz7IsusXqnlIASNEUVdwI4sU5s27obh1fCC4PWFienJ5cVE_cpg0tzTHQ5PZLsd9y0bWt2Aj4hjF9pkFLfedo3UNWSllI3cAEkfthKkwupHQbO8ms4oqlI1teo1-97rV-lBYTrqntfyZEG8GGgKa7weH92-Zb-47PVuVRZhYojFVnj8Dtlt_NRWUsBXW6nQ5dqYk9g8EzU4bu626gTTo7BC-16ZfLIn7FQGWODamQjsUyNAdadkx85DXjnyxs30OP1IQIVdrU';

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img alt="Main School Campus" className="w-full h-full object-cover" src={heroImage}/>
                    <div className="absolute inset-0 academic-gradient"></div>
                </div>
                
                <div className="relative z-10 w-full px-margin-desktop max-w-container-max mx-auto py-stack-lg">
                    <div className="max-w-2xl text-white">
                        <span className="inline-block px-4 py-1 bg-secondary-container text-on-secondary-container font-label-md rounded-full mb-6">Penerimaan Siswa Baru 2024/2025</span>
                        <h1 className="font-display-lg text-display-lg mb-6 leading-tight">{heroTitle}</h1>
                        <p className="font-body-lg text-body-lg mb-10 text-on-primary-container opacity-90">{heroText}</p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/form-ppdb" className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-full font-headline-md hover:scale-105 transition-transform flex items-center gap-2">
                                Info Pendaftaran
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                            <Link to="/profile" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-headline-md hover:bg-white/20 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined">explore</span>
                                Profil Kami
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Floating Quick Stats */}
                <div className="absolute bottom-12 right-margin-desktop hidden xl:flex gap-6">
                    <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-lg flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-secondary-container">groups</span>
                        </div>
                        <div>
                            <div className="font-headline-md text-primary">1,200+</div>
                            <div className="font-body-sm text-on-surface-variant">Siswa Aktif</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-lg flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">verified</span>
                        </div>
                        <div>
                            <div className="font-headline-md text-primary">A+</div>
                            <div className="font-body-sm text-on-surface-variant">Akreditasi</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid Section */}
            <section className="py-stack-lg bg-surface-container-low">
                <div className="w-full px-margin-desktop max-w-container-max mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                        <Link to="/info-ppdb" className="group bg-white p-8 rounded-2xl border border-outline-variant hover:border-secondary transition-all hover:shadow-xl">
                            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary-container transition-colors">
                                <span className="material-symbols-outlined text-primary text-3xl group-hover:text-on-secondary-container">assignment</span>
                            </div>
                            <h3 className="font-headline-md text-primary mb-3">Info PPDB</h3>
                            <p className="font-body-md text-on-surface-variant mb-6">Panduan lengkap pendaftaran siswa baru, biaya pendidikan, dan persyaratan administrasi.</p>
                            <span className="text-secondary font-label-md flex items-center gap-2 hover:underline">Pelajari Selengkapnya <span className="material-symbols-outlined text-sm">open_in_new</span></span>
                        </Link>
                        
                        <a href="#" className="group bg-white p-8 rounded-2xl border border-outline-variant hover:border-secondary transition-all hover:shadow-xl">
                            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary-container transition-colors">
                                <span className="material-symbols-outlined text-primary text-3xl group-hover:text-on-secondary-container">calendar_today</span>
                            </div>
                            <h3 className="font-headline-md text-primary mb-3">Kalender Akademik</h3>
                            <p className="font-body-md text-on-surface-variant mb-6">Jadwal kegiatan belajar mengajar, ujian, dan hari libur sekolah tahun ajaran berjalan.</p>
                            <span className="text-secondary font-label-md flex items-center gap-2 hover:underline">Lihat Jadwal <span className="material-symbols-outlined text-sm">open_in_new</span></span>
                        </a>
                        
                        <Link to="/profile" className="group bg-white p-8 rounded-2xl border border-outline-variant hover:border-secondary transition-all hover:shadow-xl">
                            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary-container transition-colors">
                                <span className="material-symbols-outlined text-primary text-3xl group-hover:text-on-secondary-container">account_balance</span>
                            </div>
                            <h3 className="font-headline-md text-primary mb-3">Profil Sekolah</h3>
                            <p className="font-body-md text-on-surface-variant mb-6">Visi, misi, sejarah perjalanan, dan prestasi sekolah dalam membangun institusi pendidikan.</p>
                            <span className="text-secondary font-label-md flex items-center gap-2 hover:underline">Kenali Kami <span className="material-symbols-outlined text-sm">open_in_new</span></span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Program Unggulan Section */}
            <section className="py-stack-lg bg-white">
                <div className="w-full px-margin-desktop max-w-container-max mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="font-headline-lg text-primary">Program Unggulan</h2>
                            <p className="font-body-md text-on-surface-variant mt-2">Kurikulum terintegrasi untuk kecemerlangan akademik dan pembentukan karakter.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                        <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant group">
                            <div className="h-56 relative overflow-hidden">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJyNplEe95m4aGQXW6ACWveLjcEQdgRHAq4XHpC2i2697CI8vCsWWW4f4PNFV1Xc11xbg4GnHahWCNlQSPXsZM-r9D0v3vbmTgVviFY6M5rQba7czRDXTUdNpvE-zfkGt9XXoj6d31-8mp5-Xp2-T8Z2GGBHnk-eUB2KfZROLB6oOhlV6O8meBoyJCxsj41BkHeAigI0GM7VjFr5VQaLLm12zBddLIreGcVGihLrC_1_XfRaJ-7WrZlvd81uPyJ0CwJEDjY5n82U0"/>
                                <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-4 py-1 rounded-full font-label-md">Karakter</div>
                            </div>
                            <div className="p-8">
                                <h4 className="font-headline-md text-primary mb-3">Pengembangan Diri</h4>
                                <p className="font-body-md text-on-surface-variant mb-6">Program kepemimpinan dan pengembangan soft-skills dengan panduan profesional berpengalaman.</p>
                                <div className="flex items-center gap-4 text-on-surface-variant text-sm border-t border-outline-variant pt-6">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> Rutin Mingguan</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant group">
                            <div className="h-56 relative overflow-hidden">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida/AP1WRLvFXuyTfxvO8nrnf-GE8zynz71UpuiTJ6PtLytF4yXsnfMqOu89FGDWuGZrMd_BDZCTiXu8kaSSBXrKuJFZPVNxqVd9_MJ_VwffNK_ovdSawUGUmOLhJstAMzWdHabTvAwxN0GF7l_UWsrhy6I_TUwnsCcuGtcg8_P2Rxn8OGfCbWvv8PJAyS-HAY8Z2lLe3ZbytvvMuWUY3xFueleU54z1f4gtHmeumwO9KKy3jnOW7tEFMCc3bJkkeIU"/>
                                <div className="absolute top-4 left-4 bg-primary text-on-primary px-4 py-1 rounded-full font-label-md">Modern Tech</div>
                            </div>
                            <div className="p-8">
                                <h4 className="font-headline-md text-primary mb-3">Sains & Robotik</h4>
                                <p className="font-body-md text-on-surface-variant mb-6">Pengembangan logika dan kreativitas melalui coding, eksperimen sains, dan pembuatan robot.</p>
                                <div className="flex items-center gap-4 text-on-surface-variant text-sm border-t border-outline-variant pt-6">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">science</span> STEM Lab</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bolt</span> Ekskul Pilihan</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant group">
                            <div className="h-56 relative overflow-hidden">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUXZulg-rDTtwJZ5KI_fqdj97fF1kCmZLsjjPmMvm5ZgW27Y4IuXk-PRT5h66Z_3Wd_QYcVIjaE0H98W2VFD6RaGOCJwj04rmRGK_gbfjhn_lalUubxVPEA6L17hF1-3Xw1ElrQbJLU1iPB59Rab0q6b1sHpHCuHX8yULF3HlUHG814wanhUjz5jmwzyZe2Zh1uz_xGkfYIDb6uJOnTNnFX40fq2HV87qhcgQVUSyvpDg8fuBBWw6M-7fPhCGTeDKftsxhKuhrH8g"/>
                                <div className="absolute top-4 left-4 bg-secondary-fixed-dim text-on-secondary-fixed px-4 py-1 rounded-full font-label-md">Global</div>
                            </div>
                            <div className="p-8">
                                <h4 className="font-headline-md text-primary mb-3">Bahasa Internasional</h4>
                                <p className="font-body-md text-on-surface-variant mb-6">Kemampuan komunikasi aktif dalam bahasa asing sebagai bekal kompetisi di tingkat global.</p>
                                <div className="flex items-center gap-4 text-on-surface-variant text-sm border-t border-outline-variant pt-6">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">language</span> Bilingual</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">public</span> Native Speaker</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Events & Video Split Section */}
            <section className="py-stack-lg bg-surface">
                <div className="w-full px-margin-desktop max-w-container-max mx-auto">
                    <div className="flex flex-col lg:flex-row gap-gutter">
                        {/* Agenda Mendatang (Left) */}
                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-8">
                                <h2 className="font-headline-lg text-primary">Agenda Mendatang</h2>
                            </div>
                            <div className="space-y-6">
                                {loadingEvents ? (
                                    Array.from({length: 2}).map((_, i) => (
                                        <div key={i} className="flex gap-6 animate-pulse bg-white border border-outline-variant rounded-xl overflow-hidden">
                                            <div className="w-24 h-24 bg-gray-200 shrink-0"></div>
                                            <div className="flex-1 p-6">
                                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : events.length > 0 ? (
                                    events.map(event => {
                                        const eventDate = new Date(event.start_date);
                                        const day = eventDate.getDate();
                                        const month = eventDate.toLocaleString('id-ID', { month: 'short' });
                                        
                                        return (
                                            <div key={event.id} className="flex items-stretch bg-white border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="w-24 flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container py-4">
                                                    <span className="font-display-lg text-display-lg leading-none">{day}</span>
                                                    <span className="font-label-md uppercase">{month}</span>
                                                </div>
                                                <div className="flex-1 p-6 flex flex-col justify-center">
                                                    <div className="flex items-center gap-3 text-on-surface-variant text-sm mb-2">
                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                        {event.start_date} {event.end_date && event.end_date !== event.start_date ? `- ${event.end_date}` : ''}
                                                    </div>
                                                    <h4 className="font-headline-md text-primary">{event.name}</h4>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10 text-on-surface-variant bg-white rounded-xl border border-dashed border-outline-variant">
                                        Belum ada agenda terdekat.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lihat Sekolah Kami (Right) */}
                        <div className="flex-1 lg:pl-12 mt-12 lg:mt-0">
                            <h2 className="font-headline-lg text-primary mb-8">Tur Virtual</h2>
                            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl group">
                                <img className="w-full h-full object-cover" src={aboutImage} alt="Virtual Tour" />
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                                    <button className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container shadow-2xl hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                    </button>
                                </div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h4 className="font-headline-md drop-shadow-md">Tur Video</h4>
                                    <p className="font-body-sm opacity-90 drop-shadow-md">Jelajahi fasilitas modern dan lingkungan belajar kami.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Feed */}
            <section className="py-stack-lg bg-white">
                <div className="w-full px-margin-desktop max-w-container-max mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-headline-lg text-primary">Berita Terbaru</h2>
                        <p className="font-body-md text-on-surface-variant mt-4">Kabar terkini dari kegiatan akademik, prestasi siswa, dan informasi sekolah.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                        {loadingNewsState ? (
                            Array.from({length: 4}).map((_, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <div className="w-full aspect-[4/3] bg-surface-container rounded-xl animate-pulse"></div>
                                    <div className="h-6 bg-surface-container rounded w-full animate-pulse mt-2"></div>
                                    <div className="h-4 bg-surface-container rounded w-3/4 animate-pulse"></div>
                                </div>
                            ))
                        ) : newsList.length > 0 ? (
                            newsList.slice(0, 4).map((item, index) => (
                                <div key={item.id} className="group">
                                    <Link to={`/news/${item.slug}`} className="block rounded-xl overflow-hidden mb-4 h-48 border border-outline-variant">
                                        {item.cover_image ? (
                                            <img src={`/storage/${item.cover_image}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-on-surface-variant bg-surface-container">
                                                <span className="material-symbols-outlined text-5xl">image</span>
                                            </div>
                                        )}
                                    </Link>
                                    <div className="text-secondary font-label-md mb-2">{item.category?.name || 'Sekolah'}</div>
                                    <Link to={`/news/${item.slug}`}>
                                        <h5 className="font-headline-md text-primary mb-2 line-clamp-2 hover:text-secondary transition-colors">
                                            {item.title}
                                        </h5>
                                    </Link>
                                    <div className="text-on-surface-variant text-sm font-body-sm">
                                        {new Date(item.published_at || item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-4 text-center py-16 text-on-surface-variant bg-surface rounded-2xl border border-dashed border-outline-variant">
                                Belum ada berita yang diterbitkan.
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-12 text-center">
                        <Link to="/news" className="inline-block px-8 py-3 border border-primary text-primary font-label-md rounded-full hover:bg-primary hover:text-white transition-all">
                            Lihat Semua Berita
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeModern;
