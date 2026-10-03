<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Exception;

class PostController extends Controller
{
    /**
     * Menampilkan semua daftar artikel
     */
    public function index()
    {
        try {
            $posts = Post::latest()->get();
            return response()->json($posts, 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengambil data artikel: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menyimpan artikel baru
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title'    => 'required|string|max:255',
                'author'   => 'nullable|string',
                'category' => 'nullable|string',
                'content'  => 'required|string',
                'image'    => 'nullable|string',
            ]);

            $validated['author']   = $validated['author'] ?? 'Admin';
            $validated['category'] = $validated['category'] ?? 'Berita';

            $post = Post::create($validated);

            return response()->json([
                'status'  => 'success',
                'message' => 'Artikel berhasil disimpan',
                'data'    => $post
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menyimpan artikel: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail satu artikel
     */
    public function show($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        return response()->json($post, 200);
    }

    /**
     * Memperbarui artikel
     */
    public function update(Request $request, $id)
    {
        try {
            $post = Post::find($id);

            if (!$post) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Artikel tidak ditemukan'
                ], 404);
            }

            $validated = $request->validate([
                'title'    => 'sometimes|required|string|max:255',
                'author'   => 'nullable|string',
                'category' => 'nullable|string',
                'content'  => 'sometimes|required|string',
                'image'    => 'nullable|string',
            ]);

            $post->update($validated);

            return response()->json([
                'status'  => 'success',
                'message' => 'Artikel berhasil diperbarui',
                'data'    => $post
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbarui artikel: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus artikel
     */
    public function destroy($id)
    {
        try {
            $post = Post::find($id);

            if (!$post) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Artikel tidak ditemukan'
                ], 404);
            }

            $post->delete();

            return response()->json([
                'status'  => 'success',
                'message' => 'Artikel berhasil dihapus'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menghapus artikel: ' . $e->getMessage()
            ], 500);
        }
    }
}