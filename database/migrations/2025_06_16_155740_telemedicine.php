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
        Schema::create('telemedicines', function (Blueprint $table) {
            $table->id();
            $table->string('hn');
            $table->string('type');
            $table->string('signature_type');
            $table->string('signature_name');
            $table->text('signature');
            $table->boolean('telemedicine_consent');
            $table->boolean('treatment_consent');
            $table->boolean('insurance_consent');
            $table->boolean('benefit_consent');
            $table->string('informer_user_id');
            $table->string('witness_user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telemedicines');
    }
};
