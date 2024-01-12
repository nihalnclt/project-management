<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;

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

Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware'=>'api'],function(){
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{projectId}', [TaskController::class, 'getAllTasksByProjectId']);
    Route::delete('/tasks/{taskId}', [TaskController::class, 'destroy']);
    Route::patch('/tasks/{taskId}', [TaskController::class, 'update']);

    Route::get('/projects', [ProjectController::class, 'getAllProjectsWithTeamMembers']);

    Route::get('/refresh', [AuthController::class, 'refresh']);
});
