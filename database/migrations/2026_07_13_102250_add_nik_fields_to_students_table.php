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
        Schema::table('students', function (Blueprint $table) {
            $table->string('nik', 16)->nullable()->unique()->after('user_id');
            $table->string('father_nik', 16)->nullable();
            $table->string('mother_nik', 16)->nullable();
            $table->string('guardian_nik', 16)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['nik', 'father_nik', 'mother_nik', 'guardian_nik']);
        });
    }
};
