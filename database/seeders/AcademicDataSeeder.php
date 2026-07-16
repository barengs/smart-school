<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Subject;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\Classroom;
use App\Models\LessonHour;
use App\Models\Schedule;

class AcademicDataSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. Tahun Ajaran & Semester ──────────────────────────────────
        $ay = AcademicYear::firstOrCreate(
            ['name' => '2024/2025'],
            ['is_active' => true]
        );

        $semGanjil = Semester::firstOrCreate(
            ['academic_year_id' => $ay->id, 'name' => 'Ganjil'],
            ['is_active' => true]
        );
        $semGenap = Semester::firstOrCreate(
            ['academic_year_id' => $ay->id, 'name' => 'Genap'],
            ['is_active' => false]
        );

        // ─── 2. Mata Pelajaran ────────────────────────────────────────────
        $subjects = [
            ['code' => 'MTK01',  'name' => 'Matematika'],
            ['code' => 'BHS01',  'name' => 'Bahasa Indonesia'],
            ['code' => 'IPA01',  'name' => 'Ilmu Pengetahuan Alam'],
            ['code' => 'IPS01',  'name' => 'Ilmu Pengetahuan Sosial'],
            ['code' => 'ENG01',  'name' => 'Bahasa Inggris'],
            ['code' => 'PKN01',  'name' => 'Pendidikan Kewarganegaraan'],
        ];
        $subjectModels = [];
        foreach ($subjects as $s) {
            $subjectModels[$s['code']] = Subject::updateOrCreate(['code' => $s['code']], ['name' => $s['name']]);
        }

        // ─── 3. Jam Pelajaran ─────────────────────────────────────────────
        $lessonHours = [
            ['name' => 'Jam ke-1', 'start_time' => '07:00', 'end_time' => '07:45'],
            ['name' => 'Jam ke-2', 'start_time' => '07:45', 'end_time' => '08:30'],
            ['name' => 'Jam ke-3', 'start_time' => '08:30', 'end_time' => '09:15'],
            ['name' => 'Jam ke-4', 'start_time' => '09:30', 'end_time' => '10:15'],
            ['name' => 'Jam ke-5', 'start_time' => '10:15', 'end_time' => '11:00'],
            ['name' => 'Jam ke-6', 'start_time' => '11:00', 'end_time' => '11:45'],
            ['name' => 'Jam ke-7', 'start_time' => '13:00', 'end_time' => '13:45'],
            ['name' => 'Jam ke-8', 'start_time' => '13:45', 'end_time' => '14:30'],
        ];
        $lhModels = [];
        foreach ($lessonHours as $lh) {
            $lhModels[$lh['name']] = LessonHour::firstOrCreate(['name' => $lh['name']], [
                'start_time' => $lh['start_time'],
                'end_time'   => $lh['end_time'],
            ]);
        }

        // ─── 4. Guru (5 orang) ───────────────────────────────────────────
        $teacherData = [
            ['name' => 'Budi Santoso, S.Pd',   'email' => 'budi.santoso@smartschool.sch.id',   'nip' => '198501012010011001', 'gender' => 'L'],
            ['name' => 'Siti Rahayu, S.Pd',    'email' => 'siti.rahayu@smartschool.sch.id',    'nip' => '198203152009012002', 'gender' => 'P'],
            ['name' => 'Ahmad Fauzi, M.Pd',    'email' => 'ahmad.fauzi@smartschool.sch.id',    'nip' => '197907202003011003', 'gender' => 'L'],
            ['name' => 'Dewi Lestari, S.Pd',   'email' => 'dewi.lestari@smartschool.sch.id',   'nip' => '199001302015012004', 'gender' => 'P'],
            ['name' => 'Roni Hermawan, S.Pd',  'email' => 'roni.hermawan@smartschool.sch.id',  'nip' => '198611052012011005', 'gender' => 'L'],
        ];
        $teachers = [];
        foreach ($teacherData as $td) {
            $user = User::firstOrCreate(
                ['email' => $td['email']],
                ['name' => $td['name'], 'password' => Hash::make('password123')]
            );
            $teacher = Teacher::firstOrCreate(
                ['user_id' => $user->id],
                ['nip' => $td['nip'], 'gender' => $td['gender'], 'phone' => '08121234567' . rand(0, 9)]
            );
            $teachers[] = $teacher;
        }

        // ─── 5. Kelas ─────────────────────────────────────────────────────
        $classroomData = [
            ['name' => 'X-A',  'level' => '10', 'teacher_idx' => 0],
            ['name' => 'X-B',  'level' => '10', 'teacher_idx' => 1],
            ['name' => 'XI-A', 'level' => '11', 'teacher_idx' => 2],
            ['name' => 'XI-B', 'level' => '11', 'teacher_idx' => 3],
            ['name' => 'XII-A','level' => '12', 'teacher_idx' => 4],
        ];
        $classrooms = [];
        foreach ($classroomData as $cd) {
            $classrooms[] = Classroom::updateOrCreate(
                ['name' => $cd['name'], 'level' => $cd['level']],
                ['teacher_id' => $teachers[$cd['teacher_idx']]->id]
            );
        }

        // ─── 6. Siswa (30 orang, 6 per kelas) ────────────────────────────
        $studentNames = [
            'Andi Pratama', 'Bela Safitri', 'Candra Wijaya', 'Dita Permata', 'Eko Susanto',
            'Fitri Handayani', 'Galih Purnomo', 'Hana Kusuma', 'Irfan Maulana', 'Juwita Sari',
            'Kevin Nugroho', 'Lina Wulandari', 'Muhamad Rizki', 'Nadia Rahmawati', 'Oki Firmansyah',
            'Putri Anggraini', 'Qori Fadillah', 'Rangga Setiawan', 'Sinta Dewi', 'Taufik Hidayat',
            'Ulfa Nurhaliza', 'Vino Saputra', 'Wulan Sari', 'Xena Kartika', 'Yoga Prabowo',
            'Zahra Maulida', 'Aldi Firmansyah', 'Bella Oktaviani', 'Chandra Kurniawan', 'Dika Saputra',
        ];
        $genders = ['L','P','L','P','L','P','L','P','L','P','L','P','L','P','L','P','L','P','L','L','P','L','P','P','L','P','L','P','L','L'];

        foreach ($studentNames as $idx => $sName) {
            $email = 'siswa' . str_pad($idx + 1, 3, '0', STR_PAD_LEFT) . '@smartschool.sch.id';
            $nis   = '2024' . str_pad($idx + 1, 4, '0', STR_PAD_LEFT);

            $user = User::firstOrCreate(
                ['email' => $email],
                ['name' => $sName, 'password' => Hash::make('password123')]
            );
            $student = Student::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'nis'    => $nis,
                    'nisn'   => '00' . $nis,
                    'gender' => $genders[$idx],
                    'phone'  => '08113456' . str_pad($idx, 3, '0', STR_PAD_LEFT),
                ]
            );

            // 6 siswa per kelas
            $classroomIdx = intdiv($idx, 6);
            if ($classroomIdx < count($classrooms)) {
                $classrooms[$classroomIdx]->students()->syncWithoutDetaching([
                    $student->id => ['academic_year_id' => $ay->id]
                ]);
            }
        }

        // ─── 7. Jadwal Pelajaran ──────────────────────────────────────────
        // Jadwal ini akan otomatis trigger ScheduleObserver → create 16 meetings
        $scheduleData = [
            // Kelas X-A
            ['classroom' => 0, 'subject' => 'MTK01', 'teacher' => 0, 'day' => 'Senin',  'lesson_hour' => 'Jam ke-1'],
            ['classroom' => 0, 'subject' => 'BHS01', 'teacher' => 1, 'day' => 'Selasa', 'lesson_hour' => 'Jam ke-3'],
            ['classroom' => 0, 'subject' => 'IPA01', 'teacher' => 2, 'day' => 'Rabu',   'lesson_hour' => 'Jam ke-2'],
            // Kelas X-B
            ['classroom' => 1, 'subject' => 'MTK01', 'teacher' => 0, 'day' => 'Senin',  'lesson_hour' => 'Jam ke-3'],
            ['classroom' => 1, 'subject' => 'ENG01', 'teacher' => 3, 'day' => 'Kamis',  'lesson_hour' => 'Jam ke-1'],
            // Kelas XI-A
            ['classroom' => 2, 'subject' => 'IPS01', 'teacher' => 1, 'day' => 'Selasa', 'lesson_hour' => 'Jam ke-1'],
            ['classroom' => 2, 'subject' => 'PKN01', 'teacher' => 4, 'day' => 'Jumat',  'lesson_hour' => 'Jam ke-2'],
            // Kelas XII-A
            ['classroom' => 4, 'subject' => 'MTK01', 'teacher' => 0, 'day' => 'Rabu',   'lesson_hour' => 'Jam ke-4'],
        ];

        foreach ($scheduleData as $sd) {
            $existing = Schedule::where([
                'semester_id'    => $semGanjil->id,
                'classroom_id'   => $classrooms[$sd['classroom']]->id,
                'subject_id'     => $subjectModels[$sd['subject']]->id,
                'day'            => $sd['day'],
                'lesson_hour_id' => $lhModels[$sd['lesson_hour']]->id,
            ])->first();

            if (!$existing) {
                // createOrCreate tidak dipakai agar observer tetap terpicu lewat create()
                Schedule::create([
                    'semester_id'    => $semGanjil->id,
                    'classroom_id'   => $classrooms[$sd['classroom']]->id,
                    'subject_id'     => $subjectModels[$sd['subject']]->id,
                    'teacher_id'     => $teachers[$sd['teacher']]->id,
                    'day'            => $sd['day'],
                    'lesson_hour_id' => $lhModels[$sd['lesson_hour']]->id,
                ]);
            }
        }

        $this->command->info('AcademicDataSeeder selesai: tahun ajaran, semester, mapel, jam, guru, siswa, kelas, jadwal + 16 RTM otomatis.');
    }
}
