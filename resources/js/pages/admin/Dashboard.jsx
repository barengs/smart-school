import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ikhtisar Sistem</h1>
                    <p className="text-sm text-gray-500 mt-1">Pantau pendaftaran PPDB, berita, dan aktivitas pengguna.</p>
                </div>
                <button className="bg-[#112240] text-white px-4 py-2 rounded shadow hover:bg-[#0a192f] transition flex items-center font-medium text-sm">
                    <i className="fa-solid fa-download mr-2"></i> Unduh Laporan
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-users text-lg"></i>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Total Pendaftar (PPDB)</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1 mb-2">1,248</h3>
                    <div className="flex items-center text-xs">
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded font-medium flex items-center">
                            <i className="fa-solid fa-arrow-trend-up mr-1"></i> +12% bulan ini
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-bullhorn text-lg"></i>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Berita Dipublikasi</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1 mb-2">84</h3>
                    <p className="text-xs text-gray-500">5 draft menunggu</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-user-group text-lg"></i>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Total Pengguna</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1 mb-2">3,492</h3>
                    <div className="flex items-center text-xs">
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded font-medium flex items-center">
                            <i className="fa-solid fa-arrow-trend-up mr-1"></i> +2% bulan ini
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-shield-halved text-lg"></i>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Peran Aktif</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1 mb-2">12</h3>
                    <p className="text-xs text-gray-500">Sistem normal</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-gray-900">Statistik Pendaftaran PPDB</h3>
                        <div className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded">Tahun 2024</div>
                    </div>
                    <div className="h-64 bg-gray-50 rounded border border-gray-100 flex items-end justify-around p-4 relative">
                        {/* Mock Chart Bars */}
                        <div className="w-1/6 bg-blue-300 h-1/3 rounded-t"></div>
                        <div className="w-1/6 bg-blue-400 h-1/2 rounded-t"></div>
                        <div className="w-1/6 bg-blue-500 h-2/3 rounded-t"></div>
                        <div className="w-1/6 bg-yellow-600 h-full rounded-t"></div>
                        <div className="w-1/6 bg-blue-300 h-1/3 rounded-t"></div>
                    </div>
                    <div className="flex justify-around mt-4 text-xs font-medium text-gray-500">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-0 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-base font-bold text-gray-900">Aktivitas Terbaru</h3>
                        <a href="#" className="text-xs text-blue-600 font-medium">Lihat Semua</a>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="p-4 border-b border-gray-50 flex items-start">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                                <i className="fa-regular fa-user text-xs"></i>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800"><span className="font-bold">Budi Santoso</span> mendaftar via PPDB Online.</p>
                                <p className="text-xs text-gray-500 mt-1">10 menit yang lalu</p>
                            </div>
                        </div>
                        <div className="p-4 border-b border-gray-50 flex items-start">
                            <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                                <i className="fa-regular fa-file-lines text-xs"></i>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800">Draft berita <span className="font-bold">"Jadwal Ujian Nasional"</span> menunggu persetujuan.</p>
                                <p className="text-xs text-gray-500 mt-1">1 jam yang lalu</p>
                            </div>
                        </div>
                        <div className="p-4 border-b border-gray-50 flex items-start">
                            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                                <i className="fa-solid fa-user-shield text-xs"></i>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800">Peran <span className="font-bold">Editor</span> diperbarui oleh Admin.</p>
                                <p className="text-xs text-gray-500 mt-1">Kemarin, 14:30</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
