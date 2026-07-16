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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
            $table->integer('meeting_number'); // 1, 2, 3...
            $table->date('planned_date');
            $table->string('planned_time')->nullable();
            $table->date('actual_date')->nullable();
            $table->string('actual_time')->nullable();
            $table->string('type')->nullable(); // Tatap Muka, Online
            $table->text('topic')->nullable();
            $table->text('material')->nullable();
            $table->enum('lecturer_presence', ['Hadir', 'Tidak Hadir'])->nullable();
            $table->text('notes')->nullable();
            $table->string('learning_method')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
