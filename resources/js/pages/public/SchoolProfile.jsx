import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolProfile } from '../../store/publicSlice';

const SchoolProfile = () => {
    const dispatch = useDispatch();
    const { profile, loading, error, initializedProfile } = useSelector((state) => state.public);

    useEffect(() => {
        if (!initializedProfile) {
            dispatch(fetchSchoolProfile());
        }
    }, [dispatch, initializedProfile]);

    if (loading) {
        return (
            <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md animate-pulse">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="flex flex-col md:flex-row gap-gutter items-center mb-stack-lg border-b border-outline-variant pb-stack-lg">
                        <div className="w-full md:w-1/2">
                            <div className="w-full h-[400px] bg-surface-container-high rounded-xl"></div>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-stack-md">
                            <div className="w-32 h-4 bg-surface-container-high rounded"></div>
                            <div className="w-64 h-10 bg-surface-container-high rounded"></div>
                            <div className="w-full h-4 bg-surface-container-high rounded"></div>
                            <div className="w-full h-4 bg-surface-container-high rounded"></div>
                            <div className="w-2/3 h-4 bg-surface-container-high rounded"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-lg">
                        <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl h-64"></div>
                        <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl h-64"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    const { school_name, name, vision, mission, history, logo_path } = profile || {};
    const logoUrl = logo_path ? `/storage/${logo_path}` : '/assets/images/islamic school building.png';

    return (
        <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                
                <div className="flex flex-col md:flex-row gap-gutter items-center mb-stack-lg border-b border-outline-variant pb-stack-lg">
                    <div className="w-full md:w-1/2">
                        <img src={logoUrl} alt="School Logo" className="w-full rounded-xl object-cover max-h-[400px] shadow-sm border border-outline-variant" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-stack-md">
                        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Tentang {school_name || name || 'Sekolah'}</span>
                        <h1 className="font-display-lg text-[32px] md:text-[40px] leading-tight text-on-surface">Sejarah Singkat</h1>
                        <div className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: history || 'Belum ada sejarah.' }} />
                    </div>
                </div>

                {/* Informasi Umum Section */}
                <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl shadow-sm mb-stack-lg">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-md border-b border-outline-variant pb-2">Informasi Umum</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">Nama Sekolah</span>
                            <span className="font-body-lg text-body-lg text-on-surface font-semibold">{name || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">Status</span>
                            <span className="font-body-lg text-body-lg text-on-surface">{profile?.status || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">NPSN</span>
                            <span className="font-body-lg text-body-lg text-on-surface">{profile?.npsn || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">NSM</span>
                            <span className="font-body-lg text-body-lg text-on-surface">{profile?.nsm || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">Akreditasi</span>
                            <span className="font-body-lg text-body-lg text-on-surface">{profile?.accreditation || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">Telepon</span>
                            <span className="font-body-lg text-body-lg text-on-surface">{profile?.phone || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">Email</span>
                            <span className="font-body-lg text-body-lg text-on-surface">{profile?.email || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">Website</span>
                            <span className="font-body-lg text-body-lg text-on-surface">
                                {profile?.website ? (
                                    <a href={profile.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{profile.website}</a>
                                ) : '-'}
                            </span>
                        </div>
                        <div className="flex flex-col md:col-span-2 mt-2">
                            <span className="font-label-md text-label-md text-on-surface-variant">Alamat Lengkap</span>
                            <span className="font-body-lg text-body-lg text-on-surface">{profile?.address || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-lg">
                    <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-primary text-[32px]">visibility</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">Visi</h2>
                        </div>
                        <p className="font-body-lg text-body-lg text-on-surface-variant italic whitespace-pre-wrap">
                            "{vision || 'Visi belum ditetapkan'}"
                        </p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-primary text-[32px]">track_changes</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">Misi</h2>
                        </div>
                        <div className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant list-disc pl-5 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: mission || 'Misi belum ditetapkan' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolProfile;
