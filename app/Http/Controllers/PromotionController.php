<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\StudentPromotion::with(['student.user', 'fromClassroom', 'toClassroom', 'academicYear', 'teacher.user']);
        if ($request->has('from_classroom_id')) {
            $query->where('from_classroom_id', $request->from_classroom_id);
        }
        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }
        return response()->json($query->get());
    }

    public function getEligibleStudents(Request $request)
    {
        $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        // Get students currently in this classroom
        $students = \App\Models\Student::whereHas('classrooms', function($q) use ($request) {
            $q->where('classrooms.id', $request->classroom_id);
        })->with(['user'])->get();

        // Calculate average
        foreach ($students as $student) {
            $grades = \App\Models\StudentGrade::where('student_id', $student->id)
                ->where('classroom_id', $request->classroom_id)
                ->get();
            $student->average_grade = $grades->count() > 0 ? $grades->avg('final_grade') : 0;
            
            // Check if promotion already exists
            $promotion = \App\Models\StudentPromotion::where('student_id', $student->id)
                ->where('from_classroom_id', $request->classroom_id)
                ->where('academic_year_id', $request->academic_year_id)
                ->first();
            $student->promotion_status = $promotion ? $promotion->status : 'none';
        }

        return response()->json($students);
    }

    public function process(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'from_classroom_id' => 'required|exists:classrooms,id',
            'to_classroom_id' => 'nullable|exists:classrooms,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'status' => 'required|in:approved,rejected',
            'notes' => 'nullable|string',
        ]);

        return response()->json($this->processSinglePromotion($request->all(), $request->user()));
    }

    public function processBulk(Request $request)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
            'from_classroom_id' => 'required|exists:classrooms,id',
            'to_classroom_id' => 'nullable|exists:classrooms,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'status' => 'required|in:approved,rejected',
        ]);

        $results = [];
        foreach ($request->student_ids as $student_id) {
            $data = $request->only(['from_classroom_id', 'to_classroom_id', 'academic_year_id', 'status']);
            $data['student_id'] = $student_id;
            $data['notes'] = null;
            $results[] = $this->processSinglePromotion($data, $request->user());
        }

        return response()->json($results);
    }

    private function processSinglePromotion($data, $user)
    {
        $promotion = \App\Models\StudentPromotion::updateOrCreate(
            [
                'student_id' => $data['student_id'],
                'from_classroom_id' => $data['from_classroom_id'],
                'academic_year_id' => $data['academic_year_id'],
            ],
            [
                'to_classroom_id' => $data['to_classroom_id'] ?? null,
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
                'teacher_id' => $user->teacher ? $user->teacher->id : null,
            ]
        );

        if ($data['status'] === 'approved' && !empty($data['to_classroom_id'])) {
            $student = \App\Models\Student::find($data['student_id']);
            $student->classrooms()->syncWithoutDetaching([
                $data['to_classroom_id'] => ['academic_year_id' => $data['academic_year_id']]
            ]);
        }

        return $promotion;
    }
}
