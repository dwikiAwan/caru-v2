<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Akun Admin Default untuk Login Dashboard
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name'     => 'Admin Agrowisata',
                'email'    => 'admin@gmail.com',
                'password' => Hash::make('123456'),
                'role'     => 'admin',
            ]
        );

        // 2. Buat Akun Customer Dummy
        User::updateOrCreate(
            ['username' => 'pengunjung'],
            [
                'name'     => 'Pengunjung Kebun',
                'email'    => 'user@gmail.com',
                'password' => Hash::make('123456'),
                'role'     => 'customer',
            ]
        );
    }
}