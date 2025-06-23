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
        Schema::create('sleepness_forms', function (Blueprint $table) {
            $table->id();
            $table->string('hn');
            $table->string('type');
            $table->string('vn')->nullable();
            $table->datetime('visit_date')->nullable();
            $table->string('doctor_name')->nullable();
            $table->string('patient_type');
            $table->string('relative_name')->nullable();
            $table->string('relative_relation')->nullable();
            $table->string('weight');
            $table->string('height');
            $table->string('bmi');
            $table->string('neck_size');
            $table->boolean('disease');
            $table->string('disease_text')->nullable();
            $table->boolean('medicine');
            $table->string('medicine_text')->nullable();
            $table->boolean('sleep_pill');
            $table->string('sleep_pill_text')->nullable();
            $table->boolean('tobacco');
            $table->boolean('alcohol');
            $table->boolean('caffeine');
            $table->json('sleep_problem');
            $table->json('sleep_situation');
            $table->json('sleep_schedule');
            $table->string('informer_user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sleepness_forms');
    }
};
