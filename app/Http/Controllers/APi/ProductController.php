<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Exception;

class ProductController extends Controller
{
    /**
     * Menampilkan semua data produk
     */
    public function index()
    {
        try {
            $products = Product::latest()->get();
            return response()->json($products, 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengambil data produk: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menyimpan produk baru
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'        => 'required|string|max:255',
                'category'    => 'nullable|string',
                'price'       => 'required|numeric',
                'stock'       => 'required|numeric',
                'unit'        => 'nullable|string',
                'description' => 'nullable|string',
                'image'       => 'nullable|string',
            ]);

            $validated['category'] = $validated['category'] ?? 'Hasil Panen';
            $validated['unit']     = $validated['unit'] ?? 'kg';
            $validated['image']    = $validated['image'] ?? 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500';

            $product = Product::create($validated);

            return response()->json([
                'status'  => 'success',
                'message' => 'Produk berhasil ditambahkan',
                'data'    => $product
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menambah produk: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail satu produk
     */
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }

        return response()->json($product, 200);
    }

    /**
     * Memperbarui data produk
     */
    public function update(Request $request, $id)
{
    try {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'category'    => 'nullable|string',
            'price'       => 'sometimes|required|numeric',
            'stock'       => 'sometimes|required|numeric',
            'unit'        => 'nullable|string',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
        ]);

        $product->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Produk berhasil diperbarui',
            'data'    => $product
        ], 200);
    } catch (Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}

    /**
     * Menghapus produk
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }

        $product->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Produk berhasil dihapus'
        ], 200);
    }
}