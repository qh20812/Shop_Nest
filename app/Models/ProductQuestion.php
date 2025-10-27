<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * ProductQuestion Model
 * 
 * Manages customer questions about products
 * Supports Q&A functionality with featured questions and helpfulness tracking
 */
class ProductQuestion extends Model
{
    use HasFactory;

    protected $table = 'product_questions';

    protected $fillable = [
        'product_id',
        'user_id',
        'question',
        'status',
        'is_anonymous',
        'helpful_count',
        'answers_count',
        'is_featured',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_anonymous' => 'boolean',
        'helpful_count' => 'integer',
        'answers_count' => 'integer',
        'is_featured' => 'boolean',
    ];

    /**
     * Get the product this question is about
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    /**
     * Get the user who asked the question
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all answers for this question
     */
    public function answers(): HasMany
    {
        return $this->hasMany(ProductAnswer::class, 'question_id');
    }

    /**
     * Get the best answer for this question
     */
    public function bestAnswer()
    {
        return $this->answers()->where('is_best_answer', true)->first();
    }

    /**
     * Scope to get answered questions
     */
    public function scopeAnswered($query)
    {
        return $query->where('status', 'answered');
    }

    /**
     * Scope to get pending questions
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get featured questions
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to order by helpfulness
     */
    public function scopeByHelpfulness($query)
    {
        return $query->orderBy('helpful_count', 'desc');
    }

    /**
     * Increment helpful count
     */
    public function incrementHelpful()
    {
        $this->increment('helpful_count');
    }

    /**
     * Increment answers count
     */
    public function incrementAnswersCount()
    {
        $this->increment('answers_count');
    }

    /**
     * Decrement answers count
     */
    public function decrementAnswersCount()
    {
        $this->decrement('answers_count');
    }
}