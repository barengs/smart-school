import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolProfile } from '../../store/publicSlice';

const SchoolProfile = () => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.public);

    useEffect(() => {
        dispatch(fetchSchoolProfile());
    }, [dispatch]);

    if (loading) {
        return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    const { identity, vision, mission, history } = profile || {};
    const logoUrl = identity?.logo ? `/storage/${identity.logo}` : '/assets/images/islamic school building.png';

    return (
        <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                
                <div className="flex flex-col md:flex-row gap-gutter items-center mb-stack-lg border-b border-outline-variant pb-stack-lg">
                    <div className="w-full md:w-1/2">
                        <img src={logoUrl} alt="School Logo" className="w-full rounded-xl object-cover max-h-[400px] shadow-sm border border-outline-variant" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-stack-md">
                        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Tentang {identity?.school_name || 'Sekolah'}</span>
                        <h1 className="font-display-lg text-[32px] md:text-[40px] leading-tight text-on-surface">Sejarah Singkat</h1>
                        <div className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: history?.content || 'Belum ada sejarah.' }} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-lg">
                    <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-primary text-[32px]">visibility</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">Visi</h2>
                        </div>
                        <p className="font-body-lg text-body-lg text-on-surface-variant italic whitespace-pre-wrap">
                            "{vision?.content || 'Visi belum ditetapkan'}"
                        </p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-primary text-[32px]">track_changes</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">Misi</h2>
                        </div>
                        <div className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant list-disc pl-5" dangerouslySetInnerHTML={{ __html: mission?.content || 'Misi belum ditetapkan' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolProfile;
