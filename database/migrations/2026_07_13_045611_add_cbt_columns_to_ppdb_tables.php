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
        Schema::table('ppdb_paths', function (Blueprint $table) {
            $table->boolean('requires_cbt')->default(false)->after('is_active');
        });

        Schema::table('ppdb_registrations', function (Blueprint $table) {
            $table->string('exam_number')->nullable()->unique()->after('registration_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ppdb_paths', function (Blueprint $table) {
            $table->dropColumn('requires_cbt');
        });

        Schema::table('ppdb_registrations', function (Blueprint $table) {
            $table->dropColumn('exam_number');
        });
    }
};
