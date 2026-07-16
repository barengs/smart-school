<?php

namespace App\Imports;

use App\Models\Classroom;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ClassroomImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return Classroom::updateOrCreate(
            [
                'name' => $row['nama_kelas'] ?? $row['nama'],
                'academic_year_id' => $row['id_tahun_ajaran'] ?? $row['tahun_ajaran_id']
            ],
            [
                'level' => $row['tingkat'] ?? null
            ]
        );
    }
}
