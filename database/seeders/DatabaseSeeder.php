<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MenuSeeder::class,
            RolePermissionSeeder::class,
            UserSeeder::class,
            SchoolProfileSeeder::class,
            CmsSeeder::class,
            OrganizationStructureSeeder::class,
            AcademicCalendarSeeder::class,
            ContactMenuSeeder::class,
            AcademicMenuSeeder::class,
            PpdbMasterSeeder::class,
            PpdbRegistrationSeeder::class,
            ModuleSeeder::class,
            AcademicDataSeeder::class,
        ]);
    }
}
