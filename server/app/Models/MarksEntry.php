<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarksEntry extends Model
{
    use HasFactory;

    protected $table = 'marks_entries';

    protected $fillable = [
        'student_id',
        'course_offering_id',
        'teacher_id',
        'assessment_type',
        'marks_obtained',
        'marks_out_of',
        'entry_date',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'entry_date' => 'date',
        'marks_obtained' => 'decimal:2',
        'marks_out_of' => 'integer',
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

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
