<?php

namespace Database\Seeders;

use App\Models\PpdbRegistration;
use Illuminate\Database\Seeder;

class PpdbRegistrationSeeder extends Seeder
{
    public function run(): void
    {
        PpdbRegistration::create([
            'registration_number' => 'PPDB-2026-0001',
            'full_name' => 'Bagas Pramana',
            'nisn' => '0123456789',
            'place_of_birth' => 'Jakarta',
            'date_of_birth' => '2010-05-15',
            'gender' => 'L',
            'previous_school' => 'SMP Negeri 1 Jakarta',
            'parent_name' => 'Sukirman',
            'parent_phone' => '081234567890',
            'address' => 'Jl. Mawar No. 5, Jakarta Selatan',
            'status' => 'verified',
        ]);

        PpdbRegistration::create([
            'registration_number' => 'PPDB-2026-0002',
            'full_name' => 'Citra Lestari',
            'nisn' => '0987654321',
            'place_of_birth' => 'Bandung',
            'date_of_birth' => '2010-11-20',
            'gender' => 'P',
            'previous_school' => 'SMP Negeri 2 Bandung',
            'parent_name' => 'Wawan Kusuma',
            'parent_phone' => '081987654321',
            'address' => 'Jl. Melati No. 10, Bandung',
            'status' => 'pending',
        ]);

        PpdbRegistration::create([
            'registration_number' => 'PPDB-2026-0003',
            'full_name' => 'Andi Syahputra',
            'nisn' => '1122334455',
            'place_of_birth' => 'Surabaya',
            'date_of_birth' => '2011-01-05',
            'gender' => 'L',
            'previous_school' => 'SMP swasta',
            'parent_name' => 'Hasanudin',
            'parent_phone' => '085612341234',
            'address' => 'Jl. Pahlawan No. 2, Surabaya',
            'status' => 'accepted',
        ]);
    }
}
