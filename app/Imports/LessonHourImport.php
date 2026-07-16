<?php

namespace App\Imports;

use App\Models\LessonHour;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Carbon\Carbon;

class LessonHourImport implements ToModel, WithStartRow
{
    public function startRow(): int
    {
        return 2;
    }

    public function model(array $row)
    {
        if (!isset($row[0])) {
            return null;
        }

        return new LessonHour([
            'name' => $row[0],
            'start_time' => $this->parseTime($row[1]),
            'end_time' => $this->parseTime($row[2]),
        ]);
    }

    private function parseTime($value)
    {
        if (is_numeric($value)) {
            return Date::excelToDateTimeObject($value)->format('H:i');
        }
        return $value;
    }
}
