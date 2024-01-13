<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class TaskController extends Controller
{
    public function index($projectId)
    {
        $tasks = Task::where('project_id', $projectId)->get();
        return view('tasks.index', compact('tasks', 'projectId'));
    }

    public function addNewTask(Request $request, $projectId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|max:255',
                'description' => 'nullable',
                'assignee' => 'nullable|numeric|exists:users,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $ownerId = auth()->user()->id;
            $project = Project::where('id', $projectId)
                ->where('owner', $ownerId)
                ->first();

            if (!$project) {
                return response()->json(['error' => 'Project not found'], 404);
            }

            if ($request->assignee) {
                $isTeamMember = TeamMember::where('project_id', $projectId)
                    ->where('user_id', $request->assignee)
                    ->exists();
                if (!$isTeamMember) {
                    return response()->json(['error' => 'This user is not a member of this project'], 400);
                }
            }

            $task = Task::create([
                'project_id' => $projectId,
                'title' => $request->title,
                'description' => $request->description,
                'assignee' => $request->assignee,
                'status' => 'to-do',
            ]);

            $task->assignee = $request->assignee ? User::find($request->assignee) : null;

            return response()->json($task, 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateTask(Request $request, $projectId, $taskId)
    {
        $ownerId = auth()->user()->id;
        $projectId = $request->projectId;
        $project = Project::where('id', $projectId)
            ->where('owner', $ownerId)
            ->first();

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $task = Task::where('id', $taskId)
            ->where('project_id', $projectId)
            ->first();
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $request->validate([
            'title' => 'nullable|max:255',
            'description' => 'nullable',
            'status' => 'nullable|in:to-do,in-progress,done',
        ]);

        if ($request->has('title')) {
            $task->title = $request->title;
        }

        if ($request->has('description')) {
            $task->description = $request->description;
        }
    
        if ($request->has('status')) {
            $task->status = $request->status;
        }

        if ($request->has('assignee')) {
            if ($task->assignee != $request->assignee) {
                if ($request->assignee != null) {
                    $isTeamMember = TeamMember::where('project_id', $projectId)
                        ->where('user_id', $request->assignee)
                        ->exists();
                    if (!$isTeamMember) {
                        return response()->json(['error' => 'This user is not a member of this project'], 400);
                    }
                }
                $task->assignee = $request->assignee;
            }
        }

        $task->save();

        $task->assignee = $task->assignee ? User::find($task->assignee) : null;

        return response()->json($task, 201);
    }

    public function destroyTask($projectId, $taskId)
    {
        $ownerId = auth()->user()->id;
        $project = Project::where('id', $projectId)
            ->where('owner', $ownerId)
            ->first();
        if (!$project) {
            return response()->json(['error' => 'project not found or you have not right access'], 400);
        }

        $task = Task::where('id', $taskId)
            ->where('project_id', $projectId)
            ->first();
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        
        $task->delete();

        return response()->json(['message' => 'task deleted successfully', 'taskId' => $taskId], 200);
    }

    public function changeTaskStatus(Request $request, $projectId, $taskId)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:to-do,in-progress,done', 
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

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
                return response()->json(['error' => 'This user is not a member of this project'], 400);
            }
        }

        $task = Task::where('id', $taskId)
            ->where('project_id', $projectId)
            ->first();
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 400);
        }

        $task->status = $request->status;
        $task->save();

        return response()->json(['message' => 'task\'s status successfully changed'], 200);
    }
}
