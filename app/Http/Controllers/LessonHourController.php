<?php

namespace App\Http\Controllers;

use App\Models\LessonHour;
use Illuminate\Http\Request;

class LessonHourController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lessonHours = LessonHour::orderBy('start_time')->get();
        return response()->json($lessonHours);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $lessonHour = LessonHour::create($validated);
        return response()->json($lessonHour, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(LessonHour $lessonHour)
    {
        return response()->json($lessonHour);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LessonHour $lessonHour)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $lessonHour->update($validated);
        return response()->json($lessonHour);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LessonHour $lessonHour)
    {
        $lessonHour->delete();
        return response()->json(null, 204);
    }

    public function export()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\LessonHourExport(), 'Jam_Pelajaran.xlsx');
    }

    public function template()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\LessonHourExport(true), 'Template_Import_Jam_Pelajaran.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\LessonHourImport, $request->file('file'));
            return response()->json(['message' => 'Data jam pelajaran berhasil diimpor']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengimpor data: ' . $e->getMessage()], 500);
        }
    }
}
