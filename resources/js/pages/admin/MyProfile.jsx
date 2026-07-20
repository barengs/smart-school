import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyProfile = () => {
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [teacherData, setTeacherData] = useState(null);
    const [activeTab, setActiveTab] = useState('biodata');

    const [formData, setFormData] = useState({
        nik: '', kk_number: '', birth_place: '', birth_date: '',
        employment_status: '', nrg: '', base_administration: '',
        certification_subject: '', ukg_score: '', phone: '', address: '', gender: ''
    });

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/my-teacher-profile');
            setTeacherData(res.data);
            setFormData({
                nik: res.data.nik || '',
                kk_number: res.data.kk_number || '',
                birth_place: res.data.birth_place || '',
                birth_date: res.data.birth_date || '',
                employment_status: res.data.employment_status || '',
                nrg: res.data.nrg || '',
                base_administration: res.data.base_administration || '',
                certification_subject: res.data.certification_subject || '',
                ukg_score: res.data.ukg_score || '',
                phone: res.data.phone || '',
                address: res.data.address || '',
                gender: res.data.gender || ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal memuat profil guru');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveBiodata = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.put('/my-teacher-profile', formData);
            toast.success('Biodata berhasil diperbarui');
            fetchProfile();
        } catch (error) {
            toast.error('Gagal menyimpan biodata');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteDoc = async (id) => {
        if(!window.confirm('Hapus dokumen ini?')) return;
        try {
            await axios.delete(`/my-teacher-profile/documents/${id}`);
            toast.success('Dokumen dihapus');
            fetchProfile();
        } catch(e) {
            toast.error('Gagal menghapus dokumen');
        }
    };

    const handleUploadDoc = async (e, type) => {
        const file = e.target.files[0];
        if(!file) return;
        const form = new FormData();
        form.append('type', type);
        form.append('file', file);
        const toastId = toast.loading('Mengunggah...');
        try {
            await axios.post('/my-teacher-profile/documents', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Dokumen berhasil diunggah', { id: toastId });
            fetchProfile();
        } catch (error) {
            toast.error('Gagal mengunggah dokumen', { id: toastId });
        }
    };

    if (loading) return <div className="p-4 text-center">Memuat profil...</div>;
    if (!teacherData) return <div className="p-4 text-center text-error">Profil guru tidak ditemukan. Hubungi administrator.</div>;

    return (
        <div className="max-w-6xl mx-auto w-full">
            <div className="mb-6">
                <h1 className="font-headline-lg text-headline-lg text-on-background">Profil Saya</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Lengkapi informasi portofolio dan dokumen pendukung Anda.</p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="flex border-b border-outline-variant overflow-x-auto">
                    {['biodata', 'pendidikan', 'kepangkatan', 'dokumen'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-label-lg whitespace-nowrap transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="p-stack-lg">
                    {activeTab === 'biodata' && (
                        <form onSubmit={handleSaveBiodata} className="flex flex-col gap-4">
                            <h3 className="font-title-md text-on-background mb-2">Identitas Diri & Kepegawaian</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">NIK</label>
                                    <input type="text" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">No. KK</label>
                                    <input type="text" value={formData.kk_number} onChange={e => setFormData({...formData, kk_number: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Tempat Lahir</label>
                                    <input type="text" value={formData.birth_place} onChange={e => setFormData({...formData, birth_place: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Tanggal Lahir</label>
                                    <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Jenis Kelamin</label>
                                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary">
                                        <option value="">Pilih...</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">No. HP / WhatsApp</label>
                                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Status Kepegawaian</label>
                                    <select value={formData.employment_status} onChange={e => setFormData({...formData, employment_status: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary">
                                        <option value="">Pilih...</option>
                                        <option value="PNS">PNS</option>
                                        <option value="PPPK">PPPK</option>
                                        <option value="Non-ASN">Non-ASN</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">NRG</label>
                                    <input type="text" value={formData.nrg} onChange={e => setFormData({...formData, nrg: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Satminkel</label>
                                    <input type="text" value={formData.base_administration} onChange={e => setFormData({...formData, base_administration: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Bidang Sertifikasi</label>
                                    <input type="text" value={formData.certification_subject} onChange={e => setFormData({...formData, certification_subject: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Skor UKG</label>
                                    <input type="number" step="0.01" value={formData.ukg_score} onChange={e => setFormData({...formData, ukg_score: e.target.value})} className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface focus:border-primary" />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="submit" disabled={submitting} className="px-6 py-2 bg-primary text-on-primary rounded font-label-md hover:bg-primary/90 transition-colors">
                                    Simpan Biodata
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'pendidikan' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-title-md text-on-background">Riwayat Pendidikan Formal</h3>
                            </div>
                            <div className="text-sm text-on-surface-variant mb-4">Fitur tambah riwayat pendidikan sedang dalam pengembangan.</div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-outline-variant text-sm font-label-md text-on-surface-variant">
                                        <th className="py-2">Gelar</th>
                                        <th className="py-2">Institusi</th>
                                        <th className="py-2">Jurusan</th>
                                        <th className="py-2">Tahun Lulus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teacherData.educations?.length > 0 ? teacherData.educations.map(edu => (
                                        <tr key={edu.id} className="border-b border-outline-variant/50 text-sm">
                                            <td className="py-2 font-medium">{edu.degree}</td>
                                            <td className="py-2">{edu.institution}</td>
                                            <td className="py-2">{edu.major}</td>
                                            <td className="py-2">{edu.graduation_year}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="py-4 text-center text-sm text-on-surface-variant">Belum ada data riwayat pendidikan.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'kepangkatan' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-title-md text-on-background">Riwayat Kepangkatan & Golongan</h3>
                            </div>
                            <div className="text-sm text-on-surface-variant mb-4">Fitur tambah kepangkatan sedang dalam pengembangan.</div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-outline-variant text-sm font-label-md text-on-surface-variant">
                                        <th className="py-2">Pangkat/Golongan</th>
                                        <th className="py-2">TMT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teacherData.ranks?.length > 0 ? teacherData.ranks.map(rank => (
                                        <tr key={rank.id} className="border-b border-outline-variant/50 text-sm">
                                            <td className="py-2 font-medium">{rank.rank_group}</td>
                                            <td className="py-2">{rank.tmt}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="2" className="py-4 text-center text-sm text-on-surface-variant">Belum ada data kepangkatan.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'dokumen' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {['KTP', 'KK', 'Ijazah Terakhir', 'Serdik', 'SK Pengangkatan'].map(docType => {
                                const existDoc = teacherData.documents?.find(d => d.type === docType);
                                return (
                                    <div key={docType} className="border border-outline-variant rounded-xl p-4 flex flex-col bg-surface-container-lowest">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">description</span>
                                                <h4 className="font-label-lg text-on-background">{docType}</h4>
                                            </div>
                                            {existDoc && (
                                                <button onClick={() => handleDeleteDoc(existDoc.id)} className="text-error hover:bg-error/10 p-1 rounded transition-colors" title="Hapus Dokumen">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-auto">
                                            {existDoc ? (
                                                <div className="flex items-center justify-between bg-success/10 text-success px-3 py-2 rounded">
                                                    <span className="text-sm font-medium">Terunggah</span>
                                                    <a href={`/storage/${existDoc.file_path}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-medium">Lihat</a>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-outline-variant border-dashed rounded cursor-pointer hover:bg-surface-container-low transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                        <span className="material-symbols-outlined text-on-surface-variant mb-1 text-[20px]">cloud_upload</span>
                                                        <p className="text-xs text-on-surface-variant">Pilih file (PDF/Image)</p>
                                                    </div>
                                                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleUploadDoc(e, docType)} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
