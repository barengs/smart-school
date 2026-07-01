<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\PpdbBatch;
use App\Models\PpdbPath;
use App\Models\PpdbDocumentRequirement;
use Illuminate\Database\Seeder;

class PpdbMasterSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tahun Ajaran
        $academicYear = AcademicYear::firstOrCreate(
            ['name' => '2026/2027'],
            ['is_active' => true]
        );

        // 2. Gelombang
        PpdbBatch::firstOrCreate(
            ['name' => 'Gelombang 1'],
            [
                'academic_year_id' => $academicYear->id,
                'start_date' => now()->startOfDay(),
                'end_date' => now()->addMonths(2)->endOfDay(),
                'quota' => 200,
                'is_active' => true,
            ]
        );

        // 3. Jalur
        $paths = [
            ['name' => 'Zonasi', 'description' => 'Jalur penerimaan berdasarkan domisili terdekat.'],
            ['name' => 'Prestasi', 'description' => 'Jalur penerimaan berdasarkan prestasi akademik atau non-akademik.'],
            ['name' => 'Afirmasi', 'description' => 'Jalur penerimaan untuk keluarga kurang mampu.'],
            ['name' => 'Perpindahan Tugas Orang Tua', 'description' => 'Jalur untuk anak guru atau perpindahan tugas dinas.'],
        ];

        foreach ($paths as $path) {
            PpdbPath::firstOrCreate(['name' => $path['name']], $path);
        }

        // 4. Dokumen Persyaratan
        $docs = [
            ['name' => 'Ijazah / Surat Keterangan Lulus (SKL)', 'is_required' => true, 'description' => 'Scan dokumen asli.'],
            ['name' => 'Kartu Keluarga (KK)', 'is_required' => true, 'description' => 'Scan KK asli.'],
            ['name' => 'Akta Kelahiran', 'is_required' => true, 'description' => 'Scan Akta asli.'],
            ['name' => 'Sertifikat Lomba', 'is_required' => false, 'description' => 'Khusus pendaftar jalur Prestasi.'],
        ];

        foreach ($docs as $doc) {
            PpdbDocumentRequirement::firstOrCreate(['name' => $doc['name']], $doc);
        }
    }
}
