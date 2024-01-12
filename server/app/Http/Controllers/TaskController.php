<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index($projectId)
    {
        $tasks = Task::where('project_id', $projectId)->get();
        return view('tasks.index', compact('tasks', 'projectId'));
    }

    public function store(Request $request, $projectId)
    {
        $request->validate([
            'title' => 'required|max:255',
            'description' => 'nullable',
        ]);

        Task::create([
            'project_id' => $projectId,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'to-do',
        ]);

        return response()->json(['task_id' => $task->id], 201);
    }

    public function update(Request $request, $projectId, $taskId)
    {
        $task = Task::findOrFail($taskId);

        $request->validate([
            'title' => 'required|max:255',
            'description' => 'nullable',
            'status' => 'required|in:to-do,in-progress,done',
        ]);

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return redirect()->route('projects.tasks.index', $projectId);
    }

    public function destroy($projectId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $task->delete();

        return redirect()->route('projects.tasks.index', $projectId);
    }
}
