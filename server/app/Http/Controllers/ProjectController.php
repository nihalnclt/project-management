<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function getAllProjects()
    {
        $projects = Project::all();

        return response()->json($projects);
    }

    public function getAllProjectsWithTeamMembers()
    {
        $projects = Project::with('teamMembers.user')->get();

        return response()->json($projects);
    }
}