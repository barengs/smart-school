<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\StudentGrade::with(['student.user', 'subject', 'semester', 'classroom']);
        if ($request->has('classroom_id')) {
            $query->where('classroom_id', $request->classroom_id);
        }
        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->has('semester_id')) {
            $query->where('semester_id', $request->semester_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'semester_id' => 'required|exists:semesters,id',
            'classroom_id' => 'nullable|exists:classrooms,id',
            'assignment_score' => 'nullable|numeric|min:0|max:100',
            'midterm_score' => 'nullable|numeric|min:0|max:100',
            'final_score' => 'nullable|numeric|min:0|max:100',
        ]);

        $assignment = $request->input('assignment_score', 0);
        $midterm = $request->input('midterm_score', 0);
        $final = $request->input('final_score', 0);
        
        $validated['final_grade'] = ($assignment + $midterm + $final) / 3;

        $grade = \App\Models\StudentGrade::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'subject_id' => $validated['subject_id'],
                'semester_id' => $validated['semester_id'],
            ],
            $validated
        );

        return response()->json($grade);
    }
}
