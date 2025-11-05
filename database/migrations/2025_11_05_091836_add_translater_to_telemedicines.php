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
        Schema::table('telemedicines', function (Blueprint $table) {
            $table->string('translate_lang', 10)->nullable()->after('doctor_name');
            $table->string('translate_name', 255)->nullable()->after('translate_lang');
            $table->boolean('video_consent')->default(false)->after('marketing_consent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('telemedicines', function (Blueprint $table) {
            $table->dropColumn(['translate_lang', 'translate_name']);
        });
    }
};
