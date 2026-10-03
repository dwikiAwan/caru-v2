<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Menampilkan semua daftar pesanan masuk untuk Admin
     */
    public function index()
    {
        try {
            $orders = Order::latest()->get();
            return response()->json($orders, 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengambil data pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menyimpan transaksi checkout baru dari Marketplace
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer'   => 'required|string|max:255',
            'phone'      => 'required|string|max:50',
            'items'      => 'required', // Bisa berupa string JSON atau array
            'total'      => 'required|numeric',
            'order_code' => 'nullable|string',
            'status'     => 'nullable|string',
        ]);

        // Generate kode pesanan otomatis jika belum dikirim dari frontend
        $orderCode = $validated['order_code'] ?? 'ORD-' . strtoupper(Str::random(6));

        // Ubah items menjadi format string/text jika yang dikirim berupa array/object
        $itemsData = is_array($validated['items']) || is_object($validated['items'])
            ? json_encode($validated['items'])
            : $validated['items'];

        $order = Order::create([
            'order_code' => $orderCode,
            'customer'   => $validated['customer'],
            'phone'      => $validated['phone'],
            'items'      => $itemsData,
            'total'      => $validated['total'],
            'status'     => $validated['status'] ?? 'Menunggu Verifikasi',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Pesanan berhasil dibuat',
            'data'    => $order
        ], 201);
    }

    /**
     * Menampilkan detail 1 pesanan berdasarkan ID
     */
    public function show($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        return response()->json($order, 200);
    }

    /**
     * Memperbarui status pesanan dari Dashboard Admin
     */
    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        $order->update($request->all());

        return response()->json([
            'status'  => 'success',
            'message' => 'Status pesanan berhasil diperbarui',
            'data'    => $order
        ], 200);
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $order = Order::find($id);

            if (!$order) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Pesanan tidak ditemukan'
                ], 404);
            }

            $validated = $request->validate([
                'status' => 'required|string|in:Pending,Diproses,Dikirim,Selesai,Dibatalkan',
            ]);

            $order->update([
                'status' => $validated['status']
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Status pesanan berhasil diperbarui',
                'data'    => $order
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbarui status pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus pesanan berdasarkan ID
     */
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        $order->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Pesanan berhasil dihapus'
        ], 200);
    }

    /**
     * (Opsional) Mengambil pesanan milik user spesifik jika menggunakan sistem auth Sanctum
     */
    public function userOrders(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([], 200);
        }

        $orders = Order::where('customer', $user->name)
            ->orWhere('phone', $user->phone ?? '')
            ->latest()
            ->get();

        return response()->json($orders, 200);
    }
}
