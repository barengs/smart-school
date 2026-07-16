<?php

namespace App\Exports;

use App\Models\LessonHour;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LessonHourExport implements FromCollection, WithHeadings
{
    protected $isTemplate;

    public function __construct($isTemplate = false)
    {
        $this->isTemplate = $isTemplate;
    }

    public function collection()
    {
        if ($this->isTemplate) {
            return collect([
                [
                    'name' => 'Jam ke-1',
                    'start_time' => '07:00',
                    'end_time' => '07:45',
                ],
            ]);
        }
        
        return LessonHour::select('name', 'start_time', 'end_time')->get();
    }

    public function headings(): array
    {
        return [
            'Nama Jam (Misal: Jam ke-1)',
            'Jam Mulai (HH:MM)',
            'Jam Selesai (HH:MM)'
        ];
    }
}
