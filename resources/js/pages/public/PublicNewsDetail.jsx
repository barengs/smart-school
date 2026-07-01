import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewsDetail, clearCurrentNews, fetchNews } from '../../store/newsSlice';

const PublicNewsDetail = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { currentNews, newsList, loading, error, initializedPublic } = useSelector((state) => state.news);

    useEffect(() => {
        dispatch(fetchNewsDetail(slug));
        if (!initializedPublic) {
            dispatch(fetchNews()); // Fetch popular/recent news for sidebar if not loaded
        }
        return () => {
            dispatch(clearCurrentNews());
        };
    }, [dispatch, slug]);

    if (loading) {
        return (
            <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md animate-pulse">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="mb-stack-md w-48 h-6 bg-surface-container-high rounded-md"></div>
                    <div className="flex flex-col lg:flex-row gap-gutter">
                        <div className="lg:w-2/3">
                            <div className="w-full h-[400px] bg-surface-container-high rounded-xl mb-stack-md"></div>
                            <div className="w-64 h-8 bg-surface-container-high rounded-md mb-4"></div>
                            <div className="w-full h-10 bg-surface-container-high rounded-md mb-4"></div>
                            <div className="w-3/4 h-10 bg-surface-container-high rounded-md mb-stack-md"></div>
                            <div className="w-full h-4 bg-surface-container-high rounded-md mb-2"></div>
                            <div className="w-full h-4 bg-surface-container-high rounded-md mb-2"></div>
                            <div className="w-full h-4 bg-surface-container-high rounded-md mb-2"></div>
                            <div className="w-2/3 h-4 bg-surface-container-high rounded-md"></div>
                        </div>
                        <div className="lg:w-1/3">
                            <div className="w-48 h-8 bg-surface-container-high rounded-md mb-stack-md"></div>
                            <div className="w-full h-24 bg-surface-container-high rounded-lg mb-4"></div>
                            <div className="w-full h-24 bg-surface-container-high rounded-lg mb-4"></div>
                            <div className="w-full h-24 bg-surface-container-high rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !currentNews) {
        return <div className="text-center py-20 text-red-500">{error || 'Berita tidak ditemukan'}</div>;
    }

    const popularNews = newsList.slice(0, 3);

    return (
        <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                <div className="mb-stack-md">
                    <Link to="/news" className="inline-flex items-center text-primary font-label-md hover:underline">
                        <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span> Kembali ke Daftar Berita
                    </Link>
                </div>
                <div className="flex flex-col lg:flex-row gap-gutter">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <img src={currentNews.cover_image ? `/storage/${currentNews.cover_image}` : '/assets/images/robotic competition.png'} alt="News Image" className="w-full rounded-xl object-cover max-h-[400px] mb-stack-md border border-outline-variant shadow-sm" />
                        
                        <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-body-sm text-body-sm mb-4">
                            <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-md text-label-md">{currentNews.category?.name || 'Umum'}</span>
                            <span className="flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">calendar_today</span> {new Date(currentNews.published_at || currentNews.created_at).toLocaleDateString('id-ID')}</span>
                            <span className="flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">person</span> Oleh: {currentNews.author?.name || 'Admin'}</span>
                        </div>

                        <h1 className="font-display-lg text-[32px] md:text-[40px] leading-tight text-on-surface mb-stack-md">
                            {currentNews.title}
                        </h1>

                        <div className="font-body-md text-body-md text-on-surface-variant space-y-6" dangerouslySetInnerHTML={{ __html: currentNews.content }}></div>

                        <div className="flex flex-col md:flex-row justify-between md:items-center py-4 border-y border-outline-variant mt-stack-lg gap-4">
                            <div className="flex flex-wrap gap-2">
                                {currentNews.tags?.map(tag => (
                                    <span key={tag.id} className="bg-surface-container text-on-surface-variant px-3 py-1 rounded font-body-sm text-body-sm">#{tag.name}</span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-label-md text-label-md text-on-surface-variant mr-2">Bagikan:</span>
                                <button className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant hover:bg-outline-variant flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-[18px]">share</span></button>
                                <button className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant hover:bg-outline-variant flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-[18px]">link</span></button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 flex flex-col gap-stack-md">
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center">
                                <span className="material-symbols-outlined text-primary mr-2">trending_up</span> Berita Lainnya
                            </h3>
                            <div className="flex flex-col gap-4">
                                {popularNews.map(news => (
                                    <Link to={`/news/${news.slug}`} key={news.id} className="flex gap-4 group cursor-pointer">
                                        <img src={news.cover_image ? `/storage/${news.cover_image}` : '/assets/images/class sport event.png'} className="w-16 h-16 rounded object-cover border border-outline-variant" />
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary line-clamp-2 transition-colors">{news.title}</h4>
                                            <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">{new Date(news.published_at || news.created_at).toLocaleDateString('id-ID')}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicNewsDetail;
