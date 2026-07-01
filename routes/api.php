<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PPDBController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RolePermissionController;

Route::group([
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('unlock', [AuthController::class, 'unlock'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
});

Route::get('/public/profile', [ProfileController::class, 'showPublic']);
Route::get('/public/news', [NewsController::class, 'indexPublic']);
Route::get('/public/news/{slug}', [NewsController::class, 'showPublic']);
Route::post('/public/ppdb', [PPDBController::class, 'storePublic']);
Route::get('/public/ppdb/info', [PPDBController::class, 'publicInfo']);
Route::get('/public/decode-nik/{nik}', [PPDBController::class, 'decodeNik']);
Route::get('/public/menus', [\App\Http\Controllers\MenuController::class, 'indexPublic']);
Route::post('/public/contacts', [\App\Http\Controllers\ContactController::class, 'storePublic']);
Route::get('/public/academic-calendars', [\App\Http\Controllers\AcademicCalendarController::class, 'indexPublic']);

Route::middleware(['auth:api', \App\Http\Middleware\MatrixPermissionMiddleware::class])->group(function () {
    Route::get('/dashboard/export', [DashboardController::class, 'exportReport']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/news/export', [NewsController::class, 'exportCsv']);
    Route::apiResource('news', NewsController::class);
    Route::post('/news/{id}/approve', [NewsController::class, 'approve']);

    Route::get('/ppdb/export', [PPDBController::class, 'export']);
    Route::apiResource('ppdb', PPDBController::class);
    
    // Contacts
    Route::get('/contacts/export', [\App\Http\Controllers\ContactController::class, 'export']);
    Route::get('/contacts', [\App\Http\Controllers\ContactController::class, 'index']);
    Route::get('/contacts/{id}', [\App\Http\Controllers\ContactController::class, 'show']);
    
    // RBAC
    Route::get('rbac/matrix', [\App\Http\Controllers\RolePermissionController::class, 'getMatrix']);
    Route::post('rbac/matrix', [\App\Http\Controllers\RolePermissionController::class, 'updateMatrix']);
    Route::apiResource('roles', \App\Http\Controllers\RolePermissionController::class)->except(['create', 'show', 'edit']);
    
    // CMS Menus & Pages
    Route::post('menus/reorder', [\App\Http\Controllers\MenuController::class, 'reorder']);
    Route::apiResource('menus', \App\Http\Controllers\MenuController::class);
    Route::apiResource('pages', \App\Http\Controllers\PageController::class);
    
    Route::get('organization/export', [\App\Http\Controllers\OrganizationStructureController::class, 'export']);
    Route::get('organization/template', [\App\Http\Controllers\OrganizationStructureController::class, 'template']);
    Route::post('organization/import', [\App\Http\Controllers\OrganizationStructureController::class, 'import']);
    Route::apiResource('organization', \App\Http\Controllers\OrganizationStructureController::class);
    
    Route::apiResource('categories', \App\Http\Controllers\CategoryController::class);
    Route::apiResource('tags', \App\Http\Controllers\TagController::class);
    Route::get('academic-calendars/template', [\App\Http\Controllers\AcademicCalendarController::class, 'template']);
    Route::post('academic-calendars/import', [\App\Http\Controllers\AcademicCalendarController::class, 'import']);
    Route::apiResource('academic-calendars', \App\Http\Controllers\AcademicCalendarController::class);

    // Master PPDB
    Route::apiResource('academic-years', \App\Http\Controllers\AcademicYearController::class);
    Route::apiResource('ppdb-batches', \App\Http\Controllers\PpdbBatchController::class);
    Route::apiResource('ppdb-paths', \App\Http\Controllers\PpdbPathController::class);
    Route::apiResource('ppdb-document-requirements', \App\Http\Controllers\PpdbDocumentRequirementController::class);
});
