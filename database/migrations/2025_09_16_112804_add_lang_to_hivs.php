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
        Schema::table('h_i_v_s', function (Blueprint $table) {
            $table->string('lang')->default('th');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('h_i_v_s', function (Blueprint $table) {
            $table->dropColumn('lang');
        });
    }
};
