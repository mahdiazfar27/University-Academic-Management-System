<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    use HasFactory;

    protected $table = 'enrollments';

    protected $fillable = [
        'student_id',
        'course_offering_id',
        'semester_id',
        'enrollment_status',
        'enrollment_date',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'enrollment_date' => 'date',
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

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function result(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Result::class, 'enrollment_id');
    }
}
