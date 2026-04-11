<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'status',
        'phone_number',
        'date_of_birth',
        'gender',
        'blood_group',
        'religion',
        'profile_image_url',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'date_of_birth' => 'date',
    ];

    // ==================== ACCESSORS ====================
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // ==================== RELATIONSHIPS ====================
    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    public function teacher(): HasOne
    {
        return $this->hasOne(Teacher::class);
    }

    public function adminLogs(): HasMany
    {
        return $this->hasMany(AdminLog::class, 'admin_user_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
