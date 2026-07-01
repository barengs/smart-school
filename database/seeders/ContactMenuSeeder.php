<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Menu::firstOrCreate(
            ['url' => '/admin/contacts'],
            [
                'label' => 'Layanan Publik',
                'icon' => 'support_agent',
                'type' => 'admin',
                'sort_order' => 10,
            ]
        );
    }
}
