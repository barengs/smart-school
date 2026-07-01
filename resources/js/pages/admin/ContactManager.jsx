import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { DataTable } from '../../components/DataTable';
import { TableSkeleton } from '../../components/TableSkeleton';

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [initialized, setInitialized] = useState(false);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/contacts');
            setContacts(response.data || []);
            setInitialized(true);
        } catch (error) {
            toast.error('Gagal memuat data kontak');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialized) {
            fetchContacts();
        }
    }, [initialized]);

    const handleView = async (id) => {
        try {
            const response = await axios.get(`/contacts/${id}`);
            setSelectedContact(response.data);
            // Refresh list to update status if it was 'new'
            fetchContacts();
        } catch (error) {
            toast.error('Gagal memuat detail pesan');
        }
    };

    const handleExport = async () => {
        try {
            const toastId = toast.loading('Memproses export Excel...');
            const response = await axios.get('/contacts/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Layanan_Publik_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.dismiss(toastId);
            toast.success('Berhasil mendownload Excel');
        } catch (error) {
            toast.dismiss();
            toast.error('Gagal melakukan export Excel');
        }
    };

    const columns = [
        {
            accessorKey: 'created_at',
            header: 'Tanggal',
            cell: info => <span className="text-sm text-gray-500">{new Date(info.getValue()).toLocaleDateString('id-ID')}</span>
        },
        {
            accessorKey: 'name',
            header: 'Nama',
            cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>
        },
        {
            accessorKey: 'subject',
            header: 'Subjek',
            cell: info => <span className="text-sm text-gray-500">{info.getValue()}</span>
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => {
                const status = info.getValue();
                return (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        status === 'new' ? 'bg-blue-100 text-blue-800' : 
                        status === 'read' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {status === 'new' ? 'Baru' : status === 'read' ? 'Dibaca' : 'Dibalas'}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="w-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Layanan Publik (Kontak & Aduan)</h1>
                    <p className="font-body-md text-on-surface-variant mt-1">Kelola pesan dan aduan dari pengguna publik.</p>
                </div>
            </div>
            
            <div className="relative">
                {loading && !initialized ? (
                    <TableSkeleton />
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={contacts} 
                        searchPlaceholder="Cari kontak atau aduan..."
                        onRowClick={(row) => handleView(row.id)}
                        onExport={handleExport}
                    />
                )}
            </div>

            {/* Modal Detail */}
            {selectedContact && (
                <div className="fixed z-50 inset-0 flex items-center justify-center p-4 sm:p-0">
                    <div className="absolute inset-0 bg-gray-900/75 transition-opacity" onClick={() => setSelectedContact(null)}></div>
                    <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-xl w-full max-w-lg">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-bold text-gray-900 border-b pb-2 mb-4">
                                Detail Pesan
                            </h3>
                            <div>
                                <p className="text-sm text-gray-700 mb-2"><strong>Dari:</strong> {selectedContact.name} ({selectedContact.email})</p>
                                <p className="text-sm text-gray-700 mb-2"><strong>Tanggal:</strong> {new Date(selectedContact.created_at).toLocaleString('id-ID')}</p>
                                <p className="text-sm text-gray-700 mb-4"><strong>Subjek:</strong> {selectedContact.subject}</p>
                                <div className="bg-surface-container-lowest p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap border border-outline-variant max-h-64 overflow-y-auto">
                                    {selectedContact.message}
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container px-4 py-3 sm:px-6 flex flex-row-reverse gap-2 border-t border-outline-variant">
                            <button 
                                type="button" 
                                className="inline-flex justify-center rounded-md px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary/90"
                                onClick={() => setSelectedContact(null)}
                            >
                                Tutup
                            </button>
                            <button 
                                type="button" 
                                className="inline-flex justify-center rounded-md border border-outline-variant px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-surface-container-lowest"
                                onClick={() => {
                                    window.location.href = `mailto:${selectedContact.email}?subject=RE: ${selectedContact.subject}`;
                                }}
                            >
                                Balas via Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactManager;
