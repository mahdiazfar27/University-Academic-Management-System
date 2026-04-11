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
        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('reference_code')->unique(); // e.g., RA-NOT-2024-082
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->enum('audience', ['all', 'students', 'teachers', 'admin', 'faculty'])->default('all');
            $table->enum('category', ['announcement', 'alert', 'scholarship', 'event', 'academic', 'other'])->default('announcement');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->dateTime('published_at')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('audience');
            $table->index('category');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notices');
    }
};
