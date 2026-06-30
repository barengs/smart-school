<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PPDBController;
use App\Http\Controllers\RolePermissionController;

Route::group([
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
});

Route::get('/public/profile', [ProfileController::class, 'showPublic']);
Route::get('/public/news', [NewsController::class, 'indexPublic']);
Route::get('/public/news/{slug}', [NewsController::class, 'showPublic']);
Route::post('/public/ppdb', [PPDBController::class, 'storePublic']);

Route::middleware(['auth:api', \App\Http\Middleware\MatrixPermissionMiddleware::class])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::apiResource('news', NewsController::class);
    Route::post('/news/{id}/approve', [NewsController::class, 'approve']);

    Route::apiResource('ppdb', PPDBController::class);
    Route::post('/ppdb/{id}/verify', [PPDBController::class, 'verify']);
    Route::post('/ppdb/{id}/status', [PPDBController::class, 'updateStatus']);

    Route::get('/rbac/roles', [RolePermissionController::class, 'roles']);
    Route::get('/rbac/users', [RolePermissionController::class, 'users']);
    // matrix update route
    Route::post('/rbac/matrix', [RolePermissionController::class, 'updateMatrix']);
});
