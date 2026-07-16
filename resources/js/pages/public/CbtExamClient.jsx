import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CbtExamClient = () => {
    const [token, setToken] = useState(localStorage.getItem('cbt_token') || '');
    const [examNumber, setExamNumber] = useState('');
    const [exams, setExams] = useState([]);
    const [activeExam, setActiveExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIdx, setCurrentIdx] = useState(0);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/cbt/login', { exam_number: examNumber });
            setToken(res.data.token);
            localStorage.setItem('cbt_token', res.data.token);
            toast.success('Berhasil login CBT');
            fetchExams(res.data.token);
        } catch (error) {
            toast.error('Nomor ujian tidak ditemukan');
        }
    };

    const fetchExams = async (t) => {
        try {
            const res = await axios.get('/cbt/exams', { headers: { 'X-CBT-Token': t } });
            setExams(res.data);
        } catch (error) {
            toast.error('Gagal mengambil daftar ujian');
        }
    };

    useEffect(() => {
        if (token) fetchExams(token);
    }, [token]);

    const startExam = async (examId) => {
        try {
            const res = await axios.post(`/cbt/exams/${examId}/start`, {}, { headers: { 'X-CBT-Token': token } });
            setActiveExam(res.data.session);
            setQuestions(res.data.questions);
            
            // Map existing answers
            const ansMap = {};
            res.data.answers.forEach(a => {
                ansMap[a.question_id] = a;
            });
            setAnswers(ansMap);
        } catch (error) {
            toast.error('Gagal memulai ujian');
        }
    };

    const handleAnswer = async (qId, optionId, essayText = '') => {
        const payload = { question_id: qId, option_id: optionId, essay_answer: essayText };
        try {
            const res = await axios.post(`/cbt/sessions/${activeExam.id}/answer`, payload, { headers: { 'X-CBT-Token': token } });
            setAnswers(prev => ({ ...prev, [qId]: res.data }));
        } catch (error) {
            toast.error('Gagal menyimpan jawaban');
        }
    };

    const finishExam = async () => {
        if (!window.confirm('Yakin ingin menyelesaikan ujian ini? Anda tidak dapat kembali lagi.')) return;
        try {
            await axios.post(`/cbt/sessions/${activeExam.id}/finish`, {}, { headers: { 'X-CBT-Token': token } });
            toast.success('Ujian selesai');
            setActiveExam(null);
            fetchExams(token);
        } catch (error) {
            toast.error('Gagal mengakhiri ujian');
        }
    };

    if (!token) {
        return (
            <div className="flex h-screen items-center justify-center bg-surface">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Login Peserta CBT</h2>
                    <input 
                        className="border p-2 rounded" 
                        placeholder="Nomor Ujian" 
                        value={examNumber} 
                        onChange={e => setExamNumber(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="bg-primary text-white p-2 rounded">Masuk</button>
                </form>
            </div>
        );
    }

    if (!activeExam) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Daftar Ujian Anda</h1>
                    <button onClick={() => { setToken(''); localStorage.removeItem('cbt_token'); }} className="text-error">Logout</button>
                </div>
                <div className="grid gap-4">
                    {exams.map(ex => {
                        const sess = ex.sessions?.[0];
                        return (
                            <div key={ex.id} className="border p-4 rounded shadow-sm bg-white flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{ex.title}</h3>
                                    <p className="text-sm text-gray-500">{ex.duration_minutes} Menit</p>
                                </div>
                                {sess?.status === 'finished' ? (
                                    <span className="text-green-600 font-bold">Selesai (Skor: {sess.final_score})</span>
                                ) : (
                                    <button onClick={() => startExam(ex.id)} className="bg-primary text-white px-4 py-2 rounded">
                                        {sess ? 'Lanjutkan' : 'Mulai Ujian'}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIdx];

    return (
        <div className="h-screen flex flex-col bg-surface">
            <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
                <h1 className="font-bold">Ujian Berlangsung</h1>
                <button onClick={finishExam} className="bg-error px-4 py-1 rounded font-bold">SELESAI</button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-8 overflow-y-auto">
                    {currentQ && (
                        <div className="bg-white p-6 rounded shadow border">
                            <h2 className="text-lg font-bold mb-4">Soal No. {currentIdx + 1}</h2>
                            <p className="mb-6">{currentQ.question_text}</p>
                            
                            {currentQ.type === 'multiple_choice' ? (
                                <div className="flex flex-col gap-2">
                                    {currentQ.options.map(opt => {
                                        const isChecked = answers[currentQ.id]?.option_id === opt.id;
                                        return (
                                            <label key={opt.id} className={`p-3 border rounded cursor-pointer ${isChecked ? 'bg-primary/10 border-primary' : ''}`}>
                                                <input 
                                                    type="radio" 
                                                    name={`q_${currentQ.id}`} 
                                                    checked={isChecked}
                                                    onChange={() => handleAnswer(currentQ.id, opt.id)}
                                                    className="mr-3"
                                                />
                                                {opt.option_text}
                                            </label>
                                        )
                                    })}
                                </div>
                            ) : (
                                <textarea 
                                    className="w-full border p-3 rounded min-h-[150px]"
                                    placeholder="Ketik jawaban Anda di sini..."
                                    value={answers[currentQ.id]?.essay_answer || ''}
                                    onChange={(e) => handleAnswer(currentQ.id, null, e.target.value)}
                                ></textarea>
                            )}
                        </div>
                    )}
                    
                    <div className="flex justify-between mt-6">
                        <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(prev => prev - 1)} className="px-4 py-2 border rounded disabled:opacity-50">Sebelumnya</button>
                        <button disabled={currentIdx === questions.length - 1} onClick={() => setCurrentIdx(prev => prev + 1)} className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50">Selanjutnya</button>
                    </div>
                </div>
                
                <div className="w-72 bg-white border-l p-4 overflow-y-auto shrink-0 flex flex-col gap-2">
                    <h3 className="font-bold border-b pb-2 mb-2">Navigasi Soal</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {questions.map((q, idx) => {
                            const hasAns = answers[q.id]?.option_id || (answers[q.id]?.essay_answer && answers[q.id]?.essay_answer.trim() !== '');
                            return (
                                <button 
                                    key={q.id} 
                                    onClick={() => setCurrentIdx(idx)}
                                    className={`p-2 border rounded font-bold ${currentIdx === idx ? 'ring-2 ring-primary' : ''} ${hasAns ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    {idx + 1}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CbtExamClient;
