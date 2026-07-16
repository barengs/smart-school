<?php

namespace App\Exports;

use App\Models\Subject;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SubjectExport implements FromCollection, WithHeadings, WithMapping
{
    public $isTemplate;

    public function __construct($isTemplate = false)
    {
        $this->isTemplate = $isTemplate;
    }

    public function collection()
    {
        return $this->isTemplate ? collect([new Subject()]) : Subject::all();
    }

    public function headings(): array
    {
        return ['Kode Mata Pelajaran', 'Nama Mata Pelajaran'];
    }

    public function map($subject): array
    {
        if ($this->isTemplate) {
            return ['MTK01', 'Matematika'];
        }
        return [
            $subject->code,
            $subject->name
        ];
    }
}
