import React, { useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

export function DataTable({
    columns,
    data,
    searchPlaceholder = "Cari...",
    onAdd,
    addLabel = "Tambah Data",
    onExport,
    onRowClick
}) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 border border-outline-variant rounded px-3 py-2 w-full md:w-64">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
                    <input
                        type="text"
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    {onExport && (
                        <button
                            onClick={onExport}
                            className="w-full md:w-auto px-4 py-2 bg-[#047857] text-white rounded font-label-md hover:bg-[#047857]/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Export
                        </button>
                    )}
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="w-full md:w-auto px-4 py-2 bg-primary text-on-primary rounded font-label-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            {addLabel}
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-on-surface">
                    <thead className="bg-surface-container-low text-on-surface-variant font-label-md border-b border-outline-variant uppercase text-xs">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 cursor-pointer hover:bg-surface-container transition-colors"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: <span className="material-symbols-outlined text-[14px]">arrow_upward</span>,
                                                desc: <span className="material-symbols-outlined text-[14px]">arrow_downward</span>,
                                            }[header.column.getIsSorted()] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-outline-variant/50">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} onClick={() => onRowClick && onRowClick(row.original)} className={`hover:bg-surface-container-lowest/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-on-surface-variant">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className="bg-surface-container border border-outline-variant rounded px-2 py-1 outline-none"
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Tampil {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="p-1 rounded hover:bg-surface-container disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span>
                        Halaman <span className="font-bold text-on-surface">{table.getState().pagination.pageIndex + 1}</span> dari{' '}
                        {table.getPageCount()}
                    </span>
                    <button
                        className="p-1 rounded hover:bg-surface-container disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
