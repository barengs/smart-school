<?php

namespace App\Http\Controllers;

use App\Models\PpdbRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PPDBController extends Controller
{
    public function storePublic(Request $request)
    {
        $reg = new PpdbRegistration($request->all());
        $reg->registration_number = 'PPDB-' . date('Y') . '-' . strtoupper(Str::random(5));
        $reg->status = 'pending';
        $reg->save();

        return response()->json(['message' => 'Registration successful', 'data' => $reg], 201);
    }

    public function index()
    {
        return response()->json(PpdbRegistration::orderBy('registered_at', 'desc')->get());
    }

    public function show($id)
    {
        return response()->json(PpdbRegistration::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $reg = PpdbRegistration::findOrFail($id);
        $reg->update($request->all());
        return response()->json($reg);
    }

    public function destroy($id)
    {
        PpdbRegistration::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    public function verify($id)
    {
        $reg = PpdbRegistration::findOrFail($id);
        $reg->status = 'verified';
        $reg->save();
        return response()->json(['message' => 'Verified', 'data' => $reg]);
    }

    public function updateStatus(Request $request, $id)
    {
        $reg = PpdbRegistration::findOrFail($id);
        $reg->status = $request->input('status'); // accepted or rejected
        $reg->save();
        return response()->json(['message' => 'Status updated', 'data' => $reg]);
    }
}
