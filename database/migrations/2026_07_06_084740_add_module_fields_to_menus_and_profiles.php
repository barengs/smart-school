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
        Schema::table('menus', function (Blueprint $table) {
            $table->string('module')->nullable()->after('type');
        });

        Schema::table('school_profiles', function (Blueprint $table) {
            $table->json('active_modules')->nullable()->after('public_theme');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn('module');
        });
        
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->dropColumn('active_modules');
        });
    }
};
