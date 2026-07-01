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
        Schema::table('ppdb_registrations', function (Blueprint $table) {
            $table->foreignId('ppdb_batch_id')->nullable()->after('id')->constrained('ppdb_batches')->nullOnDelete();
            $table->foreignId('ppdb_path_id')->nullable()->after('ppdb_batch_id')->constrained('ppdb_paths')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ppdb_registrations', function (Blueprint $table) {
            $table->dropForeign(['ppdb_batch_id']);
            $table->dropForeign(['ppdb_path_id']);
            $table->dropColumn(['ppdb_batch_id', 'ppdb_path_id']);
        });
    }
};
