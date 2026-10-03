<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email'    => 'nullable|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'username' => $request->username,
            'email'    => $request->email ?? ($request->username . '@eduagro.com'),
            'password' => Hash::make($request->password),
            'role'     => 'customer',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'       => 'success',
            'message'      => 'Registrasi berhasil',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ], 201);
    }

    public function login(Request $request)
{
    $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    // Cari user berdasarkan username ATAU email
    $user = User::where('username', $request->username)
                ->orWhere('email', $request->username)
                ->first();

    // Verifikasi keberadaan user dan kecocokan password hash
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Username/Email atau password salah!',
        ], 401);
    }

    // Buat token Sanctum untuk autentikasi API
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'status'       => 'success',
        'message'      => 'Login berhasil',
        'access_token' => $token,
        'token_type'   => 'Bearer',
        'user'         => $user,
    ], 200);
}
}