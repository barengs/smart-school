<?php

namespace App\Http\Controllers;

use App\Models\SchoolProfile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function showPublic()
    {
        return response()->json(SchoolProfile::first());
    }

    public function show()
    {
        return response()->json(SchoolProfile::first());
    }

    public function update(Request $request)
    {
        $profile = SchoolProfile::firstOrCreate(['id' => 1]);
        
        // Simple update without validation for brevity
        $profile->update($request->all());

        return response()->json(['message' => 'Profile updated successfully', 'data' => $profile]);
    }
}
