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
        Schema::table('sleepness_forms', function (Blueprint $table) {
            $table->renameColumn('relative_name', 'name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sleepness_forms', function (Blueprint $table) {
            $table->renameColumn('name', 'relative_name');
        });
    }
};
