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

    public function consents(): HasMany
    {
        return $this->hasMany(Consent::class)->orderBy('created_at', 'desc');
    }
}
