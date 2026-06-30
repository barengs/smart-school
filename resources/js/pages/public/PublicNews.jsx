import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from '../../store/newsSlice';

const PublicNews = () => {
    const dispatch = useDispatch();
    const { newsList, loading, error } = useSelector((state) => state.news);

    useEffect(() => {
        dispatch(fetchNews());
    }, [dispatch]);

    return (
        <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-stack-lg gap-4">
                    <div>
                        <h1 className="font-display-lg text-[40px] text-on-surface mb-2">Portal Berita</h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant">
                            Informasi, kegiatan, dan prestasi terbaru dari Academia SIS.
                        </p>
                    </div>
                    <div className="flex border border-outline-variant bg-surface-container-lowest rounded-md overflow-hidden">
                        <input type="text" placeholder="Cari berita..." className="px-4 py-2 outline-none text-on-surface w-full md:w-64" />
                        <button className="px-4 py-2 bg-surface-container hover:bg-outline-variant transition-colors flex items-center justify-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mb-stack-lg">
                        {newsList.map((news) => (
                            <Link to={`/news/${news.slug}`} key={news.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-200 flex flex-col group shadow-sm">
                                <div className="relative overflow-hidden h-48 border-b border-outline-variant">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={news.title} src={news.cover_image ? `/storage/${news.cover_image}` : '/assets/images/robotic competition.png'} />
                                    <div className="absolute top-4 left-4 bg-primary text-on-primary text-[12px] font-bold px-3 py-1 rounded-full shadow-sm">
                                        {news.category?.name || 'Umum'}
                                    </div>
                                </div>
                                <div className="p-stack-md flex flex-col gap-2 flex-1">
                                    <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-[13px]">
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span> {new Date(news.published_at || news.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                    <h3 className="font-headline-md text-[20px] leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mt-1" dangerouslySetInnerHTML={{ __html: news.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' }}></p>
                                    
                                    <div className="mt-auto pt-4 flex items-center text-primary font-label-md text-[14px]">
                                        Baca Selengkapnya <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {newsList.length === 0 && (
                            <div className="col-span-full text-center text-on-surface-variant py-8">Belum ada berita.</div>
                        )}
                    </div>
                )}

                {/* Pagination (Dummy for now) */}
                {newsList.length > 0 && (
                    <div className="flex justify-center mt-stack-lg">
                        <nav className="flex items-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded bg-primary text-on-primary font-label-md shadow-sm">
                                1
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicNews;
