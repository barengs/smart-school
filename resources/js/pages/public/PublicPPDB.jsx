import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitPPDB, resetPPDBState } from '../../store/ppdbSlice';

const PublicPPDB = () => {
    const [step, setStep] = useState(1);
    const dispatch = useDispatch();
    const { registrationResult, loading, error, success } = useSelector((state) => state.ppdb);

    const [formData, setFormData] = useState({
        full_name: '',
        nisn: '',
        place_of_birth: '',
        date_of_birth: '',
        address: '',
        father_name: '',
        father_occupation: '',
        mother_name: '',
        mother_occupation: '',
        phone_number: '',
    });

    useEffect(() => {
        return () => {
            dispatch(resetPPDBState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (success && step !== 3) {
            setStep(3);
        }
    }, [success, step]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        dispatch(submitPPDB(formData));
    };

    return (
        <div className="bg-surface-container-low min-h-[calc(100vh-80px)] py-stack-lg font-body-md flex flex-col">
            <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop w-full">
                <div className="text-center mb-stack-lg">
                    <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Pendaftaran Peserta Didik Baru</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">Tahun Ajaran 2024/2025</p>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                    <div className="flex border-b border-outline-variant">
                        <div className={`flex-1 text-center py-4 font-label-md text-label-md ${step === 1 ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>
                            1. Data Pribadi
                        </div>
                        <div className={`flex-1 text-center py-4 font-label-md text-label-md ${step === 2 ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>
                            2. Data Orang Tua
                        </div>
                        <div className={`flex-1 text-center py-4 font-label-md text-label-md ${step === 3 ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>
                            3. Selesai
                        </div>
                    </div>

                    <div className="p-stack-lg">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <div className="flex flex-col gap-stack-md">
                                <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">Informasi Calon Siswa</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Nama Lengkap</label>
                                        <input name="full_name" value={formData.full_name} onChange={handleChange} type="text" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Sesuai Akta Kelahiran" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">NISN</label>
                                        <input name="nisn" value={formData.nisn} onChange={handleChange} type="text" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Nomor Induk Siswa Nasional" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Tempat Lahir</label>
                                        <input name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} type="text" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Tanggal Lahir</label>
                                        <input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Alamat Lengkap</label>
                                        <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={() => setStep(2)} className="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded hover:bg-primary-container transition-colors shadow-sm">
                                        Selanjutnya <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col gap-stack-md">
                                <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">Informasi Orang Tua / Wali</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Nama Ayah</label>
                                        <input name="father_name" value={formData.father_name} onChange={handleChange} type="text" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Pekerjaan Ayah</label>
                                        <input name="father_occupation" value={formData.father_occupation} onChange={handleChange} type="text" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Nama Ibu</label>
                                        <input name="mother_name" value={formData.mother_name} onChange={handleChange} type="text" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Pekerjaan Ibu</label>
                                        <input name="mother_occupation" value={formData.mother_occupation} onChange={handleChange} type="text" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Nomor Telepon / WhatsApp Aktif</label>
                                        <input name="phone_number" value={formData.phone_number} onChange={handleChange} type="text" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                    </div>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button onClick={() => setStep(1)} disabled={loading} className="flex items-center gap-2 border border-outline text-on-surface font-label-md text-label-md px-6 py-2 rounded hover:bg-surface-container transition-colors disabled:opacity-50">
                                        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Kembali
                                    </button>
                                    <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 bg-secondary text-on-secondary font-label-md text-label-md px-6 py-2 rounded hover:bg-secondary-fixed-dim transition-colors shadow-sm disabled:opacity-50">
                                        {loading ? 'Memproses...' : 'Kirim Pendaftaran'} <span className="material-symbols-outlined text-[18px]">check</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && success && registrationResult && (
                            <div className="text-center py-stack-lg flex flex-col items-center">
                                <div className="w-20 h-20 bg-primary-fixed text-primary rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-[40px]">check_circle</span>
                                </div>
                                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Pendaftaran Berhasil!</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
                                    Terima kasih telah mendaftar di Academia SIS. Nomor registrasi Anda adalah <span className="font-bold text-primary">{registrationResult.registration_number}</span>. Silakan simpan nomor ini untuk keperluan verifikasi.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button className="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded hover:bg-primary-container transition-colors shadow-sm">
                                        <span className="material-symbols-outlined text-[18px]">download</span> Unduh Bukti
                                    </button>
                                    <Link to="/" className="border border-outline text-on-surface font-label-md text-label-md px-6 py-2 rounded hover:bg-surface-container transition-colors">
                                        Kembali ke Beranda
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicPPDB;
