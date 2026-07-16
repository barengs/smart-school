<?php

namespace App\Http\Controllers;

use App\Models\CbtExam;
use App\Models\CbtQuestion;
use App\Models\CbtOption;
use App\Models\CbtParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CbtAdminController extends Controller
{
    public function index()
    {
        $exams = CbtExam::withCount(['questions', 'participants', 'sessions'])->orderBy('created_at', 'desc')->get();
        return response()->json($exams);
    }

    public function show($id)
    {
        $exam = CbtExam::with(['questions.options', 'participants.participant'])->findOrFail($id);
        return response()->json($exam);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:ppdb,academic',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'duration_minutes' => 'required|integer|min:1',
            'randomize_questions' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $exam = CbtExam::create($validated);
        return response()->json($exam, 201);
    }

    public function update(Request $request, $id)
    {
        $exam = CbtExam::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:ppdb,academic',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'duration_minutes' => 'required|integer|min:1',
            'randomize_questions' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $exam->update($validated);
        return response()->json($exam);
    }

    public function destroy($id)
    {
        CbtExam::destroy($id);
        return response()->json(null, 204);
    }

    public function storeQuestion(Request $request, $examId)
    {
        $exam = CbtExam::findOrFail($examId);
        
        $validated = $request->validate([
            'type' => 'required|in:multiple_choice,essay',
            'question_text' => 'required|string',
            'points' => 'required|integer|min:1',
            'options' => 'required_if:type,multiple_choice|array',
            'options.*.option_text' => 'required_if:type,multiple_choice|string',
            'options.*.is_correct' => 'required_if:type,multiple_choice|boolean',
        ]);

        DB::beginTransaction();
        try {
            $question = $exam->questions()->create([
                'type' => $validated['type'],
                'question_text' => $validated['question_text'],
                'points' => $validated['points'],
                'sort_order' => CbtQuestion::where('exam_id', $examId)->max('sort_order') + 1,
            ]);

            if ($validated['type'] === 'multiple_choice' && isset($validated['options'])) {
                foreach ($validated['options'] as $opt) {
                    $question->options()->create([
                        'option_text' => $opt['option_text'],
                        'is_correct' => $opt['is_correct'] ?? false,
                    ]);
                }
            }
            DB::commit();
            return response()->json($question->load('options'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create question'], 500);
        }
    }

    public function updateQuestion(Request $request, $id)
    {
        $question = CbtQuestion::findOrFail($id);
        
        $validated = $request->validate([
            'type' => 'required|in:multiple_choice,essay',
            'question_text' => 'required|string',
            'points' => 'required|integer|min:1',
            'options' => 'required_if:type,multiple_choice|array',
            'options.*.id' => 'nullable|integer',
            'options.*.option_text' => 'required_if:type,multiple_choice|string',
            'options.*.is_correct' => 'required_if:type,multiple_choice|boolean',
        ]);

        DB::beginTransaction();
        try {
            $question->update([
                'type' => $validated['type'],
                'question_text' => $validated['question_text'],
                'points' => $validated['points'],
            ]);

            if ($validated['type'] === 'multiple_choice' && isset($validated['options'])) {
                // To keep it simple: delete old options and recreate
                $question->options()->delete();
                foreach ($validated['options'] as $opt) {
                    $question->options()->create([
                        'option_text' => $opt['option_text'],
                        'is_correct' => $opt['is_correct'] ?? false,
                    ]);
                }
            } else {
                $question->options()->delete(); // If changed to essay
            }
            DB::commit();
            return response()->json($question->load('options'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update question'], 500);
        }
    }

    public function destroyQuestion($id)
    {
        CbtQuestion::destroy($id);
        return response()->json(null, 204);
    }

    public function assignParticipants(Request $request, $examId)
    {
        $exam = CbtExam::findOrFail($examId);
        
        $validated = $request->validate([
            'participants' => 'required|array',
            'participants.*.id' => 'required|integer',
            'participants.*.type' => 'required|string', // e.g., 'App\Models\Student' or 'App\Models\PpdbRegistration'
        ]);

        // Simple sync: delete all and recreate for simplicity
        $exam->participants()->delete();

        foreach ($validated['participants'] as $p) {
            $exam->participants()->create([
                'participant_id' => $p['id'],
                'participant_type' => $p['type'],
            ]);
        }

        return response()->json(['message' => 'Participants assigned']);
    }
}
