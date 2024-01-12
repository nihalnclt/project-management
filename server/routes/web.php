<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dbconn', function () {
    return view('dbconn');
});

Route::get('/token', function () {
    return csrf_token(); 
});


Route::post('/login', [AuthController::class, 'login']);
Route::middleware(['auth:api'])->group(function () {
    // Your protected routes go here
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('/projects', [ProjectController::class, 'getAllProjectsWithTeamMembers']);

    // Refresh token route
    Route::get('/refresh', [AuthController::class, 'refresh']);
});


