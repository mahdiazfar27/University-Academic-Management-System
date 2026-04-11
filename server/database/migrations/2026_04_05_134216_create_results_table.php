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
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->string('student_id', 20);
            $table->foreignId('course_offering_id')->constrained()->onDelete('cascade');
            $table->foreignId('enrollment_id')->constrained()->onDelete('cascade');
            $table->foreignId('semester_id')->constrained()->onDelete('cascade');
            $table->decimal('final_marks', 5, 2);
            $table->string('grade', 5);
            $table->decimal('grade_point', 3, 2);
            $table->decimal('quality_points', 4, 2);
            $table->decimal('semester_gpa', 4, 3);
            $table->decimal('cgpa', 4, 3);
            $table->boolean('is_regular')->default(true);
            $table->string('result_status', 20)->default('Published');
            $table->date('result_date');
            $table->timestamps();
            
            $table->unique(['student_id', 'course_offering_id', 'enrollment_id'], 'unique_result');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
