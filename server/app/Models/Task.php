<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'assignee',
    ];

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee');
    }
}
