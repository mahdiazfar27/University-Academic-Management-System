<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';

    protected $fillable = [
        'student_id',
        'course_offering_id',
        'attendance_date',
        'is_present',
        'status',
        'remarks',
        'recorded_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'attendance_date' => 'date',
    ];

    // ==================== RELATIONSHIPS ====================
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function courseOffering(): BelongsTo
    {
        return $this->belongsTo(CourseOffering::class);
    }

    public function recordedByTeacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'recorded_by');
    }
}
