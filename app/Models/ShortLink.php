<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShortLink extends Model
{
    protected $fillable = ['code', 'long_url'];
}
