<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ReviewMedia Model
 * 
 * Manages media attachments (images/videos) for product reviews
 * Supports multiple media types with metadata and display ordering
 */
class ReviewMedia extends Model
{
    use HasFactory;

    protected $table = 'review_media';

    protected $fillable = [
        'review_id',
        'media_type',
        'file_name',
        'file_path',
        'mime_type',
        'file_size',
        'metadata',
        'display_order',
        'is_primary',
    ];

    protected $casts = [
        'metadata' => 'array',
        'file_size' => 'integer',
        'display_order' => 'integer',
        'is_primary' => 'boolean',
    ];

    /**
     * Get the review that owns this media
     */
    public function review(): BelongsTo
    {
        return $this->belongsTo(Review::class, 'review_id', 'review_id');
    }

    /**
     * Scope to get primary media
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope to get media by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('media_type', $type);
    }

    /**
     * Get media ordered by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}