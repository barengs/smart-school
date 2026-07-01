<?php

namespace App\Http\Controllers;

use App\Models\PpdbRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PpdbExport;

class PPDBController extends Controller
{
    public function decodeNik($nik)
    {
        if (strlen($nik) !== 16 || !is_numeric($nik)) {
            return response()->json(['message' => 'NIK tidak valid'], 400);
        }

        $cityCode = substr($nik, 0, 4);
        $city = \DB::table('indonesia_cities')->where('code', $cityCode)->first();
        $place_of_birth = $city ? $city->name : null;

        $dd = (int) substr($nik, 6, 2);
        $mm = (int) substr($nik, 8, 2);
        $yy = (int) substr($nik, 10, 2);

        $gender = 'L';
        if ($dd > 40) {
            $gender = 'P';
            $dd -= 40;
        }

        $currentYear = (int) date('Y');
        $currentYY = $currentYear % 100;

        if ($yy > $currentYY + 5) {
            $year = 1900 + $yy;
        } else {
            $year = 2000 + $yy;
        }

        $date_of_birth = sprintf('%04d-%02d-%02d', $year, $mm, $dd);

        if (!checkdate($mm, $dd, $year)) {
            $date_of_birth = null;
        }

        return response()->json([
            'place_of_birth' => $place_of_birth,
            'date_of_birth' => $date_of_birth,
            'gender' => $gender
        ]);
    }

    public function storePublic(Request $request)
    {
        $activeYear = \App\Models\AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            return response()->json(['message' => 'Pendaftaran saat ini ditutup. Tidak ada tahun ajaran aktif.'], 403);
        }

        $activeBatch = $activeYear->batches()->where('is_active', true)->first();
        if (!$activeBatch) {
            return response()->json(['message' => 'Pendaftaran saat ini ditutup. Tidak ada gelombang pendaftaran yang buka.'], 403);
        }

        $data = $request->except(['father_name', 'father_occupation', 'mother_name', 'mother_occupation', 'phone_number', 'parent_phone_number', 'photo']);
        $data['academic_year_id'] = $activeYear->id;
        $data['ppdb_batch_id'] = $activeBatch->id;
        $data['parent_name'] = $request->input('father_name', $request->input('mother_name'));
        $data['parent_phone'] = $request->input('parent_phone_number', $request->input('phone_number'));
        
        $reg = new PpdbRegistration($data);
        $reg->registration_number = 'PPDB-' . date('Y') . '-' . strtoupper(Str::random(5));
        $reg->status = 'pending';
        // Give a default gender if not provided
        if (!isset($reg->gender)) $reg->gender = 'L';
        $reg->save();

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('ppdb/photos', 'public');
            
            $mime = $file->getClientMimeType();
            if (str_starts_with($mime, 'image/')) {
                $fullPath = storage_path('app/public/' . $path);
                $newPath = preg_replace('/\.[^.]+$/', '.webp', $path);
                $newFullPath = storage_path('app/public/' . $newPath);
                
                $img = null;
                if ($mime == 'image/jpeg' || $mime == 'image/jpg') $img = @imagecreatefromjpeg($fullPath);
                elseif ($mime == 'image/png') $img = @imagecreatefrompng($fullPath);
                
                if ($img !== false && $img !== null) {
                    imagepalettetotruecolor($img);
                    imagealphablending($img, true);
                    imagesavealpha($img, true);
                    imagewebp($img, $newFullPath, 80);
                    imagedestroy($img);
                    @unlink($fullPath);
                    $path = $newPath;
                }
            }
            $reg->photo_path = $path;
            $reg->save();
        }

        return response()->json(['message' => 'Registration successful', 'data' => $reg], 201);
    }

    public function store(Request $request)
    {
        $data = $request->except(['father_name', 'father_occupation', 'mother_name', 'mother_occupation', 'phone_number', 'parent_phone_number', 'documents', 'photo']);
        $data['parent_name'] = $request->input('father_name', $request->input('mother_name'));
        $data['parent_phone'] = $request->input('parent_phone_number', $request->input('phone_number'));

        $reg = new PpdbRegistration($data);
        $reg->registration_number = 'PPDB-' . date('Y') . '-' . strtoupper(Str::random(5));
        $reg->status = $request->input('status', 'pending');
        if (!isset($reg->gender)) $reg->gender = 'L';
        $reg->save();

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('ppdb/photos', 'public');
            
            $mime = $file->getClientMimeType();
            if (str_starts_with($mime, 'image/')) {
                $fullPath = storage_path('app/public/' . $path);
                $newPath = preg_replace('/\.[^.]+$/', '.webp', $path);
                $newFullPath = storage_path('app/public/' . $newPath);
                
                $img = null;
                if ($mime == 'image/jpeg' || $mime == 'image/jpg') $img = @imagecreatefromjpeg($fullPath);
                elseif ($mime == 'image/png') $img = @imagecreatefrompng($fullPath);
                
                if ($img !== false && $img !== null) {
                    imagepalettetotruecolor($img);
                    imagealphablending($img, true);
                    imagesavealpha($img, true);
                    imagewebp($img, $newFullPath, 80);
                    imagedestroy($img);
                    @unlink($fullPath);
                    $path = $newPath;
                }
            }
            $reg->photo_path = $path;
            $reg->save();
        }

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $req_id => $file) {
                $path = $file->store('ppdb/documents', 'public');
                
                $mime = $file->getClientMimeType();
                if (str_starts_with($mime, 'image/')) {
                    $fullPath = storage_path('app/public/' . $path);
                    $newPath = preg_replace('/\.[^.]+$/', '.webp', $path);
                    $newFullPath = storage_path('app/public/' . $newPath);
                    
                    $img = null;
                    if ($mime == 'image/jpeg' || $mime == 'image/jpg') $img = @imagecreatefromjpeg($fullPath);
                    elseif ($mime == 'image/png') $img = @imagecreatefrompng($fullPath);
                    
                    if ($img !== false && $img !== null) {
                        imagepalettetotruecolor($img);
                        imagealphablending($img, true);
                        imagesavealpha($img, true);
                        imagewebp($img, $newFullPath, 80);
                        imagedestroy($img);
                        @unlink($fullPath);
                        $path = $newPath;
                    }
                }
                
                $reg->documents()->create([
                    'ppdb_document_requirement_id' => $req_id,
                    'file_path' => $path,
                    'status' => 'pending'
                ]);
            }
        }

        return response()->json(['message' => 'Registration successful', 'data' => $reg], 201);
    }

    public function index()
    {
        return response()->json(PpdbRegistration::with(['batch', 'path', 'documents'])->orderBy('registered_at', 'desc')->get());
    }

    public function show($id)
    {
        return response()->json(PpdbRegistration::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $reg = PpdbRegistration::findOrFail($id);
        
        $data = $request->except(['father_name', 'father_occupation', 'mother_name', 'mother_occupation', 'phone_number', 'parent_phone_number', 'documents', 'photo', '_method']);
        $data['parent_name'] = $request->input('father_name', $request->input('mother_name'));
        $data['parent_phone'] = $request->input('parent_phone_number', $request->input('phone_number'));
        
        $reg->update($data);

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('ppdb/photos', 'public');
            
            $mime = $file->getClientMimeType();
            if (str_starts_with($mime, 'image/')) {
                $fullPath = storage_path('app/public/' . $path);
                $newPath = preg_replace('/\.[^.]+$/', '.webp', $path);
                $newFullPath = storage_path('app/public/' . $newPath);
                
                $img = null;
                if ($mime == 'image/jpeg' || $mime == 'image/jpg') $img = @imagecreatefromjpeg($fullPath);
                elseif ($mime == 'image/png') $img = @imagecreatefrompng($fullPath);
                
                if ($img !== false && $img !== null) {
                    imagepalettetotruecolor($img);
                    imagealphablending($img, true);
                    imagesavealpha($img, true);
                    imagewebp($img, $newFullPath, 80);
                    imagedestroy($img);
                    @unlink($fullPath);
                    $path = $newPath;
                }
            }
            if ($reg->photo_path) {
                @unlink(storage_path('app/public/' . $reg->photo_path));
            }
            $reg->photo_path = $path;
            $reg->save();
        }

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $req_id => $file) {
                $path = $file->store('ppdb/documents', 'public');
                
                $mime = $file->getClientMimeType();
                if (str_starts_with($mime, 'image/')) {
                    $fullPath = storage_path('app/public/' . $path);
                    $newPath = preg_replace('/\.[^.]+$/', '.webp', $path);
                    $newFullPath = storage_path('app/public/' . $newPath);
                    
                    $img = null;
                    if ($mime == 'image/jpeg' || $mime == 'image/jpg') $img = @imagecreatefromjpeg($fullPath);
                    elseif ($mime == 'image/png') $img = @imagecreatefrompng($fullPath);
                    
                    if ($img !== false && $img !== null) {
                        imagepalettetotruecolor($img);
                        imagealphablending($img, true);
                        imagesavealpha($img, true);
                        imagewebp($img, $newFullPath, 80);
                        imagedestroy($img);
                        @unlink($fullPath);
                        $path = $newPath;
                    }
                }
                
                $oldDoc = $reg->documents()->where('ppdb_document_requirement_id', $req_id)->first();
                if ($oldDoc) {
                    @unlink(storage_path('app/public/' . $oldDoc->file_path));
                    $oldDoc->delete();
                }

                $reg->documents()->create([
                    'ppdb_document_requirement_id' => $req_id,
                    'file_path' => $path,
                    'status' => 'pending'
                ]);
            }
        }

        return response()->json(['message' => 'Updated successfully', 'data' => $reg]);
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

    public function export()
    {
        return Excel::download(new PpdbExport, 'Data_PPDB_' . date('Y-m-d') . '.xlsx');
    }

    public function publicInfo()
    {
        $activeYear = \App\Models\AcademicYear::with(['batches' => function($q) {
            $q->where('is_active', true)->orderBy('end_date', 'asc');
        }])->where('is_active', true)->first();

        return response()->json($activeYear);
    }
}
