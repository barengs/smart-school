import React from 'react';
import { Link } from 'react-router-dom';

const InfoPPDB = () => {
    return (
        <div className="bg-surface min-h-[calc(100vh-80px)] py-stack-lg font-body-md">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                
                <div className="text-center mb-stack-lg max-w-3xl mx-auto">
                    <h1 className="font-display-lg text-[40px] text-on-surface mb-4">Informasi PPDB 2024/2025</h1>
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
                        <p className="font-body-md text-body-md text-on-surface-variant mb-6 md:mb-0">Pendaftaran gelombang pertama dibuka hingga 30 November 2024. Kuota sangat terbatas, segera daftarkan putra/putri Anda hari ini.</p>
                    </div>
                    <div className="md:w-1/3 flex justify-end w-full">
                        <Link to="/form-ppdb" className="w-full md:w-auto text-center font-label-md text-label-md font-bold px-8 py-4 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors shadow-sm">
                            Mulai Pendaftaran Online
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPPDB;
