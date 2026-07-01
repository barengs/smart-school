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
        Schema::create('ppdb_registration_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_registration_id')->constrained('ppdb_registrations')->cascadeOnDelete();
            $table->foreignId('ppdb_document_requirement_id')->constrained('ppdb_document_requirements')->cascadeOnDelete();
            $table->string('file_path');
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppdb_registration_documents');
    }
};
