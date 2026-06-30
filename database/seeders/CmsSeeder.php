<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\News;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        $akademik = Category::create(['name' => 'Akademik', 'slug' => 'akademik']);
        $kegiatan = Category::create(['name' => 'Kegiatan', 'slug' => 'kegiatan']);
        $prestasi = Category::create(['name' => 'Prestasi', 'slug' => 'prestasi']);

        $editor = User::where('email', 'editor@smartschool.sch.id')->first();
        if (!$editor) {
            $editor = User::first();
        }

        News::create([
            'title' => 'Siswa SMA SmartSchool Menjuarai Olimpiade Sains Nasional',
            'slug' => Str::slug('Siswa SMA SmartSchool Menjuarai Olimpiade Sains Nasional'),
            'content' => 'Prestasi membanggakan kembali ditorehkan oleh siswa SMA SmartSchool Nusantara. Pada ajang Olimpiade Sains Nasional (OSN) tingkat nasional yang diselenggarakan di Jakarta, perwakilan sekolah kita berhasil meraih medali emas pada bidang Fisika dan Matematika. Kepala sekolah menyampaikan apresiasi setinggi-tingginya kepada para siswa dan guru pembimbing.',
            'category_id' => $prestasi->id,
            'author_id' => $editor->id,
            'status' => 'published',
            'published_at' => now()->subDays(2),
        ]);

        News::create([
            'title' => 'Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Resmi Dibuka',
            'slug' => Str::slug('Penerimaan Peserta Didik Baru PPDB Resmi Dibuka'),
            'content' => 'Diberitahukan kepada seluruh masyarakat bahwa pendaftaran peserta didik baru SMA SmartSchool Nusantara tahun ajaran 2026/2027 telah resmi dibuka. Pendaftaran dapat dilakukan secara online melalui portal resmi sekolah. Calon siswa diharapkan mempersiapkan berkas-berkas yang dibutuhkan seperti fotokopi rapor, akta kelahiran, dan kartu keluarga.',
            'category_id' => $akademik->id,
            'author_id' => $editor->id,
            'status' => 'published',
            'published_at' => now()->subDays(1),
        ]);

        News::create([
            'title' => 'Persiapan Pentas Seni Tahunan "Gita Nusantara"',
            'slug' => Str::slug('Persiapan Pentas Seni Tahunan Gita Nusantara'),
            'content' => 'OSIS SMA SmartSchool Nusantara sedang mempersiapkan acara pentas seni tahunan yang bertajuk "Gita Nusantara". Acara ini akan menampilkan berbagai bakat seni dari para siswa, mulai dari tari tradisional, band, hingga teater. Diharapkan seluruh siswa dapat berpartisipasi dan memeriahkan acara ini.',
            'category_id' => $kegiatan->id,
            'author_id' => $editor->id,
            'status' => 'pending_approval',
        ]);
    }
}
