<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Menampilkan seluruh daftar pesan / ulasan untuk Admin & Beranda
     */
    public function index()
    {
        $messages = Message::latest()->get();
        return response()->json($messages, 200);
    }

    /**
     * Menyimpan pesan kontak / ulasan baru dari pengunjung atau Admin
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'nullable|string|max:50',
            'message' => 'required|string',
            'rating'  => 'nullable|integer|min:1|max:5',
        ]);

        // Default rating 5 jika tidak diisi
        if (!isset($validated['rating'])) {
            $validated['rating'] = 5;
        }

        $message = Message::create($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Pesan / testimoni berhasil dikirim',
            'data'    => $message
        ], 201);
    }

    /**
     * Menghapus pesan / ulasan berdasarkan ID dari Admin
     */
    public function destroy($id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pesan tidak ditemukan'
            ], 404);
        }

        $message->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Pesan berhasil dihapus'
        ], 200);
    }
}