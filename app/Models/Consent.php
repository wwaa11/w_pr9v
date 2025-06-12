<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consent extends Model
{
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function informer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'informer_user_id', 'user_id');
    }

    public function witness(): BelongsTo
    {
        return $this->belongsTo(User::class, 'witness_user_id', 'user_id');
    }
}
