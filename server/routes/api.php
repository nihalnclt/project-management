<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProjectController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:api'])->group(function () {
    Route::get('/projects', [ProjectController::class, 'getAllProjects']);
    Route::post('/projects/{projectId}/invite', [ProjectController::class, 'inviteOthersToProject']);
    Route::get('/projects/{projectId}', [ProjectController::class, 'getSingleProjectWithTasks']);
    Route::post('/projects/{projectId}/tasks', [TaskController::class, 'addNewTask']);
    Route::patch('/projects/{projectId}/tasks/{taskId}', [TaskController::class, 'updateTask']);
    Route::delete('/projects/{projectId}/tasks/{taskId}', [TaskController::class, 'destroyTask']);
    Route::post('/projects/{projectId}/tasks/{taskId}/change-status', [TaskController::class, 'changeTaskStatus']);
    
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/refresh', [AuthController::class, 'refresh']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
