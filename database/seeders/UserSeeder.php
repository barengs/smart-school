<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $dev = User::firstOrCreate(
            ['email' => 'developer@smartschool.sch.id'],
            [
                'name' => 'System Developer',
                'password' => Hash::make('K@mbing1'),
            ]
        );
        $dev->assignRole('Developer');

        $admin = User::firstOrCreate(
            ['email' => 'admin@smartschool.sch.id'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('password123'),
            ]
        );
        $admin->assignRole('Super Admin');

        $editor = User::firstOrCreate(
            ['email' => 'editor@smartschool.sch.id'],
            [
                'name' => 'Jurnalis Sekolah',
                'password' => Hash::make('password123'),
            ]
        );
        $editor->assignRole('Editor Berita');

        $reviewer = User::firstOrCreate(
            ['email' => 'ppdb@smartschool.sch.id'],
            [
                'name' => 'Panitia PPDB',
                'password' => Hash::make('password123'),
            ]
        );
        $reviewer->assignRole('Reviewer PPDB');
    }
}
