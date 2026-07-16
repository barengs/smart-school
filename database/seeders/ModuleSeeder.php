<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            [
                'code' => 'AKADEMIK',
                'name' => 'Modul Akademik',
                'description' => 'Manajemen kegiatan belajar mengajar seperti mata pelajaran, jadwal, absensi, dan data siswa/guru.'
            ],
            [
                'code' => 'PPDB',
                'name' => 'Modul PPDB',
                'description' => 'Sistem Penerimaan Peserta Didik Baru (PPDB) termasuk gelombang pendaftaran, jalur, dan berkas persyaratan.'
            ],
            [
                'code' => 'BERITA',
                'name' => 'Modul Berita',
                'description' => 'Manajemen publikasi artikel, berita, dan kategori pada halaman portal publik.'
            ]
        ];

        foreach ($modules as $module) {
            Module::firstOrCreate(['code' => $module['code']], $module);
        }
    }
}
