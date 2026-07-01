<?php

namespace App\Imports;

use App\Models\OrganizationStructure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Imports\HeadingRowFormatter;

HeadingRowFormatter::default('none'); // Keep exact heading casing

class OrganizationImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Headers match the ones defined in OrganizationExport
        $id = $row['ID (Kosongkan jika input baru)'] ?? null;
        $name = $row['Nama Lengkap'] ?? null;
        $position = $row['Posisi / Jabatan'] ?? null;
        $parentId = $row['ID Atasan (Opsional)'] ?? null;
        $order = $row['Urutan'] ?? 0;

        if (empty($name) || empty($position)) {
            return null; // Skip invalid rows
        }
        
        // Exclude dummy data if users didn't clear the template
        if ($name === 'Contoh Nama 1' || $name === 'Contoh Nama 2') {
            return null;
        }

        if ($id) {
            $org = OrganizationStructure::find($id);
            if ($org) {
                $org->update([
                    'name' => $name,
                    'position' => $position,
                    'parent_id' => $parentId ?: null,
                    'order_number' => $order
                ]);
                return null;
            }
        }

        return new OrganizationStructure([
            'name' => $name,
            'position' => $position,
            'parent_id' => $parentId ?: null,
            'order_number' => $order
        ]);
    }
}
