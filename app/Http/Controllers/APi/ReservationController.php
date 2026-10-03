<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Exception;

class ReservationController extends Controller
{
    /**
     * Menampilkan semua daftar reservasi untuk Dashboard Admin
     */
    public function index()
    {
        try {
            $reservations = Reservation::latest()->get();
            return response()->json($reservations, 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengambil data reservasi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menyimpan data reservasi wisata baru dari pengunjung
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'             => 'required|string|max:255',
                'phone'            => 'required|string|max:50',
                'category'         => 'nullable|string|max:100',
                'service_title'    => 'required|string|max:255',
                'visit_date'       => 'required|date',
                'total_people'     => 'required|integer|min:1',
                'notes'            => 'nullable|string',
                'reservation_code' => 'nullable|string',
                'status'           => 'nullable|string',
            ]);

            // Generate kode reservasi otomatis jika belum dikirim dari frontend
            $reservationCode = $validated['reservation_code'] ?? 'RSV-' . strtoupper(Str::random(6));

            $reservation = Reservation::create([
                'reservation_code' => $reservationCode,
                'name'             => $validated['name'],
                'phone'            => $validated['phone'],
                'category'         => $validated['category'] ?? 'Personal',
                'service_title'    => $validated['service_title'],
                'visit_date'       => $validated['visit_date'],
                'total_people'     => $validated['total_people'],
                'notes'            => $validated['notes'] ?? null,
                'status'           => $validated['status'] ?? 'Pending',
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Reservasi wisata berhasil dibuat',
                'data'    => $reservation
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal membuat reservasi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail 1 reservasi berdasarkan ID
     */
    public function show($id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Data reservasi tidak ditemukan'
            ], 404);
        }

        return response()->json($reservation, 200);
    }

    /**
     * Memperbarui status atau detail reservasi dari Dashboard Admin
     */
    public function update(Request $request, $id)
    {
        try {
            $reservation = Reservation::find($id);

            if (!$reservation) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Data reservasi tidak ditemukan'
                ], 404);
            }

            $validated = $request->validate([
                'name'          => 'sometimes|required|string|max:255',
                'phone'         => 'sometimes|required|string|max:50',
                'category'      => 'nullable|string|max:100',
                'service_title' => 'sometimes|required|string|max:255',
                'visit_date'    => 'sometimes|required|date',
                'total_people'  => 'sometimes|required|integer|min:1',
                'notes'         => 'nullable|string',
                'status'        => 'nullable|string',
            ]);

            $reservation->update($validated);

            return response()->json([
                'status'  => 'success',
                'message' => 'Reservasi berhasil diperbarui',
                'data'    => $reservation
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbarui reservasi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus data reservasi dari Dashboard Admin
     */
    public function destroy($id)
    {
        try {
            $reservation = Reservation::find($id);

            if (!$reservation) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Data reservasi tidak ditemukan'
                ], 404);
            }

            $reservation->delete();

            return response()->json([
                'status'  => 'success',
                'message' => 'Reservasi berhasil dihapus'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menghapus reservasi: ' . $e->getMessage()
            ], 500);
        }
    }
}