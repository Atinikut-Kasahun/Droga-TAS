<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('auth/login', [AuthController::class, 'login']);

Route::get('jobs', [JobController::class, 'index']);
Route::get('jobs/{slug}', [JobController::class, 'show']);
Route::post('jobs/{id}/apply', [ApplicationController::class, 'store']);

Route::get('branches', [BranchController::class, 'index']);

// Protected Admin/HR routes
Route::group(['middleware' => 'auth:api'], function () {
    // Auth Management
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::post('auth/refresh', [AuthController::class, 'refresh']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Admin Jobs Management
    Route::post('admin/jobs', [JobController::class, 'store']);
    Route::put('admin/jobs/{id}', [JobController::class, 'update']);
    Route::delete('admin/jobs/{id}', [JobController::class, 'destroy']);

    // Admin Applications Management
    Route::get('admin/applications', [ApplicationController::class, 'index']);
    Route::get('admin/applications/{id}', [ApplicationController::class, 'show']);
    Route::put('admin/applications/{id}/status', [ApplicationController::class, 'updateStatus']);
    Route::post('admin/applications/{id}/notes', [ApplicationController::class, 'updateNotes']);

    // Admin Branches Management
    Route::post('admin/branches', [BranchController::class, 'store']);
    Route::delete('admin/branches/{id}', [BranchController::class, 'destroy']);

    // Admin Users Management
    Route::get('admin/users', [UserController::class, 'index']);
    Route::post('admin/users', [UserController::class, 'store']);
    Route::put('admin/users/{id}', [UserController::class, 'update']);
    Route::delete('admin/users/{id}', [UserController::class, 'destroy']);
    Route::post('admin/users/{id}/reset-password', [UserController::class, 'resetPassword']);

    // Admin Companies Management
    Route::get('admin/companies', [CompanyController::class, 'index']);
    Route::post('admin/companies', [CompanyController::class, 'store']);
    Route::put('admin/companies/{id}', [CompanyController::class, 'update']);
    Route::delete('admin/companies/{id}', [CompanyController::class, 'destroy']);

    // Activity Logs
    Route::get('admin/logs', [ActivityLogController::class, 'index']);
});
