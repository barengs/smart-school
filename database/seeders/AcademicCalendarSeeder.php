<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicCalendarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\AcademicCalendar::create([
            'title' => 'Tahun Ajaran Baru',
            'description' => 'Hari pertama sekolah',
            'start_date' => date('Y-m-d', strtotime('+1 week')),
            'type' => 'general'
        ]);

        \App\Models\AcademicCalendar::create([
            'title' => 'Ujian Tengah Semester',
            'start_date' => date('Y-m-d', strtotime('+1 month')),
            'end_date' => date('Y-m-d', strtotime('+1 month 7 days')),
            'type' => 'holiday'
        ]);
    }
}
