<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Category extends Model
{
    use HasFactory, SoftDeletes,HasTranslations;

    protected $translatable = ['name'];
    protected $primaryKey = 'category_id';
    protected $fillable = [
        'name',
        'description',
        'image_url',
        'parent_category_id',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'name' => 'array',
        'description' => 'array',
    ];

    /**
     * Get the translations for this category.
     */
    // public function translations(): HasMany
    // {
    //     return $this->hasMany(CategoryTranslation::class, 'category_id', 'category_id');
    // }

    /**
     * Get the category name as a localized object.
     */
    // protected function name(): Attribute
    // {
    //     return Attribute::make(
    //         get: function () {
    //             if ($this->relationLoaded('translations')) {
    //                 return $this->translations->keyBy('language_code')->mapWithKeys(function ($translation) {
    //                     return [$translation->language_code => $translation->name];
    //                 })->toArray();
    //             }

    //             // Fallback if translations not loaded
    //             return [];
    //         }
    //     );
    // }

    // /**
    //  * Get the category description as a localized object.
    //  */
    // protected function description(): Attribute
    // {
    //     return Attribute::make(
    //         get: function () {
    //             if ($this->relationLoaded('translations')) {
    //                 return $this->translations->keyBy('language_code')->mapWithKeys(function ($translation) {
    //                     return [$translation->language_code => $translation->description];
    //                 })->toArray();
    //             }

    //             // Fallback if translations not loaded
    //             return [];
    //         }
    //     );
    // }
}
