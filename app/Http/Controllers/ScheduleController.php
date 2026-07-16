<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function index()
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'semester_id' => 'required|exists:semesters,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day' => 'required|string',
            'lesson_hour_id' => 'required|exists:lesson_hours,id',
        ]);
        
        $this->checkConflict($request);

        $schedule = Schedule::create($validated);
        return response()->json($schedule, 201);
    }

    public function show(string $id)
    {
        return response()->json(\App\Models\Schedule::with(['semester', 'classroom', 'subject', 'teacher', 'lessonHour'])->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $schedule = Schedule::findOrFail($id);
        
        $validated = $request->validate([
            'semester_id' => 'required|exists:semesters,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day' => 'required|string',
            'lesson_hour_id' => 'required|exists:lesson_hours,id',
        ]);

        $this->checkConflict($request, $id);

        $schedule->update($validated);
        return response()->json($schedule);
    }

    private function checkConflict(Request $request, $ignoreId = null)
    {
        $lessonHour = \App\Models\LessonHour::findOrFail($request->lesson_hour_id);

        $query = Schedule::where('day', $request->day)
            ->whereHas('lessonHour', function ($q) use ($lessonHour) {
                $q->where('start_time', '<', $lessonHour->end_time)
                  ->where('end_time', '>', $lessonHour->start_time);
            });
            
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        // Check teacher conflict
        $teacherConflict = (clone $query)->where('teacher_id', $request->teacher_id)->first();
        if ($teacherConflict) {
            abort(422, 'Guru sudah memiliki jadwal pada waktu tersebut.');
        }

        // Check classroom conflict
        $classConflict = (clone $query)->where('classroom_id', $request->classroom_id)->first();
        if ($classConflict) {
            abort(422, 'Kelas ini sudah memiliki jadwal pada waktu tersebut.');
        }
    }

    public function destroy(string $id)
    {
        Schedule::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
