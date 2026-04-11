<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseOfferingController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\SettingController;

// API v1 Routes
Route::prefix('v1')->group(function () {
    
    // ===================== PUBLIC AUTH ROUTES =====================
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Health check (public)
    Route::get('/health', function () {
        \Log::info('HEALTH CHECK CALLED');
        return response()->json(['status' => 'ok', 'message' => 'IUMS API is running']);
    });
    
    // Test public route
    Route::get('/test-public', function () {
        \Log::info('TEST-PUBLIC ROUTE CALLED');
        return response()->json(['test' => 'public success']);
    });

    // Debug: Test JWT extraction
    Route::get('/debug/jwt', function (Request $request) {
        $header = $request->header('Authorization');
        $allHeaders = $request->headers->all();
        
        return response()->json([
            'authorization_header' => $header,
            'all_headers' => $allHeaders,
            'has_auth_header' => !empty($header),
            'is_bearer' => $header && strpos($header, 'Bearer ') === 0 ? true : false,
        ]);
    });

    // ===================== ADMIN MANAGEMENT ROUTES (Public URLs, but protected at controller level) =====================
    // These are temporarily public to debug JWT issues, but controllers enforce admin authorization
    Route::apiResources([
        'users' => UserController::class,
        'departments' => DepartmentController::class,
        'courses' => CourseController::class,
        'notices' => NoticeController::class,
    ]);
    
    // Notice stats endpoint
    Route::get('/notices-stats', [NoticeController::class, 'stats']);
    
    // Settings endpoints (GET public, PUT admin only)
    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings', [SettingController::class, 'update']);
    
    // Student enrollment endpoints (public but protected at controller with JWT)
    Route::get('/enrollments/available-courses', [EnrollmentController::class, 'availableCourses']);
    Route::post('/enrollments/self-enroll', [EnrollmentController::class, 'selfEnroll']);
    
    // Student profile endpoint
    Route::post('/students/update-profile', [StudentController::class, 'updateProfile']);
    
    // Course schedule endpoints
    Route::get('/course-offerings/student-schedule', [CourseOfferingController::class, 'studentSchedule']);
    Route::get('/course-offerings/{courseOfferingId}/schedule', [CourseOfferingController::class, 'courseSchedule']);
    
    // ===================== ADMIN STATS & DASHBOARD ROUTES (Public URLs, but protected at controller level) =====================
    // Enrollments for admin dashboard - TEST ROUTE
    Route::get('/enrollments', function (Request $request) {
        return response()->json([
            'status' => 'test',
            'message' => 'Enrollments test endpoint',
            'auth_header' => $request->header('Authorization') ? 'Present' : 'Missing'
        ], 200);
    });
    
    // Attendance routes for admin dashboard
    Route::prefix('attendance')->group(function () {
        Route::get('/enrollment/{enrollmentId}', [AttendanceController::class, 'enrollmentAttendance']);
        Route::get('/attendance-sheet/{courseOfferingId}', [AttendanceController::class, 'courseAttendanceSheet']);
        Route::get('/student/{studentId}/course/{courseOfferingId}', [AttendanceController::class, 'studentCourseAttendance']);
        Route::post('/record/{courseOfferingId}', [AttendanceController::class, 'recordAttendance']);
    });
    
    // Test endpoint with direct middleware
    Route::get('/teacher/dashboard-direct', [TeacherController::class, 'getDashboard'])
        ->middleware('jwt.auth');
    
    // ===================== PROTECTED ROUTES (Auth Required) =====================
    Route::middleware('jwt.auth')->group(function () {
        // Student/User accessible endpoints (with scope)
        Route::get('/students/{id}', [StudentController::class, 'show']);
        Route::get('/results', [ResultController::class, 'index']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Resource routes for protected entities
        Route::apiResources([
            'teachers' => TeacherController::class,
            'semesters' => SemesterController::class,
            'course-offerings' => CourseOfferingController::class,
        ]);

        // Student-specific routes
        Route::get('/student/profile', [StudentController::class, 'getProfile']);
        Route::post('/student/profile/update', [StudentController::class, 'updateProfile']);
        Route::get('/student/schedule', [CourseOfferingController::class, 'studentSchedule']);
        Route::get('/student/courses', [StudentController::class, 'getCourses']);

        // Teacher-specific routes
        Route::get('/teacher/{teacher_id}/course-offerings', [CourseOfferingController::class, 'teacherCourseOfferings']);
        Route::get('/teacher/courses', [TeacherController::class, 'getCourses']);
        Route::get('/teacher/dashboard', [TeacherController::class, 'getDashboard']);
        Route::get('/teacher/marks', [TeacherController::class, 'getMarks']);
        Route::post('/teacher/marks', [TeacherController::class, 'submitMarks']);
        Route::get('/teacher/attendance', [TeacherController::class, 'getAttendance']);
        Route::post('/teacher/attendance', [TeacherController::class, 'submitAttendance']);

        // Course Offering custom routes
        Route::get('/course-offerings/{courseOfferingId}/students', [CourseOfferingController::class, 'getCourseStudents']);

        // Enrollment routes
        Route::get('/enrollments', [EnrollmentController::class, 'index']);
        Route::post('/enrollments', [EnrollmentController::class, 'store']);
        Route::get('/enrollments/available-courses', [EnrollmentController::class, 'availableCourses']);
        Route::post('/enrollments/self-enroll', [EnrollmentController::class, 'selfEnroll']);
        Route::get('/enrollments/{id}', [EnrollmentController::class, 'show']);
        Route::put('/enrollments/{id}', [EnrollmentController::class, 'update']);
        Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy']);

        // Teacher attendance routes
        Route::prefix('teacher/attendance')->group(function () {
            Route::get('/view', [TeacherController::class, 'viewAttendance']);
            Route::put('/update', [TeacherController::class, 'updateAttendance']);
        });

        // Payment routes
        Route::prefix('payments')->group(function () {
            Route::get('/my-payments', [PaymentController::class, 'myPayments']);
            Route::get('/student/{studentId}', [PaymentController::class, 'studentPayments']);
            Route::post('/record/{studentId}', [PaymentController::class, 'recordPayment']);
            Route::get('/statistics', [PaymentController::class, 'paymentStatistics']);
        });
    });
});
