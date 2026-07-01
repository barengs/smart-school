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
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->string('accreditation')->nullable()->after('email');
            $table->string('nsm')->nullable()->after('accreditation');
            $table->enum('status', ['Negeri', 'Swasta'])->default('Negeri')->after('nsm');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->dropColumn(['accreditation', 'nsm', 'status']);
        });
    }
};
