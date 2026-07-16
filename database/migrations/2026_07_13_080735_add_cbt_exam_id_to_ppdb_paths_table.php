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
            $table->foreignId('cbt_exam_id')->nullable()->constrained('cbt_exams')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ppdb_paths', function (Blueprint $table) {
            $table->dropForeign(['cbt_exam_id']);
            $table->dropColumn('cbt_exam_id');
        });
    }
};
