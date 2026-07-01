<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DashboardReportExport implements FromView, ShouldAutoSize, WithStyles, WithColumnWidths
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function view(): View
    {
        return view('exports.dashboard', [
            'data' => $this->data
        ]);
    }

    public function columnWidths(): array
    {
        return [
            'A' => 45,
            'B' => 50,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A:B')->getAlignment()->setWrapText(true);
        $sheet->getStyle('A:B')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        
        return [
            1 => ['font' => ['bold' => true, 'size' => 14]],
            'A1:B1' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            'A' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT]],
            'B' => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT]],
        ];
    }
}
