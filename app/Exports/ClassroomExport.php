<?php

namespace App\Exports;

use App\Models\Classroom;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ClassroomExport implements FromCollection, WithHeadings, WithMapping
{
    public $isTemplate;

    public function __construct($isTemplate = false)
    {
        $this->isTemplate = $isTemplate;
    }

    public function collection()
    {
        return $this->isTemplate ? collect([new Classroom()]) : Classroom::with('academicYear')->get();
    }

    public function headings(): array
    {
        return ['Nama Kelas', 'Tingkat', 'ID Tahun Ajaran'];
    }

    public function map($classroom): array
    {
        if ($this->isTemplate) {
            return ['10A', '10', '1'];
        }
        return [
            $classroom->name,
            $classroom->level,
            $classroom->academic_year_id
        ];
    }
}
