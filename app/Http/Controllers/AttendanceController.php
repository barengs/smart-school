<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;
use App\Models\Meeting;
use App\Models\Attendance;
use App\Models\ClassroomStudent;

class AttendanceController extends Controller
{
    /**
     * GET /attendances/matrix?schedule_id=X
     * Kembalikan data matrix: info jadwal, 16 meetings, daftar siswa + status tiap pertemuan.
     */
    public function matrix(Request $request)
    {
        $scheduleId = $request->query('schedule_id');
        if (!$scheduleId) {
            return response()->json(['message' => 'schedule_id diperlukan'], 422);
        }

        $schedule = Schedule::with(['semester', 'classroom', 'subject', 'teacher.user', 'lessonHour', 'meetings'])
            ->findOrFail($scheduleId);

        // Siswa di kelas ini
        $students = \App\Models\Student::whereHas('classrooms', fn($q) => $q->where('classrooms.id', $schedule->classroom_id))
            ->with('user')
            ->get();

        // Semua attendance untuk meetings di jadwal ini
        $meetingIds = $schedule->meetings->pluck('id');
        $attendances = Attendance::whereIn('meeting_id', $meetingIds)->get()
            ->groupBy('student_id')
            ->map(fn($rows) => $rows->keyBy('meeting_id'));

        // Build matrix rows
        $rows = $students->map(function ($student) use ($schedule, $attendances) {
            $row = [
                'student_id'   => $student->id,
                'nis'          => $student->nis,
                'name'         => $student->user->name ?? '-',
                'meetings'     => [],
                'hadir'        => 0,
                'izin'         => 0,
                'sakit'        => 0,
                'alpa'         => 0,
            ];

            foreach ($schedule->meetings as $meeting) {
                $att = $attendances[$student->id][$meeting->id] ?? null;
                $status = $att?->status ?? null;
                $row['meetings'][$meeting->meeting_number] = $status;
                if ($status) {
                    $row[$status] = ($row[$status] ?? 0) + 1;
                }
            }

            $totalFilled = $row['hadir'] + $row['izin'] + $row['sakit'] + $row['alpa'];
            $row['total_pct'] = $totalFilled > 0 ? round(($row['hadir'] / $totalFilled) * 100, 1) : null;

            return $row;
        });

        return response()->json([
            'schedule'  => $schedule,
            'students'  => $rows,
        ]);
    }

    /**
     * GET /attendances/schedules
     * Daftar jadwal untuk dropdown.
     */
    public function schedules()
    {
        $query = Schedule::with(['semester', 'classroom', 'subject', 'teacher.user', 'lessonHour']);
        
        $user = auth()->user();
        if ($user->hasRole('Guru')) {
            $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();
            if ($teacher) {
                $query->where('teacher_id', $teacher->id);
            }
        }

        return response()->json($query->get());
    }

    /**
     * POST /attendances/meeting
     * Simpan/update presensi satu pertemuan (batch semua siswa).
     * Body: { meeting_id, attendances: [{student_id, status, notes?}] }
     */
    public function saveMeeting(Request $request)
    {
        $validated = $request->validate([
            'meeting_id'                  => 'required|exists:meetings,id',
            'attendances'                 => 'required|array',
            'attendances.*.student_id'    => 'required|exists:students,id',
            'attendances.*.status'        => 'required|in:hadir,izin,sakit,alpa',
            'attendances.*.notes'         => 'nullable|string',
        ]);

        foreach ($validated['attendances'] as $att) {
            Attendance::updateOrCreate(
                ['meeting_id' => $validated['meeting_id'], 'student_id' => $att['student_id']],
                ['status' => $att['status'], 'notes' => $att['notes'] ?? null]
            );
        }

        $meeting = Meeting::with('attendances')->findOrFail($validated['meeting_id']);
        return response()->json(['message' => 'Presensi berhasil disimpan', 'meeting' => $meeting]);
    }

    // Kept for apiResource compatibility
    public function index(Request $request) { return response()->json([]); }
    public function store(Request $request) { return $this->saveMeeting($request); }
    public function show(string $id) { return response()->json(Meeting::with('attendances')->findOrFail($id)); }
    public function update(Request $request, string $id) { return response()->json([]); }
    public function destroy(string $id) { return response()->json(null, 204); }
}
