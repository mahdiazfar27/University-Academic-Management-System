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
        Schema::create('attendance', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_offering_id');
            $table->string('student_id');
            $table->date('attendance_date');
            $table->boolean('is_present')->default(false);
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('course_offering_id')
                ->references('id')
                ->on('course_offerings')
                ->onDelete('cascade');
            
            // Composite unique constraint (one record per student per date per course)
            $table->unique(['course_offering_id', 'student_id', 'attendance_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance');
    }
};
