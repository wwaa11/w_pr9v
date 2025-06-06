<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    public function consents(): HasMany
    {
        return $this->hasMany(Consent::class)->orderBy('created_at', 'desc');
    }
}
