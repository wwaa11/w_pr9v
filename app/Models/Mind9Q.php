<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mind9Q extends Model
{
    //
    protected $appends = ['type'];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'hn', 'hn');
    }

    public function getTypeAttribute()
    {
        return 'Mind9Q';
    }
}
