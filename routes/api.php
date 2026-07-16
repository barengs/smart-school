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
Route::get('/public/pages/{slug}', [\App\Http\Controllers\PageController::class, 'getBySlug']);

Route::middleware(['auth:api', \App\Http\Middleware\MatrixPermissionMiddleware::class])->group(function () {
    Route::get('/dashboard/export', [DashboardController::class, 'exportReport']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/news/export', [NewsController::class, 'exportCsv']);
    Route::apiResource('news', NewsController::class);
    Route::post('/news/{id}/approve', [NewsController::class, 'approve']);

    Route::get('/ppdb/export', [PPDBController::class, 'export'])->middleware('module:PPDB');
    Route::apiResource('ppdb', PPDBController::class)->middleware('module:PPDB');
    
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
    Route::apiResource('modules', \App\Http\Controllers\ModuleController::class)->middleware('can:manage-system');
    Route::apiResource('services', \App\Http\Controllers\ServiceController::class)->middleware('can:manage-system');
    Route::apiResource('academic-years', \App\Http\Controllers\AcademicYearController::class)->middleware('module:PPDB');
    Route::apiResource('semesters', \App\Http\Controllers\SemesterController::class)->middleware('module:PPDB');
    Route::apiResource('ppdb-batches', \App\Http\Controllers\PpdbBatchController::class)->middleware('module:PPDB');
    Route::apiResource('ppdb-paths', \App\Http\Controllers\PpdbPathController::class)->middleware('module:PPDB');
    Route::apiResource('ppdb-document-requirements', \App\Http\Controllers\PpdbDocumentRequirementController::class)->middleware('module:PPDB');

    // Academic Core
    Route::post('subjects/import', [\App\Http\Controllers\SubjectController::class, 'import'])->middleware('module:AKADEMIK');
    Route::apiResource('subjects', \App\Http\Controllers\SubjectController::class)->middleware('module:AKADEMIK');

    Route::get('classrooms/export', [\App\Http\Controllers\ClassroomController::class, 'export'])->middleware('module:AKADEMIK');
    Route::get('classrooms/template', [\App\Http\Controllers\ClassroomController::class, 'template'])->middleware('module:AKADEMIK');
    Route::post('classrooms/import', [\App\Http\Controllers\ClassroomController::class, 'import'])->middleware('module:AKADEMIK');
    Route::apiResource('classrooms', \App\Http\Controllers\ClassroomController::class)->middleware('module:AKADEMIK');

    Route::apiResource('users', \App\Http\Controllers\UserController::class);

    Route::get('lesson-hours/export', [\App\Http\Controllers\LessonHourController::class, 'export'])->middleware('module:AKADEMIK');
    Route::get('lesson-hours/template', [\App\Http\Controllers\LessonHourController::class, 'template'])->middleware('module:AKADEMIK');
    Route::post('lesson-hours/import', [\App\Http\Controllers\LessonHourController::class, 'import'])->middleware('module:AKADEMIK');
    Route::apiResource('lesson-hours', \App\Http\Controllers\LessonHourController::class)->middleware('module:AKADEMIK');
    Route::apiResource('schedules', \App\Http\Controllers\ScheduleController::class)->middleware('module:AKADEMIK');
    Route::apiResource('meetings', \App\Http\Controllers\MeetingController::class)->middleware('module:AKADEMIK');
    Route::get('attendances/matrix', [\App\Http\Controllers\AttendanceController::class, 'matrix'])->middleware('module:AKADEMIK');
    Route::get('attendances/schedules', [\App\Http\Controllers\AttendanceController::class, 'schedules'])->middleware('module:AKADEMIK');
    Route::post('attendances/meeting', [\App\Http\Controllers\AttendanceController::class, 'saveMeeting'])->middleware('module:AKADEMIK');
    Route::apiResource('attendances', \App\Http\Controllers\AttendanceController::class)->middleware('module:AKADEMIK');
    Route::apiResource('teachers', \App\Http\Controllers\TeacherController::class)->middleware('module:AKADEMIK');
    Route::apiResource('staffs', \App\Http\Controllers\StaffController::class);
    Route::apiResource('students', \App\Http\Controllers\StudentController::class)->middleware('module:AKADEMIK');
    
    // CBT Admin
    Route::post('admin/cbt/exams/{exam}/participants', [\App\Http\Controllers\CbtAdminController::class, 'assignParticipants']);
    Route::post('admin/cbt/exams/{exam}/questions', [\App\Http\Controllers\CbtAdminController::class, 'storeQuestion']);
    Route::put('admin/cbt/questions/{question}', [\App\Http\Controllers\CbtAdminController::class, 'updateQuestion']);
    Route::delete('admin/cbt/questions/{question}', [\App\Http\Controllers\CbtAdminController::class, 'destroyQuestion']);
    Route::apiResource('admin/cbt/exams', \App\Http\Controllers\CbtAdminController::class);

    // Akademik
    Route::apiResource('grades', \App\Http\Controllers\GradeController::class)->only(['index', 'store']);
    Route::apiResource('promotions', \App\Http\Controllers\PromotionController::class)->only(['index']);
    Route::post('/promotions/eligible', [\App\Http\Controllers\PromotionController::class, 'getEligibleStudents']);
    Route::post('/promotions/process', [\App\Http\Controllers\PromotionController::class, 'process']);
    Route::post('/promotions/bulk', [\App\Http\Controllers\PromotionController::class, 'processBulk']);
});

// CBT Participant (Uses custom X-CBT-Token in header)
Route::post('/cbt/login', [\App\Http\Controllers\CbtParticipantController::class, 'login']);
Route::get('/cbt/exams', [\App\Http\Controllers\CbtParticipantController::class, 'getAvailableExams']);
Route::post('/cbt/exams/{exam}/start', [\App\Http\Controllers\CbtParticipantController::class, 'startSession']);
Route::post('/cbt/sessions/{session}/answer', [\App\Http\Controllers\CbtParticipantController::class, 'saveAnswer']);
Route::post('/cbt/sessions/{session}/finish', [\App\Http\Controllers\CbtParticipantController::class, 'finishExam']);
