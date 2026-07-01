<?php

namespace App\Imports;

use App\Models\AcademicCalendar;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Carbon\Carbon;

class AcademicCalendarImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Skip empty rows
        if (empty($row['nama_kegiatan_title'])) {
            return null;
        }

        // Validate type
        $type = strtolower($row['jenis_type_general_holiday_exam_activity'] ?? 'general');
        $validTypes = ['general', 'holiday', 'exam', 'activity'];
        if (!in_array($type, $validTypes)) {
            $type = 'general';
        }
        
        $startDate = null;
        $endDate = null;

        // Ensure dates are parsed correctly
        try {
             // Maatwebsite Excel might return excel serial date or string depending on format
            if(is_numeric($row['tanggal_mulai_start_date_yyyy_mm_dd'])){
                $startDate = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['tanggal_mulai_start_date_yyyy_mm_dd'])->format('Y-m-d');
            } else {
                $startDate = Carbon::parse($row['tanggal_mulai_start_date_yyyy_mm_dd'])->format('Y-m-d');
            }

            if (!empty($row['tanggal_selesai_end_date_yyyy_mm_dd'])) {
                if(is_numeric($row['tanggal_selesai_end_date_yyyy_mm_dd'])){
                    $endDate = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['tanggal_selesai_end_date_yyyy_mm_dd'])->format('Y-m-d');
                } else {
                    $endDate = Carbon::parse($row['tanggal_selesai_end_date_yyyy_mm_dd'])->format('Y-m-d');
                }
            } else {
                $endDate = clone Carbon::parse($startDate);
            }
        } catch (\Exception $e) {
            // Ignore invalid date rows or set to null/skip
            return null;
        }

        return new AcademicCalendar([
            'title'       => $row['nama_kegiatan_title'],
            'description' => $row['deskripsi_description'] ?? null,
            'start_date'  => $startDate,
            'end_date'    => $endDate,
            'type'        => $type,
        ]);
    }
}
