import React from 'react';

const RoleMatrix = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Hak Akses & Navigasi Dinamis</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola matrix perizinan peran secara detail untuk setiap modul sistem.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div className="w-1/3">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Role</label>
                        <select className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option>PPDB Reviewer</option>
                            <option>Editor Berita</option>
                            <option>Super Admin</option>
                        </select>
                    </div>
                    <div className="flex space-x-3 mt-6">
                        <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">
                            Batal
                        </button>
                        <button className="bg-[#1e40af] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 flex items-center">
                            <i className="fa-solid fa-floppy-disk mr-2"></i> Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-600">
                        <tr>
                            <th className="px-6 py-4">Modul / Menu</th>
                            <th className="px-6 py-4 text-center w-24">Create</th>
                            <th className="px-6 py-4 text-center w-24">Read</th>
                            <th className="px-6 py-4 text-center w-24">Update</th>
                            <th className="px-6 py-4 text-center w-24">Delete</th>
                            <th className="px-6 py-4 text-center w-24">Approval</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="bg-gray-100/50">
                            <td colSpan="6" className="px-6 py-2 text-xs font-bold text-gray-500 uppercase">Master Data</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium flex items-center"><i className="fa-regular fa-user mr-3 text-gray-400"></i> Profil Sekolah</td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-gray-300 rounded border-gray-300" disabled /></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium flex items-center"><i className="fa-solid fa-user-group mr-3 text-gray-400"></i> Data Siswa</td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-gray-300 rounded border-gray-300" disabled /></td>
                        </tr>
                        <tr className="bg-gray-100/50">
                            <td colSpan="6" className="px-6 py-2 text-xs font-bold text-gray-500 uppercase">Penerimaan Peserta Didik Baru (PPDB)</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium flex items-center"><i className="fa-solid fa-user-pen mr-3 text-gray-400"></i> Pendaftaran</td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium flex items-center"><i className="fa-regular fa-file-lines mr-3 text-gray-400"></i> Verifikasi Berkas</td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                        </tr>
                        <tr className="bg-gray-100/50">
                            <td colSpan="6" className="px-6 py-2 text-xs font-bold text-gray-500 uppercase">Konten Website (CMS)</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium flex items-center"><i className="fa-solid fa-newspaper mr-3 text-gray-400"></i> Berita / Pengumuman</td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                            <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoleMatrix;
