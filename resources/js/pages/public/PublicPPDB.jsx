import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { submitPPDB, resetPPDBState } from '../../store/ppdbSlice';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const PublicPPDB = () => {
    const [step, setStep] = useState(1);
    const dispatch = useDispatch();
    const { registrationResult, loading: submitLoading, error, success } = useSelector((state) => state.ppdb);
    const [info, setInfo] = useState(null);
    const [infoLoading, setInfoLoading] = useState(true);

    const [formData, setFormData] = useState({
        nik: '',
        full_name: '',
        nisn: '',
        gender: 'L',
        place_of_birth: '',
        date_of_birth: '',
        previous_school: '',
        phone_number: '',
        address: '',
        parent_nik: '',
        father_name: '',
        father_occupation: '',
        mother_name: '',
        mother_occupation: '',
        parent_phone_number: '',
        photo: null,
    });

    useEffect(() => {
        return () => {
            dispatch(resetPPDBState());
        };
    }, [dispatch]);

    useEffect(() => {
        axios.get('/public/ppdb/info')
            .then(res => setInfo(res.data))
            .catch(err => console.error(err))
            .finally(() => setInfoLoading(false));
    }, []);

    // NIK Decode Effect
    useEffect(() => {
        if (formData.nik && formData.nik.length === 16) {
            axios.get(`/public/decode-nik/${formData.nik}`)
                .then(res => {
                    const data = res.data;
                    setFormData(prev => ({
                        ...prev,
                        place_of_birth: data.place_of_birth || prev.place_of_birth,
                        date_of_birth: data.date_of_birth || prev.date_of_birth,
                        gender: data.gender || prev.gender,
                    }));
                })
                .catch(err => {
                    console.error("Failed to decode NIK", err);
                });
        }
    }, [formData.nik]);

    useEffect(() => {
        if (success && step !== 3) {
            setStep(3);
        }
    }, [success, step]);

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = () => {
        dispatch(submitPPDB(formData));
    };

    return (
        <div className="bg-surface-container-low min-h-[calc(100vh-80px)] py-stack-lg font-body-md flex flex-col">
            <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop w-full">
                <div className="text-center mb-stack-lg">
                    <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Pendaftaran Peserta Didik Baru</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">Tahun Ajaran {info?.name ? info.name : 'Terbaru'}</p>
                </div>

                {infoLoading ? (
                    <div className="text-center py-10">Memuat data...</div>
                ) : (!info?.batches || info.batches.length === 0) ? (
                    <Card className="p-stack-lg text-center">
                        <div className="w-16 h-16 bg-surface-container-highest text-on-surface-variant rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[32px]">block</span>
                        </div>
                        <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Pendaftaran Ditutup</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">Mohon maaf, saat ini belum ada gelombang pendaftaran yang dibuka atau masa pendaftaran telah berakhir.</p>
                        <Link to="/" className="mt-4 inline-block font-label-md text-primary hover:underline">Kembali ke Beranda</Link>
                    </Card>
                ) : (
                <Card className="overflow-hidden">
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
                                    <Input required name="nik" value={formData.nik} onChange={handleChange} label="NIK (Siswa)" />
                                    <Input required name="full_name" value={formData.full_name} onChange={handleChange} label="Nama Lengkap" placeholder="Sesuai Akta Kelahiran" />
                                    <Input name="nisn" value={formData.nisn} onChange={handleChange} label="NISN" placeholder="Nomor Induk Siswa Nasional" />
                                    <Select name="gender" value={formData.gender} onChange={handleChange} label="Jenis Kelamin" options={[
                                        { value: 'L', label: 'Laki-Laki' },
                                        { value: 'P', label: 'Perempuan' }
                                    ]} />
                                    <Input name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} label="Tempat Lahir" />
                                    <Input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" label="Tanggal Lahir" />
                                    <Input name="previous_school" value={formData.previous_school} onChange={handleChange} label="Asal Sekolah" />
                                    <Input name="phone_number" value={formData.phone_number} onChange={handleChange} label="Nomor Telepon (Siswa)" />
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="font-label-md text-label-md text-on-surface">Foto Calon Siswa</label>
                                        <p className="text-xs text-on-surface-variant mb-1">Format: JPG/PNG (Max 2MB)</p>
                                        <input type="file" name="photo" accept="image/jpeg,image/png" onChange={handleChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20 text-on-surface" />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Alamat Lengkap</label>
                                        <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full border border-outline bg-surface rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={() => setStep(2)}>
                                        Selanjutnya <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col gap-stack-md">
                                <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">Informasi Orang Tua / Wali</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                                    <div className="md:col-span-2">
                                        <Input required name="parent_nik" value={formData.parent_nik} onChange={handleChange} label="NIK Orang Tua / Wali" />
                                    </div>
                                    <Input name="father_name" value={formData.father_name} onChange={handleChange} label="Nama Ayah" />
                                    <Input name="father_occupation" value={formData.father_occupation} onChange={handleChange} label="Pekerjaan Ayah" />
                                    <Input name="mother_name" value={formData.mother_name} onChange={handleChange} label="Nama Ibu" />
                                    <Input name="mother_occupation" value={formData.mother_occupation} onChange={handleChange} label="Pekerjaan Ibu" />
                                    <div className="md:col-span-2">
                                        <Input required name="parent_phone_number" value={formData.parent_phone_number} onChange={handleChange} label="Nomor Telepon / WhatsApp (Orang Tua)" />
                                    </div>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <Button onClick={() => setStep(1)} disabled={submitLoading} variant="outline" className="gap-2">
                                        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Kembali
                                    </Button>
                                    <Button onClick={handleSubmit} disabled={submitLoading} variant="secondary" className="gap-2">
                                        {submitLoading ? 'Memproses...' : 'Kirim Pendaftaran'} <span className="material-symbols-outlined text-[18px]">check</span>
                                    </Button>
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
                                    <Button className="gap-2">
                                        <span className="material-symbols-outlined text-[18px]">download</span> Unduh Bukti
                                    </Button>
                                    <Button to="/" variant="outline">
                                        Kembali ke Beranda
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
                )}
            </div>
        </div>
    );
};

export default PublicPPDB;
