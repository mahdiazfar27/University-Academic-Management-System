<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Result extends Model
{
    use HasFactory;

    protected $table = 'results';

    protected $fillable = [
        'student_id',
        'course_offering_id',
        'enrollment_id',
        'semester_id',
        'final_marks',
        'grade',
        'grade_point',
        'quality_points',
        'semester_gpa',
        'cgpa',
        'is_regular',
        'result_status',
        'result_date',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'result_date' => 'date',
        'final_marks' => 'decimal:2',
        'grade_point' => 'decimal:2',
        'quality_points' => 'decimal:2',
        'semester_gpa' => 'decimal:3',
        'cgpa' => 'decimal:3',
        'is_regular' => 'boolean',
    ];

    // ==================== ACCESSORS ====================
    public function getGradeNameAttribute()
    {
        $gradeMap = [
            'A+' => 4.0, 'A' => 3.75, 'A-' => 3.5, 'B+' => 3.25,
            'B' => 3.0, 'B-' => 2.75, 'C+' => 2.5, 'C' => 2.25,
            'C-' => 2.0, 'D+' => 1.75, 'D' => 1.5, 'F' => 0.0
        ];
        return $this->grade . ' (' . $gradeMap[$this->grade] . ')';
    }

    // ==================== RELATIONSHIPS ====================
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function courseOffering(): BelongsTo
    {
        return $this->belongsTo(CourseOffering::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }
}
