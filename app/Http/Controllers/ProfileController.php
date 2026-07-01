<?php

namespace App\Http\Controllers;

use App\Models\SchoolProfile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function showPublic()
    {
        $profile = SchoolProfile::first();
        if ($profile) {
            $profile->name = $profile->school_name;
            $profile->phone = $profile->phone_number;
        }
        return response()->json($profile);
    }

    public function show()
    {
        $profile = SchoolProfile::first();
        if ($profile) {
            $profile->name = $profile->school_name;
            $profile->phone = $profile->phone_number;
        }
        return response()->json($profile);
    }

    public function update(Request $request)
    {
        // First, make sure we have a profile to update
        $profile = SchoolProfile::first();
        if (!$profile) {
            $profile = new SchoolProfile();
            $profile->id = 1;
        }
        
        $data = $request->except(['logo', 'favicon', '_method', 'name', 'phone']);
        
        if ($request->has('name')) {
            $data['school_name'] = $request->name;
        }
        if ($request->has('phone')) {
            $data['phone_number'] = $request->phone;
        }

        if ($request->hasFile('logo')) {
            if ($profile->logo_path) {
                @unlink(storage_path('app/public/' . $profile->logo_path));
            }
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($request->file('logo'));
            $filename = 'school/logo/' . uniqid() . '.webp';
            $path = storage_path('app/public/' . $filename);
            @mkdir(dirname($path), 0777, true);
            $image->toWebp(80)->save($path);
            $data['logo_path'] = $filename;
        }

        if ($request->hasFile('favicon')) {
            $path = $request->file('favicon')->store('school/favicon', 'public');
            if ($profile->favicon_path) {
                @unlink(storage_path('app/public/' . $profile->favicon_path));
            }
            $data['favicon_path'] = $path;
        }

        if ($request->hasFile('hero_image')) {
            if ($profile->hero_image_path) {
                @unlink(storage_path('app/public/' . $profile->hero_image_path));
            }
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($request->file('hero_image'));
            $filename = 'school/hero/' . uniqid() . '.webp';
            $path = storage_path('app/public/' . $filename);
            @mkdir(dirname($path), 0777, true);
            $image->toWebp(80)->save($path);
            $data['hero_image_path'] = $filename;
        }

        if ($request->hasFile('about_image')) {
            if ($profile->about_image_path) {
                @unlink(storage_path('app/public/' . $profile->about_image_path));
            }
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($request->file('about_image'));
            $filename = 'school/about/' . uniqid() . '.webp';
            $path = storage_path('app/public/' . $filename);
            @mkdir(dirname($path), 0777, true);
            $image->toWebp(80)->save($path);
            $data['about_image_path'] = $filename;
        }

        if ($profile->exists) {
            $profile->update($data);
        } else {
            $profile->fill($data)->save();
        }

        $profile->name = $profile->school_name;
        $profile->phone = $profile->phone_number;

        return response()->json(['message' => 'Profile updated successfully', 'data' => $profile]);
    }
}
