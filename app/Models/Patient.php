<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    protected $fillable = [
        'hn',
        'token',
    ];

    public function telemedicines(): HasMany
    {
        return $this->hasMany(Telemedicine::class, 'hn', 'hn')->orderBy('created_at', 'desc');
    }
}
