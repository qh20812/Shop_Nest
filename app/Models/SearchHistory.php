<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SearchHistory extends Model
{
    use HasFactory;
    protected $primaryKey = 'search_history_id';
    protected $fillable = [
        'user_id',
        'search_term',
        'search_count',
        'last_searched'
    ];
}
