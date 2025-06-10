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
        Schema::create('consents', function (Blueprint $table) {
            $table->id();
            $table->string('hn');
            $table->string('type');
            $table->string('signature_name');
            $table->text('signature');
            $table->boolean('consent_1')->nullable();
            $table->boolean('consent_2')->nullable();
            $table->boolean('consent_3')->nullable();
            $table->boolean('consent_4')->nullable();
            $table->boolean('consent_5')->nullable();
            $table->boolean('consent_6')->nullable();
            $table->boolean('consent_7')->nullable();
            $table->boolean('consent_8')->nullable();
            $table->boolean('consent_9')->nullable();
            $table->boolean('consent_10')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consents');
    }
};
