import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const InfoPPDB = () => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/public/ppdb/info')
            .then(res => {
                setInfo(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const activeBatch = info?.batches && info.batches.length > 0 ? info.batches[0] : null;

    return (
        <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                
                <div className="text-center mb-stack-lg max-w-3xl mx-auto">
                    <h1 className="font-display-lg text-[40px] text-on-surface mb-4">
                        Informasi PPDB {info?.name ? info.name : 'Terbaru'}
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">
                        Selamat datang di portal informasi Penerimaan Peserta Didik Baru Academia SIS. Kami mengundang putra-putri terbaik untuk bergabung dan berkembang bersama institusi pendidikan yang mengedepankan karakter dan prestasi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
                    <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl text-center shadow-sm">
                        <div className="w-16 h-16 bg-primary-fixed text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[32px]">assignment</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">1. Persiapan Berkas</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Siapkan scan Akta Kelahiran, Kartu Keluarga, dan pas foto terbaru dalam format digital sebelum mengisi formulir pendaftaran online.</p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl text-center shadow-sm">
                        <div className="w-16 h-16 bg-secondary-fixed text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[32px]">app_registration</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">2. Isi Formulir</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Lengkapi data diri calon siswa dan data orang tua/wali melalui form pendaftaran online secara lengkap dan valid.</p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl text-center shadow-sm">
                        <div className="w-16 h-16 bg-tertiary-fixed text-tertiary-fixed-dim rounded-full flex items-center justify-center mx-auto mb-4 text-[#222a3e]">
                            <span className="material-symbols-outlined text-[32px]">task_alt</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">3. Cetak Bukti</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Setelah sukses mendaftar, cetak bukti pendaftaran dan catat nomor registrasi untuk digunakan pada tahap seleksi selanjutnya.</p>
                    </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-stack-lg border border-outline-variant flex flex-col md:flex-row items-center gap-gutter">
                    <div className="md:w-2/3">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Siap Mendaftar?</h2>
                        {loading ? (
                            <div className="h-4 bg-surface-container-highest rounded w-1/2 animate-pulse mb-6 md:mb-0"></div>
                        ) : activeBatch ? (
                            <p className="font-body-md text-body-md text-on-surface-variant mb-6 md:mb-0">
                                Pendaftaran {activeBatch.name} dibuka hingga {new Date(activeBatch.end_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}. 
                                {activeBatch.quota ? ` Kuota terbatas untuk ${activeBatch.quota} pendaftar.` : ' Kuota sangat terbatas.'} 
                                Segera daftarkan putra/putri Anda hari ini.
                            </p>
                        ) : (
                            <p className="font-body-md text-body-md text-on-surface-variant mb-6 md:mb-0">
                                Saat ini belum ada gelombang pendaftaran yang dibuka. Silakan pantau terus informasi dari kami.
                            </p>
                        )}
                    </div>
                    <div className="md:w-1/3 flex justify-end w-full">
                        {activeBatch ? (
                            <Link to="/form-ppdb" className="w-full md:w-auto text-center font-label-md text-label-md font-bold px-8 py-4 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors shadow-sm">
                                Mulai Pendaftaran Online
                            </Link>
                        ) : (
                            <button disabled className="w-full md:w-auto text-center font-label-md text-label-md font-bold px-8 py-4 bg-surface-container-highest text-on-surface-variant rounded cursor-not-allowed">
                                Pendaftaran Ditutup
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPPDB;
