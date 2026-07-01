import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const [data, setData] = useState({
        stats: {
            total_ppdb: 0,
            news_published: 0,
            news_drafts: 0,
            total_users: 0,
            active_roles: 0
        },
        chart: [],
        recent_activities: []
    });
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear().toString());

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/dashboard?year=${year}`);
            setData(response.data);
        } catch (error) {
            toast.error('Gagal memuat data dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [year]);

    const handleDownloadReport = async () => {
        try {
            const toastId = toast.loading('Menyiapkan laporan...');
            const response = await axios.get(`/dashboard/export?year=${year}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Dashboard_Report_${year}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Laporan berhasil diunduh', { id: toastId });
        } catch (error) {
            toast.error('Gagal mengunduh laporan');
        }
    };

    // Find max chart value for scaling bars
    const maxChartValue = Math.max(...data.chart.map(item => item.count), 10);

    return (
        <>
            <div className="flex items-center justify-between mb-stack-lg">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-background">Ikhtisar Sistem</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Pantau pendaftaran PPDB, berita, dan aktivitas pengguna.</p>
                </div>
                <button 
                    onClick={handleDownloadReport}
                    className="px-4 py-2 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Unduh Laporan
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack-md mb-stack-lg">
                {/* Stat Card 1 */}
                <Link to="/admin/ppdb" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex items-start gap-stack-md hover:bg-surface-container-low transition-colors cursor-pointer shadow-sm hover:shadow">
                    <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined icon-fill">how_to_reg</span>
                    </div>
                    <div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Total Pendaftar (PPDB)</p>
                        <h3 className="font-headline-md text-headline-md text-on-background mt-1">
                            {loading ? '...' : data.stats.total_ppdb}
                        </h3>
                    </div>
                </Link>

                {/* Stat Card 2 */}
                <Link to="/admin/news" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex items-start gap-stack-md hover:bg-surface-container-low transition-colors cursor-pointer shadow-sm hover:shadow">
                    <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                        <span className="material-symbols-outlined icon-fill">campaign</span>
                    </div>
                    <div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Berita Dipublikasi</p>
                        <h3 className="font-headline-md text-headline-md text-on-background mt-1">
                            {loading ? '...' : data.stats.news_published}
                        </h3>
                        <div className="flex items-center gap-1 text-[12px] font-medium text-on-surface-variant mt-1">
                            {data.stats.news_drafts} draft menunggu
                        </div>
                    </div>
                </Link>

                {/* Stat Card 3 */}
                <Link to="/admin/rbac" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex items-start gap-stack-md hover:bg-surface-container-low transition-colors cursor-pointer shadow-sm hover:shadow">
                    <div className="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                        <span className="material-symbols-outlined icon-fill">group</span>
                    </div>
                    <div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Total Pengguna</p>
                        <h3 className="font-headline-md text-headline-md text-on-background mt-1">
                            {loading ? '...' : data.stats.total_users}
                        </h3>
                    </div>
                </Link>

                {/* Stat Card 4 */}
                <Link to="/admin/rbac" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex items-start gap-stack-md hover:bg-surface-container-low transition-colors cursor-pointer shadow-sm hover:shadow">
                    <div className="w-12 h-12 rounded-lg bg-error-container flex items-center justify-center text-on-error-container shrink-0">
                        <span className="material-symbols-outlined icon-fill">admin_panel_settings</span>
                    </div>
                    <div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Peran Aktif</p>
                        <h3 className="font-headline-md text-headline-md text-on-background mt-1">
                            {loading ? '...' : data.stats.active_roles}
                        </h3>
                    </div>
                </Link>
            </div>

            {/* Complex Grid: Analytics & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
                {/* Analytics Chart Placeholder (Col Span 2) */}
                <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg flex flex-col">
                    <div className="flex items-center justify-between mb-stack-md">
                        <h3 className="font-label-md text-label-md text-on-background">Statistik Pendaftaran PPDB</h3>
                        <select 
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="bg-surface-container border border-outline-variant rounded px-2 py-1 font-body-sm text-body-sm text-on-surface outline-none focus:border-primary"
                        >
                            <option value="2026">Tahun 2026</option>
                            <option value="2025">Tahun 2025</option>
                            <option value="2024">Tahun 2024</option>
                            <option value="2023">Tahun 2023</option>
                        </select>
                    </div>
                    {/* Decorative Chart Area */}
                    <div className="flex-1 w-full bg-surface-container-low rounded-lg relative overflow-hidden min-h-[300px] flex items-end p-4 gap-2">
                        {data.chart.map((item, index) => {
                            const heightPercent = maxChartValue > 0 ? (item.count / maxChartValue) * 100 : 0;
                            // Generate different shades/colors based on index for variety
                            const colorClasses = [
                                'bg-primary/20 hover:bg-primary/30',
                                'bg-primary/40 hover:bg-primary/50',
                                'bg-primary/60 hover:bg-primary/70',
                                'bg-secondary hover:bg-secondary/90',
                                'bg-primary/30 hover:bg-primary/40',
                                'bg-primary/50 hover:bg-primary/60',
                                'bg-secondary/70 hover:bg-secondary/80',
                                'bg-primary hover:bg-primary/90',
                                'bg-primary/40 hover:bg-primary/50',
                                'bg-tertiary/60 hover:bg-tertiary/70',
                                'bg-secondary/40 hover:bg-secondary/50',
                                'bg-primary/70 hover:bg-primary/80',
                            ];
                            const barColor = colorClasses[index % colorClasses.length];

                            return (
                                <div key={item.month} className={`flex-1 ${barColor} transition-colors rounded-t-sm relative group min-h-[4px]`} style={{ height: `${heightPercent}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        {item.month}: {item.count}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-2 px-2 font-body-sm text-[12px] text-on-surface-variant">
                        {data.chart.map(item => (
                            <span key={item.month} className="flex-1 text-center truncate">{item.month}</span>
                        ))}
                    </div>
                </div>

                {/* Recent Activity List (Col Span 1) */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col max-h-[420px]">
                    <div className="p-stack-md border-b border-outline-variant flex items-center justify-between shrink-0">
                        <h3 className="font-label-md text-label-md text-on-background">Aktivitas Terbaru</h3>
                    </div>
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        {loading && data.recent_activities.length === 0 ? (
                            <div className="p-stack-md text-center text-sm text-on-surface-variant">Memuat...</div>
                        ) : data.recent_activities.length === 0 ? (
                            <div className="p-stack-md text-center text-sm text-on-surface-variant">Tidak ada aktivitas.</div>
                        ) : (
                            data.recent_activities.map((activity, index) => {
                                // Determine colors based on activity color tag
                                const colorClass = 
                                    activity.color === 'primary' ? 'bg-primary-fixed text-primary' :
                                    activity.color === 'secondary' ? 'bg-secondary-fixed text-secondary' :
                                    activity.color === 'tertiary' ? 'bg-tertiary-fixed text-tertiary' :
                                    'bg-error-container text-on-error-container';

                                return (
                                    <div key={index} className="p-stack-md border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors flex gap-stack-md items-start">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${colorClass}`}>
                                            <span className="material-symbols-outlined text-[16px]">{activity.icon}</span>
                                        </div>
                                        <div>
                                            <p className="font-body-sm text-body-sm text-on-background" dangerouslySetInnerHTML={{ __html: activity.title }}></p>
                                            <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                                                {new Date(activity.date).toLocaleString('id-ID', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
