import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import CreatableSelect from 'react-select/creatable';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

const NewsFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]); // this will hold the master tag list mapped for react-select
    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_id: '',
        tags: [], // this will hold [{value, label}] objects for CreatableSelect
        image_path: null
    });

    const [imagePreview, setImagePreview] = useState(null);

    const fetchDependencies = async () => {
        try {
            const [catsRes, tagsRes] = await Promise.all([
                axios.get('/categories'),
                axios.get('/tags')
            ]);
            setCategories(catsRes.data || []);
            // Map tags for react-select
            const mappedTags = (tagsRes.data || []).map(t => ({
                value: t.id,
                label: t.name
            }));
            setTags(mappedTags);
        } catch (error) {
            toast.error('Gagal mengambil data kategori dan tag.');
        }
    };

    const fetchNews = async () => {
        try {
            const { data } = await axios.get(`/news/${id}`);
            
            // Map existing tags to react-select format
            const mappedExistingTags = (data.tags || []).map(t => ({
                value: t.id,
                label: t.name
            }));

            setFormData({
                title: data.title,
                content: data.content,
                category_id: data.category_id || '',
                tags: mappedExistingTags,
                image_path: null // Do not put existing string into form payload
            });
            if (data.image_path) {
                setImagePreview(`/storage/${data.image_path}`);
            }
        } catch (error) {
            toast.error('Gagal mengambil data berita.');
            navigate('/admin/news');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDependencies();
        if (id) {
            fetchNews();
        }
    }, [id]);

    const handleTagChange = (selectedOptions) => {
        setFormData({ ...formData, tags: selectedOptions || [] });
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setFormData({ ...formData, image_path: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('content', formData.content);
        if (formData.category_id) payload.append('category_id', formData.category_id);
        
        // Transform [{value: 1, label: 'A'}, {value: 'New', label: 'New'}] to [1, 'New']
        const finalTags = formData.tags.map(t => t.value);
        payload.append('tags', JSON.stringify(finalTags));
        
        if (formData.image_path instanceof File) {
            payload.append('image_path', formData.image_path);
        }
        
        try {
            if (id) {
                // Laravel route override for PUT with FormData
                payload.append('_method', 'PUT');
                await axios.post(`/news/${id}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Berita berhasil diperbarui');
            } else {
                await axios.post('/news', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Berita berhasil ditambahkan');
            }
            navigate('/admin/news');
        } catch (error) {
            toast.error('Gagal menyimpan berita');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">
                        {id ? 'Edit Berita' : 'Tulis Berita Baru'}
                    </h1>
                </div>
                <button 
                    onClick={() => navigate('/admin/news')}
                    className="px-4 py-2 border border-outline-variant rounded text-on-surface font-label-md hover:bg-surface-container flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Kembali
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 flex flex-col gap-4 flex-1">
                        <div className="flex flex-col gap-2 shrink-0">
                            <Input 
                                type="text" 
                                required
                                placeholder="Masukkan judul..."
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                label="Judul Berita"
                                className="text-lg font-bold py-3" 
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2 flex-1 min-h-[400px]">
                            <label className="font-label-md text-label-md text-on-surface">Isi Konten</label>
                            <div className="bg-white text-black rounded border border-outline-variant flex-1 flex flex-col [&>.quill]:flex-1 [&>.quill]:flex [&>.quill]:flex-col [&>.quill>.ql-container]:flex-1 [&>.quill>.ql-container]:overflow-y-auto">
                                <ReactQuill 
                                    theme="snow" 
                                    value={formData.content} 
                                    onChange={(val) => setFormData({...formData, content: val})} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Setup */}
                <div className="w-full xl:w-96 flex flex-col shrink-0">
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 flex flex-col gap-8">
                        {/* Publikasi Section */}
                        <div className="flex flex-col gap-3">
                            <h3 className="font-label-lg font-bold border-b border-outline-variant pb-2">Publikasi</h3>
                            <p className="text-sm text-on-surface-variant">
                                Berita akan berstatus <strong>Pending Approval</strong> setelah disimpan.
                            </p>
                            <Button 
                                type="submit" 
                                disabled={saving || !formData.content}
                                className="w-full justify-center gap-2 mt-2"
                            >
                                {saving && <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>}
                                {id ? 'Simpan Perubahan' : 'Terbitkan Berita'}
                            </Button>
                        </div>

                        {/* Kategori Section */}
                        <div className="flex flex-col gap-3">
                            <h3 className="font-label-lg font-bold border-b border-outline-variant pb-2">Kategori</h3>
                            <Select 
                                value={formData.category_id}
                                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                options={[
                                    { value: '', label: '-- Pilih Kategori --' },
                                    ...categories.map(c => ({ value: c.id, label: c.name }))
                                ]}
                            />
                        </div>

                        {/* Thumbnail Section */}
                        <div className="flex flex-col gap-3">
                            <h3 className="font-label-lg font-bold border-b border-outline-variant pb-2">Thumbnail Berita</h3>
                            {imagePreview && (
                                <div className="w-full rounded overflow-hidden border border-outline-variant aspect-video">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                        </div>

                        {/* Tag Section */}
                        <div className="flex flex-col gap-3">
                            <h3 className="font-label-lg font-bold border-b border-outline-variant pb-2">Tag</h3>
                            <p className="text-xs text-on-surface-variant">Ketik lalu tekan Enter untuk membuat tag baru jika belum ada.</p>
                            <CreatableSelect
                                isMulti
                                options={tags}
                                value={formData.tags}
                                onChange={handleTagChange}
                                placeholder="Pilih atau ketik tag..."
                                className="text-sm text-black"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewsFormPage;
