<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ContactExport;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $contacts = Contact::orderByRaw("FIELD(status, 'new', 'read', 'replied')")
                           ->orderBy('created_at', 'desc')
                           ->get();
        return response()->json($contacts);
    }

    public function storePublic(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'message' => 'Pesan Anda telah berhasil dikirim.',
            'contact' => $contact
        ], 201);
    }

    public function show($id)
    {
        $contact = Contact::findOrFail($id);
        
        // Mark as read when opened in admin
        if ($contact->status === 'new') {
            $contact->status = 'read';
            $contact->save();
        }
        
        return response()->json($contact);
    }

    public function export()
    {
        return Excel::download(new ContactExport(), 'Layanan_Publik_' . date('Y-m-d') . '.xlsx');
    }
}
