<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HIV extends Model
{
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'hn', 'hn');
    }

    public function informer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'informer_user_id', 'user_id');
    }

    public function witness1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'witness1_user_id', 'user_id');
    }

    public function witness2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'witness2_user_id', 'user_id');
    }
}
