import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, saveProfile } from '../../store/profileSlice';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const ProfileManager = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { data: profileData, loading, initialized } = useSelector((state) => state.profile);
    
    // Local state for the form so user can edit before saving
    const [profile, setProfile] = useState({
        name: '',
        npsn: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        accreditation: '',
        nsm: '',
        status: 'Negeri',
        vision: '',
        mission: '',
        history: '',
        hero_title: '',
        hero_text: '',
        hero_image: null,
        about_text: '',
        about_image: null,
        logo: null,
        favicon: null,
        public_theme: 'default',
        service_id: ''
    });
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [availableServices, setAvailableServices] = useState([]);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchProfile());
        }
        // Fetch all available services
        axios.get('/services').then(res => setAvailableServices(res.data)).catch(console.error);
    }, [dispatch, initialized]);

    // Sync local state when Redux data changes
    useEffect(() => {
        setProfile(prev => ({ ...prev, ...profileData }));
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleQuillChange = (name, value) => {
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setProfile(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await dispatch(saveProfile(profile));
        setSaving(false);
    };

    if (loading && !initialized) return <div className="max-w-4xl mx-auto w-full"><TableSkeleton /></div>;

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Profil Sekolah</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola informasi dasar, visi misi, dan sejarah instansi.</p>
                </div>
            </div>

            <div className="flex border-b border-outline-variant mb-6 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-3 font-label-lg text-label-lg whitespace-nowrap transition-colors border-b-2 ${activeTab === 'general' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                >
                    Informasi Umum
                </button>
                <button
                    onClick={() => setActiveTab('about')}
                    className={`px-6 py-3 font-label-lg text-label-lg whitespace-nowrap transition-colors border-b-2 ${activeTab === 'about' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                >
                    Beranda & Tentang Kami
                </button>
                <button
                    onClick={() => setActiveTab('vision')}
                    className={`px-6 py-3 font-label-lg text-label-lg whitespace-nowrap transition-colors border-b-2 ${activeTab === 'vision' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                >
                    Visi, Misi & Sejarah
                </button>
                {user?.permissions?.includes('manage-system') && (
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`px-6 py-3 font-label-lg text-label-lg whitespace-nowrap transition-colors border-b-2 ${activeTab === 'services' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                    >
                        Layanan & Modul
                    </button>
                )}
            </div>

            <div className="relative">
                {loading && initialized && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                    </div>
                )}
                
                <Card className="p-stack-lg relative">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-lg">
                        
                        {/* TAB 1: UMUM */}
                        <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface">Logo Sekolah</label>
                                    <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-lg bg-surface">
                                        <div className="shrink-0 w-20 h-20 bg-surface-container-highest rounded border border-outline-variant flex items-center justify-center overflow-hidden">
                                            {profile.logo_path ? (
                                                <img src={`/storage/${profile.logo_path}`} alt="Logo" className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">image</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-on-surface-variant mb-2">Upload logo resolusi tinggi (PNG/JPG).</p>
                                            <input type="file" name="logo" accept="image/*" onChange={handleFileChange} className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface">Favicon</label>
                                    <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-lg bg-surface">
                                        <div className="shrink-0 w-20 h-20 bg-surface-container-highest rounded border border-outline-variant flex items-center justify-center overflow-hidden">
                                            {profile.favicon_path ? (
                                                <img src={`/storage/${profile.favicon_path}`} alt="Favicon" className="w-8 h-8 object-contain" />
                                            ) : (
                                                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">public</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-on-surface-variant mb-2">Ikon tab browser (.ico atau .png).</p>
                                            <input type="file" name="favicon" accept="image/png,image/x-icon,image/ico" onChange={handleFileChange} className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2 border-t border-outline-variant my-2"></div>
                                <div className="md:col-span-2 flex flex-col gap-1">
                                    <label className="font-label-md text-label-md text-on-surface font-bold text-primary">Tema Publik (Layout Utama)</label>
                                    <p className="text-xs text-on-surface-variant mb-1">Pilih desain layout untuk halaman publik website Anda.</p>
                                    <select 
                                        name="public_theme" 
                                        value={profile.public_theme || 'default'} 
                                        onChange={handleChange}
                                        className="px-4 py-2 bg-surface border border-outline-variant rounded-md text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow w-full md:w-1/2"
                                    >
                                        <option value="default">Default (Standar)</option>
                                        <option value="modern">Modern (Referensi)</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 border-t border-outline-variant my-2"></div>

                                <Input name="name" value={profile.name || ''} onChange={handleChange} required label="Nama Sekolah" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="npsn" value={profile.npsn || ''} onChange={handleChange} required label="NPSN" />
                                    <Input name="nsm" value={profile.nsm || ''} onChange={handleChange} label="NSM (Opsional)" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-label-md text-label-md text-on-surface">Status</label>
                                        <select 
                                            name="status" 
                                            value={profile.status || 'Negeri'} 
                                            onChange={handleChange}
                                            className="px-4 py-2 bg-surface border border-outline-variant rounded-md text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                        >
                                            <option value="Negeri">Negeri</option>
                                            <option value="Swasta">Swasta</option>
                                        </select>
                                    </div>
                                    <Input name="accreditation" value={profile.accreditation || ''} onChange={handleChange} label="Akreditasi (Cth: A)" />
                                </div>
                                <Input type="email" name="email" value={profile.email || ''} onChange={handleChange} required label="Email" />
                                <Input name="phone" value={profile.phone || ''} onChange={handleChange} required label="Telepon" />
                                <Input type="url" name="website" value={profile.website || ''} onChange={handleChange} label="Website Utama" />
                                <div className="md:col-span-2">
                                    <Textarea name="address" value={profile.address || ''} onChange={handleChange} required rows="2" label="Alamat Lengkap" />
                                </div>
                            </div>
                        </div>

                        {/* TAB 2: ABOUT */}
                        <div className={activeTab === 'about' ? 'block' : 'hidden'}>
                            <div className="grid grid-cols-1 gap-gutter mb-6">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface">Tampilan Beranda (Hero)</h3>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface">Gambar Latar (Hero Image)</label>
                                    <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-lg bg-surface">
                                        <div className="shrink-0 w-32 h-20 bg-surface-container-highest rounded border border-outline-variant flex items-center justify-center overflow-hidden relative">
                                            {profile.hero_image_path ? (
                                                <img src={`/storage/${profile.hero_image_path}`} alt="Hero" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">image</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-on-surface-variant mb-2">Upload gambar untuk latar belakang (rekomendasi: 1920x1080, JPG/PNG).</p>
                                            <input type="file" name="hero_image" accept="image/*" onChange={handleFileChange} className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20" />
                                        </div>
                                    </div>
                                </div>
                                <Input name="hero_title" value={profile.hero_title || ''} onChange={handleChange} label="Judul Utama (Hero Title)" placeholder="Membentuk Generasi Cerdas Berkarakter" />
                                <Textarea name="hero_text" value={profile.hero_text || ''} onChange={handleChange} rows="3" label="Teks Penjelasan (Hero Text)" placeholder="Selamat datang di institusi kami..." />
                            </div>

                            <hr className="border-outline-variant mb-6" />

                            <div className="grid grid-cols-1 gap-gutter">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface">Tentang Kami</h3>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface">Gambar Tentang Kami</label>
                                    <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-lg bg-surface">
                                        <div className="shrink-0 w-32 h-24 bg-surface-container-highest rounded border border-outline-variant flex items-center justify-center overflow-hidden relative">
                                            {profile.about_image_path ? (
                                                <img src={`/storage/${profile.about_image_path}`} alt="About" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">image</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-on-surface-variant mb-2">Upload gambar representasi sekolah.</p>
                                            <input type="file" name="about_image" accept="image/*" onChange={handleFileChange} className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <label className="font-label-md text-label-md text-on-surface">Teks Tentang Kami</label>
                                    <div className="bg-white rounded-md">
                                        <ReactQuill theme="snow" modules={modules} value={profile.about_text || ''} onChange={(val) => handleQuillChange('about_text', val)} className="h-48 mb-12" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TAB 3: VISION & HISTORY */}
                        <div className={activeTab === 'vision' ? 'block' : 'hidden'}>
                            <div className="grid grid-cols-1 gap-gutter">
                                <Textarea name="vision" value={profile.vision || ''} onChange={handleChange} rows="3" label="Visi" />
                                <Textarea name="mission" value={profile.mission || ''} onChange={handleChange} rows="4" label="Misi" />
                                <div className="flex flex-col gap-1 mt-4">
                                    <label className="font-label-md text-label-md text-on-surface">Sejarah Singkat</label>
                                    <div className="bg-white rounded-md">
                                        <ReactQuill theme="snow" modules={modules} value={profile.history || ''} onChange={(val) => handleQuillChange('history', val)} className="h-64 mb-12" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TAB 4: SERVICES */}
                        {user?.permissions?.includes('manage-system') && (
                            <div className={activeTab === 'services' ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 gap-gutter">
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Paket Layanan</h3>
                                    <p className="font-body-sm text-on-surface-variant mb-4">Pilih paket layanan yang menentukan modul apa saja yang dapat diakses oleh sekolah ini.</p>
                                    
                                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                                        <label className="font-label-md text-label-md text-on-surface font-bold">Pilih Paket Layanan</label>
                                        <select
                                            name="service_id"
                                            value={profile.service_id || ''}
                                            onChange={handleChange}
                                            className="px-4 py-2 bg-surface border border-outline-variant rounded-md text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow w-full"
                                        >
                                            <option value="">-- Layanan Dasar (Modul Dasar Saja) --</option>
                                            {(Array.isArray(availableServices) ? availableServices : []).map(svc => (
                                                <option key={svc.id} value={svc.id}>
                                                    {svc.name} ({svc.modules?.length || 0} Modul)
                                                </option>
                                            ))}
                                        </select>
                                        
                                        {profile.service_id && (
                                            <div className="mt-4 p-4 border border-outline-variant rounded bg-surface-container-highest">
                                                <h4 className="font-label-md text-label-md font-bold mb-2">Modul yang Termasuk:</h4>
                                                <ul className="list-disc list-inside text-sm text-on-surface-variant flex flex-col gap-1">
                                                    {(Array.isArray(availableServices) ? availableServices : []).find(s => s.id == profile.service_id)?.modules?.map(m => (
                                                        <li key={m.id}>{m.name} ({m.code})</li>
                                                    )) || <li>Belum ada modul di paket ini.</li>}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 mt-6 border-t border-outline-variant">
                            <Button type="submit" disabled={saving} className="gap-2">
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ProfileManager;
