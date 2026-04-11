<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'user_id',
        'department_id',
        'student_id',
        'admission_year',
        'current_semester',
        'gpa',
        'cgpa',
        'admission_semester',
        'enrollment_status',
        'father_name',
        'mother_name',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'admission_year' => 'integer',
        'current_semester' => 'integer',
        'gpa' => 'decimal:2',
        'cgpa' => 'decimal:2',
    ];

    // ==================== ACCESSORS ====================
    public function getFullNameAttribute()
    {
        return $this->user?->first_name . ' ' . $this->user?->last_name;
    }

    public function getFullUserInfoAttribute()
    {
        return [
            'student_id' => $this->student_id,
            'name' => $this->full_name,
            'email' => $this->user?->email,
            'department' => $this->department?->name,
            'cgpa' => $this->cgpa,
            'enrollment_status' => $this->enrollment_status,
        ];
    }

    // ==================== RELATIONSHIPS ====================
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'student_id', 'student_id');
    }

    public function results(): HasMany
    {
        return $this->hasMany(Result::class, 'student_id', 'student_id');
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(Attendance::class, 'student_id', 'student_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'student_id', 'student_id');
    }

    public function marksEntry(): HasMany
    {
        return $this->hasMany(MarksEntry::class, 'student_id', 'student_id');
    }
}
