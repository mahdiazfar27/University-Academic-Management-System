<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseOffering extends Model
{
    use HasFactory;

    protected $table = 'course_offerings';

    protected $fillable = [
        'course_id',
        'semester_id',
        'teacher_id',
        'section',
        'room_number',
        'class_time',
        'day_of_week',
        'enrollment_limit',
        'current_enrollment',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'enrollment_limit' => 'integer',
        'current_enrollment' => 'integer',
    ];

    // ==================== RELATIONSHIPS ====================
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }

    public function marksEntry(): HasMany
    {
        return $this->hasMany(MarksEntry::class);
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
