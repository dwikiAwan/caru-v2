<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reservation_code')->nullable();
            $table->string('name');
            $table->string('phone');
            $table->string('category')->default('Personal'); // Personal, Sekolah, Institusi
            $table->string('service_title');
            $table->date('visit_date');
            $table->integer('total_people')->default(1);
            $table->text('notes')->nullable();
            $table->string('status')->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};