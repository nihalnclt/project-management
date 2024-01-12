<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getAllProjects()
    {
        $ownerId = auth()->user()->id;
        
        $projects = Project::where('owner', $ownerId)->get();

        return response()->json($projects);
    }

    public function getAllProjectsWithTeamMembers()
    {
        $projects = Project::with('teamMembers.user')->get();

        return response()->json($projects);
    }
}