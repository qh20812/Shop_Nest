<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ProductAnswer Model
 * 
 * Manages answers to product questions
 * Supports verified answers, helpfulness tracking, and best answer selection
 */
class ProductAnswer extends Model
{
    use HasFactory;

    protected $table = 'product_answers';

    protected $fillable = [
        'question_id',
        'user_id',
        'answer',
        'user_type',
        'is_verified',
        'is_anonymous',
        'helpful_count',
        'not_helpful_count',
        'is_best_answer',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_verified' => 'boolean',
        'is_anonymous' => 'boolean',
        'helpful_count' => 'integer',
        'not_helpful_count' => 'integer',
        'is_best_answer' => 'boolean',
    ];

    /**
     * Get the question this answer belongs to
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(ProductQuestion::class, 'question_id');
    }

    /**
     * Get the user who provided the answer
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get verified answers
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope to get best answers
     */
    public function scopeBestAnswer($query)
    {
        return $query->where('is_best_answer', true);
    }

    /**
     * Scope to get answers by user type
     */
    public function scopeByUserType($query, $userType)
    {
        return $query->where('user_type', $userType);
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
     * Increment not helpful count
     */
    public function incrementNotHelpful()
    {
        $this->increment('not_helpful_count');
    }

    /**
     * Mark as best answer
     */
    public function markAsBestAnswer()
    {
        // Remove best answer flag from other answers to the same question
        static::where('question_id', $this->question_id)
              ->where('id', '!=', $this->id)
              ->update(['is_best_answer' => false]);

        $this->update(['is_best_answer' => true]);
    }

    /**
     * Get helpfulness ratio
     */
    public function getHelpfulnessRatioAttribute()
    {
        $total = $this->helpful_count + $this->not_helpful_count;
        return $total > 0 ? ($this->helpful_count / $total) : 0;
    }
}