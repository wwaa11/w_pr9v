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
        Schema::create('h_i_v_s', function (Blueprint $table) {
            $table->id();
            $table->string('hn');
            $table->string('type');
            $table->string('vn')->nullable();
            $table->date('visit_date')->nullable();
            $table->time('visit_time')->nullable();
            $table->string('doctor_name')->nullable();
            $table->string('name');
            $table->string('name_type');
            $table->string('name_relation')->nullable();
            $table->string('name_phone')->nullable();
            $table->string('name_address')->nullable();
            $table->text('signature');
            $table->string('hiv_consent');
            $table->string('hiv_name')->nullable();
            $table->string('informer_user_id');
            $table->string('witness1_user_id');
            $table->string('witness2_user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('h_i_v_s');
    }
};
