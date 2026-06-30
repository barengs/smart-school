<?php

namespace Database\Seeders;

use App\Models\SchoolProfile;
use Illuminate\Database\Seeder;

class SchoolProfileSeeder extends Seeder
{
    public function run(): void
    {
        SchoolProfile::create([
            'school_name' => 'SMA SmartSchool Nusantara',
            'npsn' => '10293847',
            'headmaster_name' => 'Dr. Budi Santoso, M.Pd.',
            'address' => 'Jl. Pendidikan No. 123, Kota Cerdas, Provinsi Maju',
            'phone_number' => '(021) 555-1234',
            'email' => 'info@smartschool.sch.id',
            'vision' => 'Menjadi institusi pendidikan terbaik yang menghasilkan generasi cerdas, berkarakter, dan inovatif.',
            'mission' => '1. Menyelenggarakan pendidikan berkualitas.\n2. Mengembangkan potensi siswa secara maksimal.\n3. Membangun karakter bangsa yang bermoral dan beretika.',
            'history' => 'SMA SmartSchool Nusantara didirikan pada tahun 1990 dengan tujuan untuk memberikan pendidikan berkualitas tinggi bagi masyarakat sekitar.',
        ]);
    }
}
