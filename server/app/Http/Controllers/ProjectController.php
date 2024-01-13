<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Models\TeamMember;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProjectController extends Controller
{
    public function getAllProjects()
    {
        $ownerId = auth()->user()->id;
        
        $ownedProjects = Project::where('owner', $ownerId)
            ->get()
            ->map(function ($project) use ($ownerId) {
            $project['owned'] = true;
            return $project;
        });

        $teamProjects = Project::whereHas('teamMembers', function ($query) use ($ownerId) {
            $query->where('user_id', $ownerId);
        })->get()
            ->map(function ($project) use ($ownerId) {
            $project['owned'] = false;
            return $project;
        });

        $allProjects = $ownedProjects->merge($teamProjects);

        return response()->json($allProjects);
    }

    public function inviteOthersToProject(Request $request, $projectId)
    {
        try {
            $project = Project::where('id', $projectId)
                ->where('owner', auth()->user()->id)
                ->first();
            if (!$project) {
                return response()->json(['error' => 'Project not found or you have not right access'], 400);
            }

            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
            ]);
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $user = User::where("email", $request->email)->first();
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $existingMember = TeamMember::where("project_id", $projectId)
                ->where('user_id', $user->id)
                ->first();
            if ($existingMember) {
                return response()->json(['error' => 'User is already a member of the project'], 400);
            }

            TeamMember::create([
                'project_id' => $projectId,
                'user_id' => $user->id,
            ]);

            return response()->json(['message' => 'Successfully added user to this project'], 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getSingleProjectWithTasks($projectId)
    {
        $userId = auth()->user()->id;
        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        if ($project->owner != $userId) {
            $isTeamMember = TeamMember::where('project_id', $projectId)
                ->where('user_id', $userId)
                ->exists();
            if (!$isTeamMember) {
                return response()->json(['error' => 'You do not have access to this project.'], 400);
            }
        }

        $tasks = Task::where('project_id', $projectId)->get();

        $project->owner = $project->owner == $userId;

        return response()->json(['project' => $project, 'tasks' => $tasks], 200);
    }
}