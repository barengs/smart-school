import React from 'react';

const NewsManager = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="relative w-64">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400"></i>
                        <input type="text" placeholder="Cari berita..." className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="flex space-x-3">
                        <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 flex items-center">
                            <i className="fa-solid fa-filter mr-2"></i> Filter
                        </button>
                        <button className="bg-[#1e40af] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 flex items-center">
                            <i className="fa-solid fa-plus mr-2"></i> Tambah Berita
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-4">Judul Berita</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Penulis</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900">Pendaftaran Mahasiswa Baru Tahun 2024 Dibuka</p>
                                    <p className="text-xs text-gray-500 mt-1">12 Okt 2023, 08:00 WIB</p>
                                </td>
                                <td className="px-6 py-4">Pengumuman</td>
                                <td className="px-6 py-4 flex items-center mt-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold mr-2">AB</div>
                                    Admin Bagian
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Published</span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3 text-gray-400">
                                    <button className="hover:text-blue-600"><i className="fa-solid fa-pen-to-square"></i></button>
                                    <button className="hover:text-red-600"><i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900">Jadwal Ujian Akhir Semester Ganjil 2023/2024</p>
                                    <p className="text-xs text-gray-500 mt-1">15 Okt 2023, 14:30 WIB</p>
                                </td>
                                <td className="px-6 py-4">Akademik</td>
                                <td className="px-6 py-4 flex items-center mt-2">
                                    <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-xs flex items-center justify-center font-bold mr-2">SA</div>
                                    Staf Akademik
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">Pending</span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3 text-gray-400">
                                    <button className="hover:text-green-600" title="Approve"><i className="fa-solid fa-circle-check"></i></button>
                                    <button className="hover:text-blue-600"><i className="fa-solid fa-pen-to-square"></i></button>
                                    <button className="hover:text-red-600"><i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600 bg-gray-50">
                    <div>Menampilkan <span className="font-bold">1</span> sampai <span className="font-bold">2</span> dari <span className="font-bold">45</span> berita</div>
                    <div className="flex space-x-1">
                        <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">Sebelumnya</button>
                        <button className="px-3 py-1 border border-blue-600 bg-blue-600 text-white rounded">1</button>
                        <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">Selanjutnya</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsManager;
