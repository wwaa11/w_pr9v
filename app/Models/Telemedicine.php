<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Telemedicine extends Model
{
    public function informer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'informer_user_id', 'user_id');
    }

    public function witness(): BelongsTo
    {
        return $this->belongsTo(User::class, 'witness_user_id', 'user_id');
    }
}
