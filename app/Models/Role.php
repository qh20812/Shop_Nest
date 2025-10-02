<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Permission;
use Spatie\Translatable\HasTranslations;
class Role extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = [
        'name',
        'description'
    ];

    protected $fillable = [
        'name',
        'description'
    ];
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user');
    }

    /**
     * The permissions that belong to the role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_role');
    }
}