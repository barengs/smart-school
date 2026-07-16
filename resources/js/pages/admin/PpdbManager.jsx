import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPpdbAdmin, updateStatusPpdb, savePpdbAdmin, updatePpdbAdmin } from '../../store/ppdbSlice';
import { fetchBatches, fetchPaths, fetchDocumentRequirements } from '../../store/ppdbMasterSlice';
import { fetchAcademicYears } from '../../store/academicMasterSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const initialForm = {
    nik: '',
    full_name: '',
    nisn: '',
    place_of_birth: '',
    date_of_birth: '',
    gender: 'L',
    address: '',
    parent_nik: '',
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_occupation: '',
    phone_number: '',
    parent_phone_number: '',
    previous_school: '',
    academic_year_id: '',
    ppdb_batch_id: '',
    ppdb_path_id: '',
    status: 'pending',
    documents: {},
    photo: null
};

const PpdbManager = () => {
    const dispatch = useDispatch();
    const { items: ppdb, adminLoading: loading, adminInitialized: initialized } = useSelector((state) => state.ppdb);
    const { batches, paths, documentRequirements } = useSelector((state) => state.ppdbMaster || { batches: [], paths: [], documentRequirements: [] });
    const { academicYears } = useSelector((state) => state.academicMaster || { academicYears: [] });
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [detailTab, setDetailTab] = useState(1);

    useEffect(() => {
        if (!initialized) dispatch(fetchPpdbAdmin());
        dispatch(fetchBatches());
        dispatch(fetchPaths());
        dispatch(fetchAcademicYears());
        dispatch(fetchDocumentRequirements());
    }, [dispatch, initialized]);

    useEffect(() => {
        if (isFormOpen && academicYears?.length > 0 && !formData.academic_year_id) {
            const activeYear = academicYears.find(y => y.is_active) || academicYears[0];
            if (activeYear) {
                setFormData(prev => ({ ...prev, academic_year_id: activeYear.id }));
            }
        }
    }, [isFormOpen, academicYears, formData.academic_year_id]);

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

    const handleVerify = (id, status) => {
        if (!window.confirm(`Yakin ingin mengubah status menjadi ${status}?`)) return;
        dispatch(updateStatusPpdb({ id, status })).then((res) => {
            if (!res.error) toast.success(`Status berhasil diubah menjadi ${status}`);
        });
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleFileChange = (e, reqId) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [reqId]: file
            }
        }));
    };

    const handleEdit = (e, row) => {
        e.stopPropagation();
        setEditId(row.id);
        setFormData({
            nik: row.nik || '',
            full_name: row.full_name || '',
            nisn: row.nisn || '',
            place_of_birth: row.place_of_birth || '',
            date_of_birth: row.date_of_birth || '',
            gender: row.gender || 'L',
            address: row.address || '',
            parent_nik: row.parent_nik || '',
            father_name: row.father_name || '',
            father_occupation: row.father_occupation || '',
            mother_name: row.mother_name || '',
            mother_occupation: row.mother_occupation || '',
            phone_number: row.phone_number || '',
            parent_phone_number: row.parent_phone || '',
            previous_school: row.previous_school || '',
            academic_year_id: row.academic_year_id || '',
            ppdb_batch_id: row.ppdb_batch_id || '',
            ppdb_path_id: row.ppdb_path_id || '',
            status: row.status || 'pending',
            documents: {},
            photo: null
        });
        setStep(1);
        setIsFormOpen(true);
    };

    const handleSubmit = (e, keepOpen = false) => {
        e?.preventDefault();
        const action = editId ? updatePpdbAdmin({ id: editId, formData }) : savePpdbAdmin(formData);
        
        dispatch(action).then(res => {
            if (!res.error) {
                toast.success(editId ? 'Data pendaftar berhasil diperbarui' : 'Pendaftar baru berhasil ditambahkan');
                if (keepOpen && !editId) {
                    setFormData(prev => ({
                        ...initialForm,
                        academic_year_id: prev.academic_year_id,
                        ppdb_batch_id: prev.ppdb_batch_id,
                        ppdb_path_id: prev.ppdb_path_id,
                        status: prev.status
                    }));
                    setStep(1);
                } else {
                    setIsFormOpen(false);
                    setStep(1);
                    setFormData(initialForm);
                    setEditId(null);
                }
            }
        });
    };

    const handleExportExcel = async () => {
        try {
            const toastId = toast.loading('Memproses export data...');
            const response = await axios.get('/ppdb/export', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Extract filename from content-disposition header if available, otherwise use default
            const contentDisposition = response.headers['content-disposition'];
            let filename = `Data_PPDB_${new Date().toISOString().split('T')[0]}.xlsx`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.dismiss(toastId);
            toast.success('Berhasil mendownload Excel');
        } catch (error) {
            console.error('Export error:', error);
            toast.dismiss();
            toast.error('Gagal melakukan export Excel');
        }
    };

    const columns = [
        {
            accessorKey: 'registration_number',
            header: 'No. Daftar',
            cell: info => <span className="font-code font-bold text-primary text-xs">{info.getValue()}</span>
        },
        {
            accessorKey: 'full_name',
            header: 'Nama Lengkap',
        },
        {
            accessorKey: 'previous_school',
            header: 'Asal Sekolah',
            cell: info => <span className="text-on-surface-variant text-sm">{info.getValue()}</span>
        },
        {
            id: 'batch',
            accessorFn: row => row.batch?.name || '-',
            header: 'Gelombang',
            cell: info => <span className="text-sm font-medium text-secondary-fixed">{info.getValue()}</span>
        },
        {
            id: 'path',
            accessorFn: row => row.path?.name || '-',
            header: 'Jalur',
            cell: info => <span className="text-sm font-medium">{info.getValue()}</span>
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => {
                const status = info.getValue();
                let colorClass = 'bg-surface-variant text-on-surface-variant';
                if (status === 'verified' || status === 'accepted' || status === 'Diterima' || status === 'Verified') colorClass = 'bg-[#047857]/10 text-[#047857]';
                else if (status === 'rejected' || status === 'Ditolak' || status === 'Rejected') colorClass = 'bg-error-container text-on-error-container';
                else if (status === 'pending' || status === 'Proses' || status === 'Pending') colorClass = 'bg-secondary-container/50 text-secondary';
                
                return (
                    <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${colorClass}`}>
                        {status}
                    </span>
                );
            }
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const s = row.original.status.toLowerCase();
                const isPending = s === 'pending' || s === 'proses';
                return (
                    <div className="flex gap-2 items-center">
                        <button onClick={(e) => handleEdit(e, row.original)} className="text-secondary hover:bg-secondary/10 px-2 py-1 rounded text-xs font-bold transition-colors">
                            Edit
                        </button>
                        {isPending && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); handleVerify(row.original.id, 'accepted'); }} className="text-[#047857] hover:bg-[#047857]/10 px-2 py-1 rounded text-xs font-bold transition-colors">
                                    Terima
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleVerify(row.original.id, 'rejected'); }} className="text-error hover:bg-error/10 px-2 py-1 rounded text-xs font-bold transition-colors">
                                    Tolak
                                </button>
                            </>
                        )}
                    </div>
                );
            }
        }
    ];

    const filteredBatches = batches?.filter(b => b.academic_year_id == formData.academic_year_id) || [];

    if (isFormOpen) {
        return (
            <div className="w-full bg-surface rounded-xl shadow-sm border border-outline-variant p-stack-lg">
                <div className="flex justify-between items-center border-b border-outline-variant pb-4 mb-6">
                    <h2 className="font-headline-md text-xl font-bold">{editId ? 'Edit Data Pendaftar' : 'Daftarkan Siswa Baru'}</h2>
                    <button onClick={() => { setIsFormOpen(false); setStep(1); setEditId(null); setFormData(initialForm); }} className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined">arrow_back</span> Kembali ke Tabel
                    </button>
                </div>

                {/* Stepper Tabs */}
                <div className="flex mb-8 border-b border-outline-variant">
                    <button onClick={() => setStep(1)} className={`flex-1 py-3 text-center font-label-md font-bold transition-colors ${step === 1 ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                        1. Data Calon Siswa
                    </button>
                    <button onClick={() => setStep(2)} className={`flex-1 py-3 text-center font-label-md font-bold transition-colors ${step === 2 ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                        2. Data Orang Tua
                    </button>
                    <button onClick={() => setStep(3)} className={`flex-1 py-3 text-center font-label-md font-bold transition-colors ${step === 3 ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                        3. Dokumen & Pengaturan
                    </button>
                </div>
                
                <form className="flex flex-col gap-6">
                    
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Informasi Calon Siswa</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input required name="nik" value={formData.nik} onChange={handleChange} label="NIK (Siswa)" />
                                <Input required name="full_name" value={formData.full_name} onChange={handleChange} label="Nama Lengkap" />
                                <Input name="nisn" value={formData.nisn} onChange={handleChange} label="NISN" />
                                <Select name="gender" value={formData.gender} onChange={handleChange} label="Jenis Kelamin" options={[
                                    { value: 'L', label: 'Laki-Laki' },
                                    { value: 'P', label: 'Perempuan' }
                                ]} />
                                <Input name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} label="Tempat Lahir" />
                                <Input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} label="Tanggal Lahir" />
                                <Input name="previous_school" value={formData.previous_school} onChange={handleChange} label="Asal Sekolah" />
                                <Input name="phone_number" value={formData.phone_number} onChange={handleChange} label="Nomor Telepon (Siswa)" />
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <label className="font-label-md text-label-md text-on-surface">Foto Calon Siswa</label>
                                    <p className="text-xs text-on-surface-variant mb-1">Format: JPG/PNG (Max 2MB)</p>
                                    <input type="file" accept="image/jpeg,image/png" onChange={(e) => setFormData({...formData, photo: e.target.files[0]})} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20" />
                                </div>
                                <div className="md:col-span-2">
                                    <Textarea name="address" value={formData.address} onChange={handleChange} rows="3" label="Alamat Lengkap" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Informasi Orang Tua / Wali</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in flex flex-col gap-8">
                            <div>
                                <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Pengaturan Pendaftaran</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Select required name="academic_year_id" value={formData.academic_year_id} onChange={handleChange} label="Tahun Ajaran" options={[
                                        { value: '', label: '-- Pilih --' },
                                        ...academicYears?.map(y => ({ value: y.id, label: `${y.name} ${y.is_active ? '(Aktif)' : ''}` })) || []
                                    ]} />
                                    <Select required name="ppdb_batch_id" value={formData.ppdb_batch_id} onChange={handleChange} disabled={!formData.academic_year_id} label="Gelombang" options={[
                                        { value: '', label: '-- Pilih Gelombang --' },
                                        ...filteredBatches.map(b => ({ value: b.id, label: b.name }))
                                    ]} />
                                    <Select required name="ppdb_path_id" value={formData.ppdb_path_id} onChange={handleChange} label="Jalur" options={[
                                        { value: '', label: '-- Pilih Jalur --' },
                                        ...paths?.map(p => ({ value: p.id, label: p.name })) || []
                                    ]} />
                                    <Select required name="status" value={formData.status} onChange={handleChange} label="Status Awal" options={[
                                        { value: 'pending', label: 'Pending' },
                                        { value: 'verified', label: 'Verified' },
                                        { value: 'accepted', label: 'Accepted' },
                                        { value: 'rejected', label: 'Rejected' }
                                    ]} />
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2 mb-4">Kelengkapan Dokumen</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {documentRequirements?.map(req => (
                                        <div key={req.id} className="flex flex-col gap-1 border border-outline-variant p-4 rounded bg-surface-container-lowest">
                                            <label className="font-label-md text-label-md font-bold">
                                                {req.name} {req.is_required ? <span className="text-error">*</span> : ''}
                                            </label>
                                            <p className="text-xs text-on-surface-variant mb-2">{req.description || 'Format: PDF/JPG/PNG (Otomatis kompresi WebP untuk gambar)'}</p>
                                            <input type="file" accept=".pdf,image/jpeg,image/png" onChange={(e) => handleFileChange(e, req.id)} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t border-outline-variant mt-4">
                        <div>
                            {step > 1 && (
                                <Button type="button" onClick={() => setStep(step - 1)} variant="outline" className="gap-2">
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span> Sebelumnya
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {step < 3 ? (
                                <Button type="button" onClick={() => setStep(step + 1)} className="gap-2">
                                    Selanjutnya <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </Button>
                            ) : (
                                <>
                                    {!editId && (
                                        <Button type="button" onClick={(e) => handleSubmit(e, true)} disabled={loading} variant="secondary">
                                            Simpan & Tambah Lagi
                                        </Button>
                                    )}
                                    <Button type="button" onClick={(e) => handleSubmit(e, false)} disabled={loading}>
                                        Simpan Pendaftaran
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="font-headline-lg text-headline-lg text-on-background">Manajemen PPDB</h1>
                <p className="font-body-md text-on-surface-variant mt-1">Kelola data pendaftar calon peserta didik baru.</p>
            </div>
            
            <div className="relative">
                {loading && !initialized ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={ppdb} 
                        searchPlaceholder="Cari pendaftar..."
                        onAdd={() => { setEditId(null); setFormData(initialForm); setIsFormOpen(true); }}
                        addLabel="Daftarkan Siswa Baru"
                        onExport={handleExportExcel}
                        onRowClick={(row) => { setSelectedRegistration(row); setDetailTab(1); }}
                    />
                )}
            </div>

            {selectedRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedRegistration(null)}>
                    <div className="bg-surface rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-stack-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                            <h2 className="font-headline-sm text-lg font-bold">Detail Pendaftar: {selectedRegistration.registration_number}</h2>
                            <button onClick={() => setSelectedRegistration(null)} className="text-on-surface-variant hover:text-error transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="flex border-b border-outline-variant bg-surface-container-lowest px-4">
                            <button onClick={() => setDetailTab(1)} className={`py-3 px-4 text-center font-label-md font-bold transition-colors ${detailTab === 1 ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                                Data Siswa
                            </button>
                            <button onClick={() => setDetailTab(2)} className={`py-3 px-4 text-center font-label-md font-bold transition-colors ${detailTab === 2 ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                                Data Orang Tua
                            </button>
                            <button onClick={() => setDetailTab(3)} className={`py-3 px-4 text-center font-label-md font-bold transition-colors ${detailTab === 3 ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                                Dokumen & Berkas
                            </button>
                        </div>

                        <div className="p-stack-lg overflow-y-auto flex flex-col gap-6">
                            {detailTab === 1 && (
                                <div className="animate-fade-in">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {selectedRegistration.photo_path ? (
                                            <div className="shrink-0">
                                                <img src={`/storage/${selectedRegistration.photo_path}`} alt="Foto Siswa" className="w-40 h-48 object-cover rounded border border-outline-variant shadow-sm" />
                                            </div>
                                        ) : (
                                            <div className="shrink-0 w-40 h-48 bg-surface-container-highest rounded border border-outline-variant flex items-center justify-center text-on-surface-variant shadow-sm">
                                                <span className="material-symbols-outlined text-[64px]">person</span>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm flex-1">
                                            <div><span className="text-on-surface-variant block text-xs mb-1">Nama Lengkap</span><strong className="text-base">{selectedRegistration.full_name}</strong></div>
                                            <div><span className="text-on-surface-variant block text-xs mb-1">NIK Siswa</span><span className="font-medium text-base">{selectedRegistration.nik || '-'}</span></div>
                                            <div><span className="text-on-surface-variant block text-xs mb-1">NISN</span><span className="font-medium">{selectedRegistration.nisn || '-'}</span></div>
                                            <div><span className="text-on-surface-variant block text-xs mb-1">Jenis Kelamin</span><span className="font-medium">{selectedRegistration.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span></div>
                                            <div><span className="text-on-surface-variant block text-xs mb-1">Tempat, Tanggal Lahir</span><span className="font-medium">{selectedRegistration.place_of_birth || '-'}, {selectedRegistration.date_of_birth || '-'}</span></div>
                                            <div><span className="text-on-surface-variant block text-xs mb-1">Asal Sekolah</span><span className="font-medium">{selectedRegistration.previous_school || '-'}</span></div>
                                            <div><span className="text-on-surface-variant block text-xs mb-1">Nomor Telepon (Siswa)</span><span className="font-medium">{selectedRegistration.phone_number || '-'}</span></div>
                                            <div className="col-span-2"><span className="text-on-surface-variant block text-xs mb-1">Alamat Lengkap</span><span className="font-medium">{selectedRegistration.address || '-'}</span></div>
                                            
                                            <div className="col-span-2 pt-4 border-t border-outline-variant mt-2"></div>
                                            
                                            <div><span className="text-on-surface-variant block text-xs mb-1">Gelombang</span><span className="font-medium">{selectedRegistration.batch?.name || '-'}</span></div>
                                            <div><span className="text-on-surface-variant block text-xs mb-1">Jalur</span><span className="font-medium">{selectedRegistration.path?.name || '-'}</span></div>
                                            <div><span className="text-on-surface-variant block text-xs mb-1">Status</span><span className="font-bold uppercase text-primary">{selectedRegistration.status}</span></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {detailTab === 2 && (
                                <div className="animate-fade-in grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                                    <div className="col-span-2">
                                        <span className="text-on-surface-variant block text-xs mb-1">NIK Orang Tua / Wali</span>
                                        <span className="font-medium text-base">{selectedRegistration.parent_nik || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block text-xs mb-1">Nama Ayah</span>
                                        <span className="font-medium">{selectedRegistration.father_name || selectedRegistration.parent_name || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block text-xs mb-1">Pekerjaan Ayah</span>
                                        <span className="font-medium">{selectedRegistration.father_occupation || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block text-xs mb-1">Nama Ibu</span>
                                        <span className="font-medium">{selectedRegistration.mother_name || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-on-surface-variant block text-xs mb-1">Pekerjaan Ibu</span>
                                        <span className="font-medium">{selectedRegistration.mother_occupation || '-'}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-on-surface-variant block text-xs mb-1">Nomor Telepon / WhatsApp (Orang Tua)</span>
                                        <span className="font-medium">{selectedRegistration.parent_phone || selectedRegistration.parent_phone_number || '-'}</span>
                                    </div>
                                </div>
                            )}

                            {detailTab === 3 && (
                                <div className="animate-fade-in">
                                    {selectedRegistration.documents && selectedRegistration.documents.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedRegistration.documents.map(doc => {
                                                const req = documentRequirements?.find(r => r.id === doc.ppdb_document_requirement_id);
                                                return (
                                                    <div key={doc.id} className="flex flex-col gap-2 p-4 border border-outline-variant rounded-lg bg-surface-container-lowest">
                                                        <div>
                                                            <h4 className="font-bold text-sm">{req ? req.name : 'Dokumen'}</h4>
                                                        </div>
                                                        <a href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 bg-primary-container text-on-primary-container rounded hover:bg-primary/20 transition-colors mt-2">
                                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                            <span className="font-label-md font-bold">Lihat Dokumen</span>
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant bg-surface-container-lowest rounded-lg border border-dashed border-outline-variant">
                                            <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">folder_off</span>
                                            <p>Belum ada dokumen yang diunggah.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="p-stack-md border-t border-outline-variant bg-surface-container-lowest flex justify-end">
                            <button onClick={() => setSelectedRegistration(null)} className="px-6 py-2 bg-surface text-on-surface border border-outline rounded font-label-md hover:bg-surface-container transition-colors">Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PpdbManager;
