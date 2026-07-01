<?php

namespace App\Exports;

use App\Models\PpdbRegistration;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PpdbExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    private $rowNumber = 0;

    public function collection()
    {
        return PpdbRegistration::with(['batch', 'path'])->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'No. Pendaftaran',
            'Nama Lengkap',
            'NIK',
            'NISN',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Asal Sekolah',
            'Nama Ayah',
            'Pekerjaan Ayah',
            'Nama Ibu',
            'Pekerjaan Ibu',
            'No. Telepon / WA Orang Tua',
            'Gelombang',
            'Jalur',
            'Status',
            'Tanggal Daftar'
        ];
    }

    public function map($row): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $row->registration_number,
            $row->full_name,
            "'" . $row->nik, // Prepend quote to avoid scientific notation in excel
            "'" . ($row->nisn ?? '-'),
            $row->gender === 'L' ? 'Laki-Laki' : 'Perempuan',
            $row->place_of_birth ?? '-',
            $row->date_of_birth ?? '-',
            $row->previous_school ?? '-',
            $row->father_name ?? '-',
            $row->father_occupation ?? '-',
            $row->mother_name ?? '-',
            $row->mother_occupation ?? '-',
            "'" . ($row->parent_phone ?? $row->parent_phone_number ?? '-'),
            $row->batch->name ?? '-',
            $row->path->name ?? '-',
            $row->status,
            $row->created_at ? $row->created_at->format('d/m/Y H:i') : '-'
        ];
    }
}
