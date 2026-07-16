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

        $moduleIds = [];
        foreach ($modules as $module) {
            $m = Module::firstOrCreate(['code' => $module['code']], $module);
            $moduleIds[] = $m->id;
        }

        // Create default Service package
        $service = \App\Models\Service::firstOrCreate(
            ['code' => 'MASTER'],
            ['name' => 'Paket Master Sekolah', 'description' => 'Paket lengkap dengan semua modul aktif.']
        );
        $service->modules()->sync($moduleIds);

        // Assign to SchoolProfile
        $profile = \App\Models\SchoolProfile::first();
        if ($profile) {
            $profile->update(['service_id' => $service->id]);
        }
    }
}
