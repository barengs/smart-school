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
        Schema::table('teachers', function (Blueprint $table) {
            $table->string('nik')->nullable();
            $table->string('kk_number')->nullable();
            $table->string('birth_place')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('employment_status', ['PNS', 'PPPK', 'Non-ASN'])->nullable();
            $table->string('nrg')->nullable();
            $table->string('base_administration')->nullable();
            $table->string('certification_subject')->nullable();
            $table->decimal('ukg_score', 5, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn([
                'nik', 'kk_number', 'birth_place', 'birth_date',
                'employment_status', 'nrg', 'base_administration',
                'certification_subject', 'ukg_score'
            ]);
        });
    }
};
