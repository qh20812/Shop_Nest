<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionTemplate extends Model
{
    use HasFactory;

    protected $primaryKey = 'template_id';

    protected $fillable = [
        'name',
        'description',
        'type',
        'value',
        'config',
        'category',
        'is_public',
        'created_by',
    ];

    protected $casts = [
        'config' => 'array',
        'value' => 'decimal:2',
        'is_public' => 'boolean',
    ];

    /**
     * Get the user who created this template
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope for public templates
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope for templates by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Get template configuration as array
     */
    public function getConfig(): array
    {
        return $this->config ?? [];
    }

    /**
     * Check if template is seasonal
     */
    public function isSeasonal(): bool
    {
        return $this->category === 'seasonal';
    }

    /**
     * Check if template is category specific
     */
    public function isCategorySpecific(): bool
    {
        return $this->category === 'category_specific';
    }

    /**
     * Check if template is customer specific
     */
    public function isCustomerSpecific(): bool
    {
        return $this->category === 'customer_specific';
    }
}