<?php

namespace App\Http\Controllers;

use App\Models\CbtExam;
use App\Models\CbtSession;
use App\Models\CbtAnswer;
use App\Models\PpdbRegistration;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CbtParticipantController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'exam_number' => 'required|string',
            // student login can be handled differently or we use NISN if they are students
        ]);

        $participant = PpdbRegistration::where('exam_number', $request->exam_number)->first();
        if (!$participant) {
            // Check student NISN just in case
            $participant = Student::where('nisn', $request->exam_number)->first();
        }

        if (!$participant) {
            return response()->json(['message' => 'Nomor ujian tidak ditemukan'], 404);
        }

        $type = get_class($participant);
        $token = base64_encode($type . '|' . $participant->id . '|' . md5($participant->created_at));

        return response()->json([
            'token' => $token,
            'participant_id' => $participant->id,
            'participant_type' => $type,
            'name' => $participant->full_name ?? $participant->name,
        ]);
    }

    private function getParticipantFromToken(Request $request)
    {
        $token = $request->header('X-CBT-Token');
        if (!$token) return null;
        
        $decoded = base64_decode($token);
        @list($type, $id, $hash) = explode('|', $decoded);
        
        if ($type && $id) {
            return $type::find($id);
        }
        return null;
    }

    public function getAvailableExams(Request $request)
    {
        $participant = $this->getParticipantFromToken($request);
        if (!$participant) return response()->json(['message' => 'Unauthorized'], 401);

        $type = get_class($participant);

        $exams = CbtExam::where('is_active', true)
            ->where(function($q) use ($participant, $type) {
                // Exam explicitly assigned via cbt_participants
                $q->whereHas('participants', function($subQ) use ($participant, $type) {
                    $subQ->where('participant_id', $participant->id)
                         ->where('participant_type', $type);
                });

                // Or exam linked via PPDB path
                if ($type === PpdbRegistration::class && $participant->path_id) {
                    $path = \App\Models\PpdbPath::find($participant->path_id);
                    if ($path && $path->cbt_exam_id) {
                        $q->orWhere('id', $path->cbt_exam_id);
                    }
                }
            })
            ->with(['sessions' => function($q) use ($participant, $type) {
                $q->where('participant_id', $participant->id)
                  ->where('participant_type', $type);
            }])
            ->get();

        return response()->json($exams);
    }

    public function startSession(Request $request, $examId)
    {
        $participant = $this->getParticipantFromToken($request);
        if (!$participant) return response()->json(['message' => 'Unauthorized'], 401);

        $exam = CbtExam::findOrFail($examId);
        $type = get_class($participant);

        // Check if already started
        $session = CbtSession::where('exam_id', $examId)
            ->where('participant_id', $participant->id)
            ->where('participant_type', $type)
            ->first();

        if (!$session) {
            $session = CbtSession::create([
                'exam_id' => $examId,
                'participant_id' => $participant->id,
                'participant_type' => $type,
                'start_time' => now(),
                'status' => 'in_progress',
            ]);
        }

        // Return questions without correct answers
        $questions = $exam->questions()->with(['options' => function($q) {
            $q->select('id', 'question_id', 'option_text'); // hide is_correct
        }])->get();

        if ($exam->randomize_questions) {
            $questions = $questions->shuffle();
        }

        $answers = $session->answers()->get();

        return response()->json([
            'session' => $session,
            'exam' => $exam,
            'questions' => $questions,
            'answers' => $answers,
            'server_time' => now(),
        ]);
    }

    public function saveAnswer(Request $request, $sessionId)
    {
        $session = CbtSession::findOrFail($sessionId);
        if ($session->status !== 'in_progress') {
            return response()->json(['message' => 'Session already finished'], 400);
        }

        $validated = $request->validate([
            'question_id' => 'required|integer',
            'option_id' => 'nullable|integer',
            'essay_answer' => 'nullable|string',
        ]);

        $answer = CbtAnswer::updateOrCreate(
            ['session_id' => $sessionId, 'question_id' => $validated['question_id']],
            ['option_id' => $validated['option_id'] ?? null, 'essay_answer' => $validated['essay_answer'] ?? null]
        );

        return response()->json($answer);
    }

    public function finishExam(Request $request, $sessionId)
    {
        $session = CbtSession::with('answers.question.options')->findOrFail($sessionId);
        
        if ($session->status !== 'in_progress') {
            return response()->json(['message' => 'Session already finished'], 400);
        }

        $session->end_time = now();
        $session->status = 'finished';

        // Auto grade multiple choice
        $totalScore = 0;
        foreach ($session->answers as $answer) {
            if ($answer->question->type === 'multiple_choice') {
                $correctOption = $answer->question->options->where('is_correct', true)->first();
                if ($correctOption && $answer->option_id === $correctOption->id) {
                    $answer->score = $answer->question->points;
                    $totalScore += $answer->score;
                } else {
                    $answer->score = 0;
                }
                $answer->save();
            }
            // Essay requires manual grading later
        }

        $session->final_score = $totalScore;
        $session->save();

        return response()->json($session);
    }
}
