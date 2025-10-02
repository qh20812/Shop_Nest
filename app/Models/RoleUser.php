<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoleUser extends Model
{
    protected $table = 'role_user';
    public $timestamps = false;
    protected $fillable = ['user_id', 'role_id'];
    public $incrementing = false;
    protected $keyType='int';
    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }
    public function role(): BelongsTo{
        return $this->belongsTo(Role::class);
    }
}
