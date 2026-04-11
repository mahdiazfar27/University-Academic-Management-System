<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'student_id',
        'semester',
        'fee_group',
        'amount',
        'currency',
        'application_date',
        'payment_date',
        'payment_method',
        'transaction_id',
        'payment_status',
        'verified_by',
        'verification_date',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'application_date' => 'date',
        'payment_date' => 'date',
        'verification_date' => 'datetime',
        'amount' => 'decimal:2',
    ];

    // ==================== RELATIONSHIPS ====================
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function verifiedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
