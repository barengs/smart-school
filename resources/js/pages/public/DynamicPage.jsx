import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DynamicPage = () => {
    const { slug } = useParams();
    
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/public/pages/${slug}`);
                setPage(response.data);
                setError(null);
            } catch (err) {
                setError('Halaman tidak ditemukan atau belum diterbitkan.');
                setPage(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPage();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md animate-pulse">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="w-64 h-10 bg-surface-container-high rounded-md mb-6"></div>
                    <div className="w-full h-64 bg-surface-container-high rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="bg-surface min-h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="text-center py-20 text-error">
                    <span className="material-symbols-outlined text-[64px] mb-4">error</span>
                    <h2 className="font-headline-md text-headline-md">{error || 'Halaman tidak ditemukan'}</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-primary/5 px-6 py-12 md:px-12 text-center border-b border-outline-variant">
                        <h1 className="font-display-lg text-[32px] md:text-[40px] leading-tight text-on-surface">
                            {page.title}
                        </h1>
                    </div>

                    {/* Content Section */}
                    <div className="px-6 py-8 md:px-12 md:py-12">
                        <div 
                            className="prose prose-slate max-w-none text-on-surface-variant font-body-md leading-relaxed" 
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicPage;
