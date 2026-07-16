import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
    hadir: { label: 'H', color: '#22c55e', bg: '#dcfce7', text: '#15803d' },
    izin: { label: 'I', color: '#3b82f6', bg: '#dbeafe', text: '#1d4ed8' },
    sakit: { label: 'S', color: '#f59e0b', bg: '#fef3c7', text: '#b45309' },
    alpa: { label: 'A', color: '#ef4444', bg: '#fee2e2', text: '#b91c1c' },
};

// Cell component: click to cycle status in modal context
const StatusBadge = ({ status, onClick, meetingNumber, isClickable }) => {
    if (!status) {
        return (
            <button
                onClick={onClick}
                disabled={!isClickable}
                style={{
                    width: 32, height: 32, borderRadius: 2, border: '1px solid #e2e8f0',
                    background: '#f8fafc', cursor: isClickable ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: '#94a3b8', transition: 'all 0.15s',
                }}
                title={isClickable ? `RTM ${meetingNumber} - Belum diisi` : ''}
            >
                -
            </button>
        );
    }
    const cfg = STATUS_CONFIG[status];
    return (
        <button
            onClick={onClick}
            disabled={!isClickable}
            style={{
                width: 32, height: 32, borderRadius: 2,
                background: cfg.bg, border: `1px solid ${cfg.color}40`,
                cursor: isClickable ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: cfg.text, transition: 'all 0.15s',
            }}
            title={isClickable ? `RTM ${meetingNumber} - ${status}` : status}
        >
            {cfg.label}
        </button>
    );
};

// Modal: isi presensi satu pertemuan
const MeetingModal = ({ meeting, students, initialData, onClose, onSave }) => {
    const [form, setForm] = useState(() => {
        const map = {};
        (initialData || []).forEach(a => { map[a.student_id] = a.status; });
        return students.map(s => ({
            student_id: s.student_id,
            name: s.name,
            nis: s.nis,
            status: map[s.student_id] || 'hadir',
            notes: '',
        }));
    });
    const [saving, setSaving] = useState(false);

    const setAllStatus = (status) => {
        setForm(prev => prev.map(r => ({ ...r, status })));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/attendances/meeting', {
                meeting_id: meeting.id,
                attendances: form.map(r => ({ student_id: r.student_id, status: r.status, notes: r.notes })),
            });
            toast.success(`Presensi RTM ${meeting.meeting_number} disimpan`);
            onSave();
            onClose();
        } catch (e) {
            toast.error('Gagal menyimpan presensi');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{
                background: 'white', borderRadius: 6, width: '100%', maxWidth: 700,
                maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'white', fontSize: 18, fontWeight: 700 }}>
                            Isi Presensi — RTM {meeting.meeting_number}
                        </h2>
                        <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                            Tanggal: {meeting.planned_date} · {meeting.type || 'Tatap Muka'}
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4,
                        color: 'white', width: 36, height: 36, cursor: 'pointer', fontSize: 18,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                </div>

                {/* Quick fill */}
                <div style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: '#64748b', marginRight: 4 }}>Semua:</span>
                    {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
                        <button key={status} onClick={() => setAllStatus(status)} style={{
                            padding: '4px 12px', borderRadius: 3, border: `1px solid ${cfg.color}`,
                            background: cfg.bg, color: cfg.text, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>{cfg.label} - {status.charAt(0).toUpperCase() + status.slice(1)}</button>
                    ))}
                </div>

                {/* Table */}
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0', width: 40 }}>No</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>NIS</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Nama</th>
                                <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 12, color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {form.map((row, i) => (
                                <tr key={row.student_id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                                    <td style={{ padding: '8px 16px', fontSize: 13, color: '#94a3b8' }}>{i + 1}</td>
                                    <td style={{ padding: '8px 16px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{row.nis || '-'}</td>
                                    <td style={{ padding: '8px 16px', fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{row.name}</td>
                                    <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                                            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
                                                <button
                                                    key={status}
                                                    onClick={() => setForm(prev => prev.map((r, idx) => idx === i ? { ...r, status } : r))}
                                                    style={{
                                                        width: 36, height: 28, borderRadius: 2,
                                                        border: row.status === status ? `2px solid ${cfg.color}` : '1px solid #e2e8f0',
                                                        background: row.status === status ? cfg.bg : 'white',
                                                        color: row.status === status ? cfg.text : '#94a3b8',
                                                        fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                                        transition: 'all 0.1s',
                                                    }}
                                                >
                                                    {cfg.label}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button onClick={onClose} style={{
                        padding: '8px 20px', borderRadius: 3, border: '1px solid #e2e8f0',
                        background: 'white', color: '#64748b', cursor: 'pointer', fontSize: 13,
                    }}>Batal</button>
                    <button onClick={handleSave} disabled={saving} style={{
                        padding: '8px 24px', borderRadius: 3, border: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13,
                        fontWeight: 600, opacity: saving ? 0.7 : 1,
                    }}>
                        {saving ? 'Menyimpan...' : 'Simpan Presensi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AttendanceManager = () => {
    const [schedules, setSchedules] = useState([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    const [matrixData, setMatrixData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [modal, setModal] = useState(null); // { meeting, currentData }

    // Load dropdown jadwal
    useEffect(() => {
        axios.get('/attendances/schedules')
            .then(r => { setSchedules(r.data); })
            .catch(() => toast.error('Gagal memuat jadwal'))
            .finally(() => setLoadingSchedules(false));
    }, []);

    const loadMatrix = useCallback((scheduleId) => {
        if (!scheduleId) return;
        setLoading(true);
        axios.get(`/attendances/matrix?schedule_id=${scheduleId}`)
            .then(r => setMatrixData(r.data))
            .catch(() => toast.error('Gagal memuat data presensi'))
            .finally(() => setLoading(false));
    }, []);

    const handleScheduleChange = (e) => {
        const id = e.target.value;
        setSelectedScheduleId(id);
        setMatrixData(null);
        if (id) loadMatrix(id);
    };

    const handleMeetingClick = (meeting) => {
        if (!matrixData) return;
        // Kumpulkan attendance aktual untuk pertemuan ini
        const currentData = matrixData.students.map(s => ({
            student_id: s.student_id,
            status: s.meetings[meeting.meeting_number] || null,
        }));
        setModal({ meeting, currentData });
    };

    const meetings = matrixData?.schedule?.meetings || [];
    const totalMeetings = 16;
    const displayMeetings = Array.from({ length: totalMeetings }, (_, i) => {
        return meetings.find(m => m.meeting_number === i + 1) || { meeting_number: i + 1, id: null, planned_date: null, type: null };
    });

    const selectedSchedule = matrixData?.schedule;

    return (
        <div style={{ width: '100%' }}>
            {/* Page Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>Absensi Kelas</h1>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Daftar hadir pertemuan — klik RTM untuk mengisi presensi</p>
            </div>

            {/* Filter Card */}
            <div style={{
                background: 'white', borderRadius: 4, border: '1px solid #e2e8f0',
                padding: 20, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 280 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                            Pilih Jadwal Pelajaran
                        </label>
                        <select
                            value={selectedScheduleId}
                            onChange={handleScheduleChange}
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 3,
                                border: '1px solid #d1d5db', fontSize: 14, color: '#1e293b',
                                background: 'white', cursor: 'pointer', outline: 'none',
                            }}
                        >
                            <option value="">-- Pilih Jadwal --</option>
                            {schedules.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.subject?.name} | {s.classroom?.name} | {s.day} {s.lesson_hour?.start_time?.substring(0, 5)}–{s.lesson_hour?.end_time?.substring(0, 5)} | {s.teacher?.user?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {loading && (
                        <div style={{ color: '#6366f1', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25" />
                                <path d="M21 12a9 9 0 00-9-9" />
                            </svg>
                            Memuat data...
                        </div>
                    )}
                </div>
            </div>

            {/* Info Cards */}
            {selectedSchedule && (
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 12, marginBottom: 20,
                }}>
                    {[
                        { label: 'Mata Pelajaran', value: selectedSchedule.subject?.name, icon: '📚' },
                        { label: 'Kelas', value: selectedSchedule.classroom?.name, icon: '🏫' },
                        { label: 'Dosen/Guru', value: selectedSchedule.teacher?.user?.name, icon: '👨‍🏫' },
                        { label: 'Hari/Jam', value: `${selectedSchedule.day} ${selectedSchedule.lesson_hour?.start_time?.substring(0, 5)}–${selectedSchedule.lesson_hour?.end_time?.substring(0, 5)}`, icon: '🕐' },
                        { label: 'Jumlah Siswa', value: `${matrixData?.students?.length || 0} siswa`, icon: '👥' },
                        { label: 'RTM Terisi', value: `${meetings.length} / ${totalMeetings}`, icon: '✅' },
                    ].map((info, i) => (
                        <div key={i} style={{
                            background: 'white', borderRadius: 4, padding: '12px 16px',
                            border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{info.icon}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{info.label}</div>
                            <div style={{ fontSize: 14, color: '#1e293b', fontWeight: 600, marginTop: 2 }}>{info.value || '-'}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Legend */}
            {selectedSchedule && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Keterangan:</span>
                    {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
                        <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 20, height: 20, borderRadius: 2, background: cfg.bg, border: `1px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: cfg.text }}>
                                {cfg.label}
                            </div>
                            <span style={{ fontSize: 12, color: '#64748b' }}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 2, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#94a3b8' }}>-</div>
                        <span style={{ fontSize: 12, color: '#64748b' }}>Belum diisi</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#6366f1', marginLeft: 'auto', fontStyle: 'italic' }}>💡 Klik header RTM untuk mengisi presensi pertemuan</span>
                </div>
            )}

            {/* Matrix Table */}
            {matrixData && (
                <div style={{
                    background: 'white', borderRadius: 4, border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden',
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                            <thead>
                                {/* Row 1: group headers */}
                                <tr>
                                    <th rowSpan={2} style={{
                                        padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700,
                                        color: '#475569', background: '#f1f5f9', borderBottom: '2px solid #e2e8f0',
                                        borderRight: '1px solid #e2e8f0', width: 40,
                                    }}>No</th>
                                    <th rowSpan={2} style={{
                                        padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700,
                                        color: '#475569', background: '#f1f5f9', borderBottom: '2px solid #e2e8f0',
                                        borderRight: '1px solid #e2e8f0', minWidth: 120,
                                    }}>NPM / NIS</th>
                                    <th rowSpan={2} style={{
                                        padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700,
                                        color: '#475569', background: '#f1f5f9', borderBottom: '2px solid #e2e8f0',
                                        borderRight: '2px solid #6366f1', minWidth: 180,
                                    }}>Mahasiswa / Siswa</th>
                                    <th colSpan={totalMeetings} style={{
                                        padding: '10px 16px', textAlign: 'center', fontSize: 12, fontWeight: 700,
                                        color: 'white', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderBottom: '1px solid #5a67d8', borderRight: '2px solid #e2e8f0',
                                    }}>
                                        {totalMeetings} Rencana Tatap Muka (RTM)
                                    </th>
                                    <th colSpan={4} style={{
                                        padding: '10px 16px', textAlign: 'center', fontSize: 12, fontWeight: 700,
                                        color: 'white', background: '#0f172a',
                                        borderBottom: '1px solid #1e293b',
                                    }}>Kehadiran</th>
                                    <th rowSpan={2} style={{
                                        padding: '12px 8px', textAlign: 'center', fontSize: 12, fontWeight: 700,
                                        color: '#475569', background: '#f1f5f9', borderBottom: '2px solid #e2e8f0',
                                        minWidth: 70,
                                    }}>Total (%)</th>
                                </tr>
                                {/* Row 2: RTM numbers + stat headers */}
                                <tr>
                                    {displayMeetings.map((m) => {
                                        const hasData = !!m.id;
                                        return (
                                            <th
                                                key={m.meeting_number}
                                                onClick={() => m.id && handleMeetingClick(m)}
                                                style={{
                                                    padding: '6px 4px', textAlign: 'center', fontSize: 10,
                                                    fontWeight: 700, borderBottom: '2px solid #e2e8f0',
                                                    borderRight: '1px solid #f1f5f9', minWidth: 36,
                                                    background: hasData ? '#ede9fe' : '#f8fafc',
                                                    color: hasData ? '#6d28d9' : '#cbd5e1',
                                                    cursor: hasData ? 'pointer' : 'default',
                                                    transition: 'background 0.15s',
                                                    userSelect: 'none',
                                                }}
                                                title={hasData ? `RTM ${m.meeting_number}: ${m.planned_date} — klik untuk isi presensi` : `RTM ${m.meeting_number}: belum ada data`}
                                            >
                                                <div style={{ fontSize: 9, opacity: 0.7 }}>ke-{m.meeting_number}</div>
                                                {m.planned_date ? (
                                                    <div style={{ fontSize: 9, fontWeight: 500, marginTop: 1 }}>
                                                        {m.planned_date.substring(5).replace('-', '/')}
                                                    </div>
                                                ) : <div style={{ fontSize: 9 }}>—</div>}
                                            </th>
                                        );
                                    })}
                                    {['H', 'I', 'S', 'A'].map((s, i) => (
                                        <th key={s} style={{
                                            padding: '6px 8px', textAlign: 'center', fontSize: 11, fontWeight: 700,
                                            borderBottom: '2px solid #e2e8f0',
                                            color: Object.values(STATUS_CONFIG)[i].text,
                                            background: Object.values(STATUS_CONFIG)[i].bg,
                                            minWidth: 36,
                                        }}>{s}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {matrixData.students.map((student, i) => {
                                    const totalFilled = student.hadir + student.izin + student.sakit + student.alpa;
                                    return (
                                        <tr key={student.student_id} style={{
                                            background: i % 2 === 0 ? 'white' : '#fafafa',
                                            borderBottom: '1px solid #f1f5f9',
                                            transition: 'background 0.1s',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                                            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
                                        >
                                            <td style={{ padding: '8px 16px', fontSize: 12, color: '#94a3b8', borderRight: '1px solid #f1f5f9' }}>{i + 1}</td>
                                            <td style={{ padding: '8px 16px', fontSize: 11, color: '#475569', fontFamily: 'monospace', borderRight: '1px solid #f1f5f9' }}>{student.nis || '-'}</td>
                                            <td style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b', borderRight: '2px solid #6366f130', whiteSpace: 'nowrap' }}>{student.name}</td>
                                            {displayMeetings.map((m) => {
                                                const status = student.meetings[m.meeting_number] ?? null;
                                                return (
                                                    <td key={m.meeting_number} style={{ padding: '4px', textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
                                                        <StatusBadge
                                                            status={status}
                                                            meetingNumber={m.meeting_number}
                                                            isClickable={!!m.id}
                                                            onClick={() => m.id && handleMeetingClick(m)}
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#22c55e', background: '#f0fdf4' }}>{student.hadir}</td>
                                            <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#3b82f6', background: '#eff6ff' }}>{student.izin}</td>
                                            <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#f59e0b', background: '#fffbeb' }}>{student.sakit}</td>
                                            <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#ef4444', background: '#fef2f2' }}>{student.alpa}</td>
                                            <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                                                {student.total_pct !== null ? (
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                        padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 700,
                                                        background: student.total_pct >= 75 ? '#dcfce7' : student.total_pct >= 50 ? '#fef3c7' : '#fee2e2',
                                                        color: student.total_pct >= 75 ? '#15803d' : student.total_pct >= 50 ? '#b45309' : '#b91c1c',
                                                    }}>
                                                        {student.total_pct}%
                                                    </span>
                                                ) : <span style={{ color: '#cbd5e1', fontSize: 11 }}>—</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {matrixData.students.length === 0 && (
                                    <tr><td colSpan={3 + totalMeetings + 5} style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 14 }}>
                                        Tidak ada siswa terdaftar di kelas ini.
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!selectedScheduleId && !loadingSchedules && (
                <div style={{
                    background: 'white', borderRadius: 4, border: '1px solid #e2e8f0',
                    padding: 60, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                    <h3 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: 18 }}>Pilih Jadwal Pelajaran</h3>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: 14 }}>Pilih jadwal di atas untuk menampilkan daftar hadir matrix.</p>
                </div>
            )}

            {/* Modal */}
            {modal && (
                <MeetingModal
                    meeting={modal.meeting}
                    students={matrixData.students}
                    initialData={modal.currentData}
                    onClose={() => setModal(null)}
                    onSave={() => loadMatrix(selectedScheduleId)}
                />
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AttendanceManager;
