<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notice extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'reference_code',
        'status',
        'audience',
        'category',
        'created_by',
        'published_at',
        'expires_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who created this notice
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope to get published notices
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope to get active notices (not expired)
     */
    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

    /**
     * Check if notice is expired
     */
    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Generate unique reference code
     */
    public static function generateReferenceCode($category = 'notice')
    {
        $prefix = 'RA-' . strtoupper(substr($category, 0, 3)) . '-' . date('Y');
        $lastNotice = self::where('reference_code', 'like', $prefix . '%')
            ->latest('reference_code')
            ->first();

        $number = 1;
        if ($lastNotice) {
            $lastNumber = intval(substr($lastNotice->reference_code, -3));
            $number = $lastNumber + 1;
        }

        return $prefix . '-' . str_pad($number, 3, '0', STR_PAD_LEFT);
    }
}
