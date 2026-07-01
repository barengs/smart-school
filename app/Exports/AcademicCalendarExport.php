<?php

namespace App\Exports;

use App\Models\AcademicCalendar;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AcademicCalendarExport implements FromCollection, WithHeadings, WithMapping
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
                (object)[
                    'title' => 'Ujian Akhir Semester',
                    'description' => 'Ujian akhir semester ganjil tahun ajaran ini.',
                    'start_date' => date('Y-m-d', strtotime('+1 week')),
                    'end_date' => date('Y-m-d', strtotime('+2 weeks')),
                    'type' => 'exam', // general, holiday, exam, activity
                ]
            ]);
        }
        return AcademicCalendar::all();
    }

    public function headings(): array
    {
        return [
            'Nama Kegiatan (title)',
            'Deskripsi (description)',
            'Tanggal Mulai (start_date) YYYY-MM-DD',
            'Tanggal Selesai (end_date) YYYY-MM-DD',
            'Jenis (type) -> general, holiday, exam, activity',
        ];
    }

    public function map($calendar): array
    {
        return [
            $calendar->title,
            $calendar->description,
            $calendar->start_date,
            $calendar->end_date,
            $calendar->type,
        ];
    }
}
