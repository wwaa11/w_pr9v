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
        Schema::create('mind9_q_s', function (Blueprint $table) {
            $table->id();
            $table->string('hn');
            $table->string('language')->default('th');
            $table->string('answer1')->nullable();
            $table->string('answer2')->nullable();
            $table->string('answer3')->nullable();
            $table->string('answer4')->nullable();
            $table->string('answer5')->nullable();
            $table->string('answer6')->nullable();
            $table->string('answer7')->nullable();
            $table->string('answer8')->nullable();
            $table->string('answer9')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mind9_q_s');
    }
};
