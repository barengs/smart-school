<?php

namespace App\Exports;

use App\Models\OrganizationStructure;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class OrganizationExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    public $isTemplate = false;

    public function __construct($isTemplate = false)
    {
        $this->isTemplate = $isTemplate;
    }

    public function collection()
    {
        if ($this->isTemplate) {
            return collect([
                (object)[
                    'id' => null,
                    'name' => 'Contoh Nama 1',
                    'position' => 'Kepala Sekolah',
                    'parent_id' => null,
                    'order_number' => 1
                ],
                (object)[
                    'id' => null,
                    'name' => 'Contoh Nama 2',
                    'position' => 'Wakil Kepala Sekolah',
                    'parent_id' => 1, // Example parent ID
                    'order_number' => 2
                ]
            ]);
        }
        return OrganizationStructure::orderBy('order_number')->get();
    }

    public function headings(): array
    {
        return [
            'ID (Kosongkan jika input baru)',
            'Nama Lengkap',
            'Posisi / Jabatan',
            'ID Atasan (Opsional)',
            'Urutan'
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->name,
            $row->position,
            $row->parent_id,
            $row->order_number ?? 0
        ];
    }
}
