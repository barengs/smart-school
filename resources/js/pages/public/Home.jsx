import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from '../../store/newsSlice';

const Home = () => {
    const dispatch = useDispatch();
    const { newsList, loading } = useSelector((state) => state.news);

    useEffect(() => {
        dispatch(fetchNews());
    }, [dispatch]);

    const latestNews = newsList.slice(0, 4);

    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full h-[614px] min-h-[400px] flex items-center justify-center overflow-hidden bg-surface-container-high">
                <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-60" style={{ backgroundImage: "url('/assets/images/islamic school building.png')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center gap-stack-md">
                    <h1 className="font-display-lg text-display-lg text-primary-container drop-shadow-md">Membentuk Generasi Cerdas Berkarakter</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl bg-surface/80 p-4 rounded backdrop-blur-sm">Selamat datang di Academia SIS. Kami berkomitmen untuk menyediakan pendidikan berkualitas tinggi, memadukan inovasi digital dengan nilai-nilai luhur untuk masa depan yang lebih baik.</p>
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
                    
                    <a href="#" className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
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
                        <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">Pelajari sejarah, visi misi, fasilitas unggulan, dan jajaran staf pengajar profesional yang berdedikasi di Academia SIS.</p>
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
                        <div className="w-full md:w-1/2 flex flex-col gap-stack-md">
                            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Tentang Kami</span>
                            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Institusi Pendidikan Terkemuka dengan Fasilitas Modern</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">Sejak didirikan, Academia SIS terus bertransformasi menjadi pusat keunggulan akademik. Kami percaya bahwa lingkungan belajar yang kondusif, didukung oleh teknologi terkini, adalah kunci untuk mencetak pemimpin masa depan. Kurikulum kami dirancang untuk menantang pemikiran kritis sekaligus menumbuhkan empati sosial.</p>
                            <ul className="flex flex-col gap-2 mt-stack-sm text-on-surface-variant font-body-sm text-body-sm">
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span> Akreditasi A Berstandar Nasional</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span> Laboratorium Sains & Komputer Lengkap</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[20px]">check_circle</span> Tenaga Pengajar Tersertifikasi</li>
                            </ul>
                            <Link to="/profile" className="mt-stack-md font-label-md text-label-md font-bold px-6 py-2 border border-primary text-primary w-fit rounded hover:bg-primary hover:text-on-primary transition-colors">Baca Sejarah Kami</Link>
                        </div>
                        <div className="w-full md:w-1/2 mt-stack-md md:mt-0">
                            <img className="w-full h-[400px] object-cover rounded-xl shadow-sm border border-outline-variant" src="/assets/images/student in laboratory.png" alt="Students in laboratory" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest News Section */}
            <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg">
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
                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div></div>
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
        </>
    );
};

export default Home;
