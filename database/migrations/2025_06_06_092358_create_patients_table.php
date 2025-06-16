<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('hn')->unique();
            $table->string('token')->unique();
            $table->boolean('photo_consent')->nullable();
            $table->boolean('insurance_consent')->nullable();
            $table->boolean('treatment_consent')->nullable();
            $table->boolean('benefit_consent')->nullable();
            $table->dateTime('expires_at', precision: 0)->default(now());
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
