<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index($projectId)
    {
        $tasks = Task::where('project_id', $projectId)->get();
        return view('tasks.index', compact('tasks', 'projectId'));
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'projectId' => 'required|exists:projects,id',
                'title' => 'required|max:255',
                'description' => 'nullable',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $projectId = $request->projectId;
            // $project = Project::find($projectId);
            // if (!$project) {
            //     return response()->json(['error' => 'Project not found'], 404);
            // }

            $task = Task::create([
                'project_id' => $projectId,
                'title' => $request->title,
                'description' => $request->description,
                'status' => 'to-do',
            ]);

            return response()->json($task, 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getAllTasksByProjectId($projectId)
    {
        $validator = Validator::make(['project_id' => $projectId], [
            'project_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $tasks = Task::where('project_id', $projectId)->get();

        return response()->json(['project' => $project, 'tasks' => $tasks], 200);
    }

    public function update(Request $request, $taskId)
    {
        $task = Task::find($taskId);
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

        $task->save();

        return response()->json($task, 201);
    }

    public function destroy($taskId)
    {
        $task = Task::find($taskId);
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        $task->delete();

        return response()->json(['message' => 'task deleted successfully', 'taskId' => $taskId], 200);
    }
}
