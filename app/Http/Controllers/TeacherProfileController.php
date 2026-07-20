<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Teacher;
use App\Models\TeacherEducation;
use App\Models\TeacherRank;
use App\Models\TeacherDocument;
use Illuminate\Support\Facades\Storage;

class TeacherProfileController extends Controller
{
    public function show(Request $request)
    {
        $teacher = Teacher::with(['user', 'subjects', 'educations', 'ranks', 'documents'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$teacher) {
            return response()->json(['message' => 'Anda bukan terdaftar sebagai guru.'], 403);
        }

        return response()->json($teacher);
    }

    public function update(Request $request)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'nik' => 'nullable|string',
            'kk_number' => 'nullable|string',
            'birth_place' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'employment_status' => 'nullable|string|in:PNS,PPPK,Non-ASN',
            'nrg' => 'nullable|string',
            'base_administration' => 'nullable|string',
            'certification_subject' => 'nullable|string',
            'ukg_score' => 'nullable|numeric'
        ]);

        $teacher->update($validated);

        return response()->json($teacher->load(['user', 'subjects', 'educations', 'ranks', 'documents']));
    }

    public function storeEducation(Request $request)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->firstOrFail();
        
        $validated = $request->validate([
            'degree' => 'required|string',
            'institution' => 'required|string',
            'major' => 'required|string',
            'graduation_year' => 'required|integer',
            'is_linear' => 'boolean'
        ]);
        
        $education = $teacher->educations()->create($validated);
        
        return response()->json($education, 201);
    }
    
    public function destroyEducation(Request $request, $id)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->firstOrFail();
        $teacher->educations()->findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function storeRank(Request $request)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->firstOrFail();
        
        $validated = $request->validate([
            'rank_group' => 'required|string',
            'tmt' => 'required|date'
        ]);
        
        $rank = $teacher->ranks()->create($validated);
        
        return response()->json($rank, 201);
    }
    
    public function destroyRank(Request $request, $id)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->firstOrFail();
        $teacher->ranks()->findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function storeDocument(Request $request)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->firstOrFail();
        
        $request->validate([
            'type' => 'required|string',
            'title' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        $path = $request->file('file')->store('teachers/documents/' . $teacher->id, 'public');

        $document = $teacher->documents()->create([
            'type' => $request->type,
            'title' => $request->title,
            'file_path' => $path
        ]);
        
        return response()->json($document, 201);
    }
    
    public function destroyDocument(Request $request, $id)
    {
        $teacher = Teacher::where('user_id', $request->user()->id)->firstOrFail();
        $document = $teacher->documents()->findOrFail($id);
        
        if ($document->file_path) {
            @unlink(storage_path('app/public/' . $document->file_path));
        }
        
        $document->delete();
        return response()->json(null, 204);
    }
}
