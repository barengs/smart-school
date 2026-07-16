import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, deleteStudent, saveStudent } from '../../store/studentSlice';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import Modal from '../../components/ui/Modal';
import axios from 'axios';

const StudentManager = () => {
    const dispatch = useDispatch();
    const { items: students, loading, initialized } = useSelector((state) => state.student);
    const [academicYears, setAcademicYears] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', nik: '', nis: '', nisn: '', phone: '', address: '', gender: '', birth_date: '', birth_place: '', father_name: '', father_nik: '', mother_name: '', mother_nik: '', parent_phone: '' });

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchStudents());
        }
        axios.get('/academic-years').then(res => setAcademicYears(res.data)).catch(console.error);
        axios.get('/classrooms').then(res => setClassrooms(res.data)).catch(console.error);
    }, [dispatch, initialized]);

    const handleDelete = (id) => {
        if (!window.confirm('Yakin ingin menghapus data siswa ini?')) return;
        dispatch(deleteStudent(id));
    };

    const handleEdit = (student) => {
        setFormData({
            id: student.id,
            name: student.user?.name || '',
            nik: student.nik || '',
            nis: student.nis || '',
            nisn: student.nisn || '',
            phone: student.phone || '',
            address: student.address || '',
            gender: student.gender || '',
            birth_date: student.birth_date || '',
            birth_place: student.birth_place || '',
            father_name: student.father_name || '',
            father_nik: student.father_nik || '',
            mother_name: student.mother_name || '',
            mother_nik: student.mother_nik || '',
            parent_phone: student.parent_phone || '',
        });
        setIsModalOpen(true);
    };

    const handleView = (student) => {
        setSelectedStudent(student);
        setIsDetailOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await dispatch(saveStudent(formData)).unwrap();
            setIsModalOpen(false);
        } catch (error) {
            // Error handled in thunk
        } finally {
            setSubmitting(false);
        }
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            let passYear = true;
            let passClass = true;

            const studentClasses = student.classrooms || [];

            if (selectedYear) {
                passYear = studentClasses.some(c => String(c.pivot?.academic_year_id) === String(selectedYear));
            }
            if (selectedClass) {
                if (selectedYear) {
                    passClass = studentClasses.some(c => String(c.id) === String(selectedClass) && String(c.pivot?.academic_year_id) === String(selectedYear));
                } else {
                    passClass = studentClasses.some(c => String(c.id) === String(selectedClass));
                }
            }
            return passYear && passClass;
        });
    }, [students, selectedYear, selectedClass]);

    const columns = [
        {
            accessorKey: 'nis',
            header: 'NIS / NISN',
            cell: info => <span className="font-code text-primary text-xs">{info.getValue() || '-'}</span>
        },
        {
            accessorKey: 'user.name',
            header: 'Nama Lengkap',
            cell: info => <span className="font-bold">{info.row.original.user?.name || '-'}</span>
        },
        {
            id: 'classroom_name',
            header: 'Kelas',
            cell: info => {
                const classes = info.row.original.classrooms || [];
                if (classes.length === 0) return '-';
                if (selectedYear) {
                    const matched = classes.find(c => String(c.pivot?.academic_year_id) === String(selectedYear));
                    if (matched) return matched.name;
                }
                return classes[0].name;
            }
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => (
                <span className={`px-2 py-1 rounded text-xs ${info.getValue() === 'active' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {info.getValue() === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </span>
            )
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(row.original); }} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="w-full flex flex-col min-h-0">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Data Siswa</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola data siswa aktif maupun alumni.</p>
                </div>
            </div>
            
            <div className="flex-1 overflow-auto relative min-h-[400px]">
                {loading && !initialized ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={filteredStudents} 
                        searchPlaceholder="Cari siswa..."
                        onAdd={() => alert('Untuk menambah siswa baru, silakan gunakan menu PPDB atau import data.')}
                        addLabel="Tambah Siswa"
                        onRowClick={handleView}
                        customFilters={
                            <div className="flex gap-2 w-full">
                                <select 
                                    value={selectedYear} 
                                    onChange={e => setSelectedYear(e.target.value)}
                                    className="w-full md:w-auto p-2 border border-outline-variant rounded text-sm bg-surface text-on-surface focus:outline-none focus:border-primary"
                                >
                                    <option value="">Semua Tahun Ajaran</option>
                                    {academicYears.map(ay => (
                                        <option key={ay.id} value={ay.id}>{ay.name}</option>
                                    ))}
                                </select>
                                <select 
                                    value={selectedClass} 
                                    onChange={e => setSelectedClass(e.target.value)}
                                    className="w-full md:w-auto p-2 border border-outline-variant rounded text-sm bg-surface text-on-surface focus:outline-none focus:border-primary"
                                >
                                    <option value="">Semua Kelas</option>
                                    {classrooms.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        }
                    />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title="Edit Siswa">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">NIK</label>
                            <input type="text" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full p-2 border rounded" maxLength="16" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">NIS</label>
                            <input type="text" value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">NISN</label>
                            <input type="text" value={formData.nisn} onChange={e => setFormData({...formData, nisn: e.target.value})} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">No. HP / WhatsApp</label>
                        <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                        <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-2 border rounded">
                            <option value="">Pilih</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tempat Lahir</label>
                            <input type="text" value={formData.birth_place} onChange={e => setFormData({...formData, birth_place: e.target.value})} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
                            <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Alamat</label>
                        <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded" rows="3" />
                    </div>
                    <div className="border-t border-outline-variant pt-4 mt-2">
                        <h3 className="font-medium text-on-surface mb-3">Data Orang Tua</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Ayah</label>
                                <input type="text" value={formData.father_name} onChange={e => setFormData({...formData, father_name: e.target.value})} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">NIK Ayah</label>
                                <input type="text" value={formData.father_nik} onChange={e => setFormData({...formData, father_nik: e.target.value})} className="w-full p-2 border rounded" maxLength="16" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Ibu</label>
                                <input type="text" value={formData.mother_name} onChange={e => setFormData({...formData, mother_name: e.target.value})} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">NIK Ibu</label>
                                <input type="text" value={formData.mother_nik} onChange={e => setFormData({...formData, mother_nik: e.target.value})} className="w-full p-2 border rounded" maxLength="16" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">No. HP Orang Tua</label>
                            <input type="text" value={formData.parent_phone} onChange={e => setFormData({...formData, parent_phone: e.target.value})} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} disabled={submitting} className="px-4 py-2 border rounded">Batal</button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white rounded">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Detil Data Siswa">
                {selectedStudent && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 border-b pb-3">
                            <span className="text-on-surface-variant text-sm">Nama Lengkap</span>
                            <span className="col-span-2 font-medium">{selectedStudent.user?.name || '-'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-b pb-3">
                            <span className="text-on-surface-variant text-sm">NIK / NIS / NISN</span>
                            <span className="col-span-2 font-medium">{selectedStudent.nik || '-'} / {selectedStudent.nis || '-'} / {selectedStudent.nisn || '-'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-b pb-3">
                            <span className="text-on-surface-variant text-sm">Jenis Kelamin</span>
                            <span className="col-span-2 font-medium">{selectedStudent.gender === 'L' ? 'Laki-laki' : selectedStudent.gender === 'P' ? 'Perempuan' : '-'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-b pb-3">
                            <span className="text-on-surface-variant text-sm">Tempat, Tanggal Lahir</span>
                            <span className="col-span-2 font-medium">{selectedStudent.birth_place || '-'}, {selectedStudent.birth_date || '-'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-b pb-3">
                            <span className="text-on-surface-variant text-sm">No. HP / WhatsApp</span>
                            <span className="col-span-2 font-medium">{selectedStudent.phone || '-'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-b pb-3">
                            <span className="text-on-surface-variant text-sm">Alamat</span>
                            <span className="col-span-2 font-medium">{selectedStudent.address || '-'}</span>
                        </div>
                        <div className="pt-2">
                            <h3 className="font-bold text-on-surface mb-3">Data Orang Tua</h3>
                            <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                <span className="text-on-surface-variant text-sm">Nama Ayah</span>
                                <span className="col-span-2 font-medium">{selectedStudent.father_name || '-'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                <span className="text-on-surface-variant text-sm">NIK Ayah</span>
                                <span className="col-span-2 font-medium">{selectedStudent.father_nik || '-'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                <span className="text-on-surface-variant text-sm">Nama Ibu</span>
                                <span className="col-span-2 font-medium">{selectedStudent.mother_name || '-'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                <span className="text-on-surface-variant text-sm">NIK Ibu</span>
                                <span className="col-span-2 font-medium">{selectedStudent.mother_nik || '-'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-3">
                                <span className="text-on-surface-variant text-sm">No. HP Orang Tua</span>
                                <span className="col-span-2 font-medium">{selectedStudent.parent_phone || '-'}</span>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={() => setIsDetailOpen(false)} className="px-4 py-2 border rounded">Tutup</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StudentManager;
