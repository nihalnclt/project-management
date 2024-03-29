<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'projects';

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner');
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class, 'project_id');
    }
}
