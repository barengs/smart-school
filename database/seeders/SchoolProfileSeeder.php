<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolProfile;

class SchoolProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SchoolProfile::updateOrCreate(
            ['id' => 1],
            [
                'school_name' => 'SMA UMI',
                'npsn' => '20580001',
                'nsm' => '131235090001',
                'accreditation' => 'A',
                'status' => 'Swasta',
                'address' => 'Jl. Pendidikan No. 1, Desa Merdeka, Kec. Pamekasan',
                'phone_number' => '(0324) 123456',
                'email' => 'info@umediatama.com',
                'website' => 'https://sekolah.umediatama.com',
                'vision' => 'Terwujudnya Generasi Qur\'ani yang Cerdas, Terampil, dan Berakhlakul Karimah',
                'mission' => '<ul><li>Menyelenggarakan pendidikan berbasis nilai-nilai Islam.</li><li>Meningkatkan kualitas akademik dan non-akademik siswa.</li><li>Membina kepribadian siswa yang berakhlak mulia.</li></ul>',
                'history' => '<p>SMA UMI didirikan pada tahun 2024 atas inisiatif tokoh masyarakat setempat untuk menyediakan pendidikan berkualitas yang bernapaskan Islam.</p><p>Hingga saat ini, kami terus berinovasi dan mencetak alumni yang berkontribusi bagi masyarakat luas.</p>',
                'hero_title' => 'Membentuk Generasi Cerdas Berkarakter',
                'hero_text' => 'Selamat datang di SMA UMI. Kami berkomitmen untuk menyediakan pendidikan berkualitas tinggi, memadukan inovasi digital dengan nilai-nilai luhur agama untuk masa depan yang lebih baik.',
                'about_text' => '<h2 class="ql-align-justify">Institusi Pendidikan Terkemuka dengan Fasilitas Modern</h2><p class="ql-align-justify">Sejak didirikan, SMA UMI terus bertransformasi menjadi pusat keunggulan akademik. Kami percaya bahwa lingkungan belajar yang kondusif, didukung oleh teknologi terkini, adalah kunci untuk mencetak pemimpin masa depan. Kurikulum kami dirancang untuk menantang pemikiran kritis sekaligus menumbuhkan empati sosial.</p><ul><li class="ql-align-justify">Akreditasi A Berstandar Nasional</li><li class="ql-align-justify">Laboratorium Sains &amp; Komputer Lengkap</li><li class="ql-align-justify">Tenaga Pengajar Tersertifikasi</li></ul>',
            ]
        );
    }
}
