import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

const CbtExamBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        id: null,
        type: 'multiple_choice',
        question_text: '',
        points: 1,
        options: [
            { option_text: '', is_correct: true },
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false },
        ]
    });

    const fetchExam = async () => {
        try {
            const res = await axios.get(`/admin/cbt/exams/${id}`);
            setExam(res.data);
        } catch (error) {
            toast.error('Gagal mengambil data ujian');
            navigate('/admin/cbt/exams');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExam();
    }, [id]);

    const handleDelete = async (qId) => {
        if (!window.confirm('Yakin hapus soal ini?')) return;
        try {
            await axios.delete(`/admin/cbt/questions/${qId}`);
            toast.success('Soal dihapus');
            fetchExam();
        } catch (error) {
            toast.error('Gagal menghapus soal');
        }
    };

    const handleEdit = (q) => {
        setFormData({
            id: q.id,
            type: q.type,
            question_text: q.question_text,
            points: q.points,
            options: q.type === 'multiple_choice' && q.options && q.options.length > 0 
                ? q.options.map(o => ({ id: o.id, option_text: o.option_text, is_correct: !!o.is_correct }))
                : [
                    { option_text: '', is_correct: true },
                    { option_text: '', is_correct: false },
                    { option_text: '', is_correct: false },
                    { option_text: '', is_correct: false },
                ]
        });
        setIsModalOpen(true);
    };

    const handleOptionChange = (idx, field, val) => {
        const newOpts = [...formData.options];
        if (field === 'is_correct') {
            // Uncheck others if multiple choice single correct
            newOpts.forEach(o => o.is_correct = false);
            newOpts[idx].is_correct = true;
        } else {
            newOpts[idx][field] = val;
        }
        setFormData({ ...formData, options: newOpts });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (formData.id) {
                await axios.put(`/admin/cbt/questions/${formData.id}`, formData);
                toast.success('Soal diperbarui');
            } else {
                await axios.post(`/admin/cbt/exams/${id}/questions`, formData);
                toast.success('Soal ditambahkan');
            }
            setIsModalOpen(false);
            fetchExam();
        } catch (error) {
            toast.error('Gagal menyimpan soal');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Memuat...</div>;
    if (!exam) return null;

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-6 flex justify-between items-end shrink-0">
                <div>
                    <button onClick={() => navigate('/admin/cbt/exams')} className="text-primary hover:underline mb-2 block">&larr; Kembali ke Daftar Ujian</button>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Kelola Soal: {exam.title}</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Total Soal: {exam.questions?.length || 0}</p>
                </div>
                <button onClick={() => {
                    setFormData({
                        id: null,
                        type: 'multiple_choice',
                        question_text: '',
                        points: 1,
                        options: [
                            { option_text: '', is_correct: true },
                            { option_text: '', is_correct: false },
                            { option_text: '', is_correct: false },
                            { option_text: '', is_correct: false },
                        ]
                    });
                    setIsModalOpen(true);
                }} className="bg-primary text-on-primary px-4 py-2 rounded">
                    + Tambah Soal
                </button>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant flex-1 overflow-auto p-4 flex flex-col gap-4">
                {exam.questions?.map((q, idx) => (
                    <div key={q.id} className="border p-4 rounded bg-surface relative">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold">Soal {idx + 1} ({q.points} Poin) - {q.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Essay'}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(q)} className="text-primary hover:text-primary/80" title="Edit">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button onClick={() => handleDelete(q.id)} className="text-error hover:text-error/80" title="Hapus">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                        <p className="mt-2">{q.question_text}</p>
                        {q.type === 'multiple_choice' && (
                            <ul className="mt-2 ml-4 list-disc">
                                {q.options?.map(opt => (
                                    <li key={opt.id} className={opt.is_correct ? 'text-green-600 font-bold' : ''}>
                                        {opt.option_text} {opt.is_correct && '(Benar)'}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
                {(!exam.questions || exam.questions.length === 0) && (
                    <div className="text-center text-gray-500 py-8">Belum ada soal.</div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => !submitting && setIsModalOpen(false)} title="Tambah Soal">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipe Soal</label>
                        <select 
                            value={formData.type} 
                            onChange={e => setFormData({...formData, type: e.target.value})} 
                            className="w-full p-2 border rounded"
                        >
                            <option value="multiple_choice">Pilihan Ganda</option>
                            <option value="essay">Essay</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Teks Soal</label>
                        <textarea 
                            value={formData.question_text} 
                            onChange={e => setFormData({...formData, question_text: e.target.value})} 
                            required 
                            className="w-full p-2 border rounded"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Bobot Nilai</label>
                        <input 
                            type="number" 
                            min="1" 
                            value={formData.points} 
                            onChange={e => setFormData({...formData, points: e.target.value})} 
                            required 
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {formData.type === 'multiple_choice' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Pilihan Jawaban</label>
                            {formData.options.map((opt, idx) => (
                                <div key={idx} className="flex gap-2 mb-2 items-center">
                                    <input 
                                        type="radio" 
                                        name="correct_option" 
                                        checked={opt.is_correct} 
                                        onChange={() => handleOptionChange(idx, 'is_correct', true)} 
                                        title="Tandai Benar"
                                    />
                                    <input 
                                        type="text" 
                                        value={opt.option_text} 
                                        onChange={e => handleOptionChange(idx, 'option_text', e.target.value)} 
                                        required={formData.type === 'multiple_choice'} 
                                        placeholder={`Pilihan ${idx + 1}`}
                                        className="flex-1 p-2 border rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} disabled={submitting} className="px-4 py-2 border rounded">Batal</button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white rounded">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CbtExamBuilder;
