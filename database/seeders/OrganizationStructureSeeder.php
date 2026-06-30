<?php

namespace Database\Seeders;

use App\Models\OrganizationStructure;
use Illuminate\Database\Seeder;

class OrganizationStructureSeeder extends Seeder
{
    public function run(): void
    {
        $kepsek = OrganizationStructure::create([
            'name' => 'Dr. Budi Santoso, M.Pd.',
            'position' => 'Kepala Sekolah',
            'order_number' => 1,
        ]);

        $wakasekKurikulum = OrganizationStructure::create([
            'name' => 'Siti Aminah, S.Pd., M.Si.',
            'position' => 'Wakil Kepala Sekolah Bid. Kurikulum',
            'parent_id' => $kepsek->id,
            'order_number' => 2,
        ]);

        $wakasekKesiswaan = OrganizationStructure::create([
            'name' => 'Drs. Ahmad Hidayat',
            'position' => 'Wakil Kepala Sekolah Bid. Kesiswaan',
            'parent_id' => $kepsek->id,
            'order_number' => 3,
        ]);

        OrganizationStructure::create([
            'name' => 'Ratna Dewi, S.Pd.',
            'position' => 'Guru Matematika',
            'parent_id' => $wakasekKurikulum->id,
            'order_number' => 4,
        ]);
    }
}
