<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendar;
use Illuminate\Http\Request;

class AcademicCalendarController extends Controller
{
    public function index()
    {
        return response()->json(AcademicCalendar::all());
    }

    public function indexPublic()
    {
        return response()->json(AcademicCalendar::orderBy('start_date', 'asc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'type' => 'required|string|in:general,holiday,exam,activity'
        ]);

        $event = AcademicCalendar::create($validated);
        return response()->json($event, 201);
    }

    public function show($id)
    {
        return response()->json(AcademicCalendar::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $event = AcademicCalendar::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'type' => 'required|string|in:general,holiday,exam,activity'
        ]);

        $event->update($validated);
        return response()->json($event);
    }

    public function destroy($id)
    {
        $calendar = AcademicCalendar::findOrFail($id);
        $calendar->delete();

        return response()->json(null, 204);
    }

    public function template()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\AcademicCalendarExport(true), 'Template_Import_Kalender.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\AcademicCalendarImport, $request->file('file'));
            return response()->json(['message' => 'Data kalender akademik berhasil diimpor']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengimpor data: ' . $e->getMessage()], 500);
        }
    }
}
