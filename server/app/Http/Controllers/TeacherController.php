<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Teacher;
use App\Models\CourseOffering;
use App\Models\Result;
use App\Models\Attendance;
use App\Models\Enrollment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    /**
     * Display a listing of teachers with pagination
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 15);
            $teachers = Teacher::with('user', 'department')
                ->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Teachers retrieved successfully',
                'data' => $teachers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve teachers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created teacher
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id|unique:teachers,user_id',
                'department_id' => 'required|exists:departments,id',
                'employee_id' => 'required|unique:teachers,employee_id',
                'qualification' => 'string',
                'specialization' => 'string',
            ]);

            $teacher = Teacher::create($validated);
            $teacher->load('user', 'department');

            return response()->json([
                'status' => 'success',
                'message' => 'Teacher created successfully',
                'data' => $teacher
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create teacher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified teacher
     */
    public function show(Teacher $teacher, Request $request)
    {
        try {
            $include = $request->query('include', 'user,department');
            $relations = explode(',', $include);
            
            $teacher->load($relations);

            return response()->json([
                'status' => 'success',
                'message' => 'Teacher retrieved successfully',
                'data' => $teacher
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve teacher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified teacher
     */
    public function update(Request $request, Teacher $teacher)
    {
        try {
            $validated = $request->validate([
                'qualification' => 'string',
                'specialization' => 'string',
            ]);

            $teacher->update($validated);
            $teacher->load('user', 'department');

            return response()->json([
                'status' => 'success',
                'message' => 'Teacher updated successfully',
                'data' => $teacher
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update teacher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified teacher
     */
    public function destroy(Teacher $teacher)
    {
        try {
            $teacher->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Teacher deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete teacher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated teacher's profile
     */
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();
            $teacher = Teacher::where('user_id', $user->id)
                ->with('user', 'department', 'courseOfferings')
                ->first();

            if (!$teacher) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Teacher profile retrieved successfully',
                'data' => $teacher
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve teacher profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get teacher dashboard data
     */
    public function getDashboard(Request $request)
    {
        try {
            \Log::info('[TeacherController] getDashboard called');
            \Log::info('[TeacherController] Request all:', $request->all());
            
            $teacher = null;
            $teacherId = $request->query('teacher_id');
            
            \Log::info('[TeacherController] Query teacher_id:', ['teacher_id' => $teacherId]);
            
            // If teacher_id provided in query, use it (for testing with JWT  auth middleware)
            if ($teacherId) {
                \Log::info('[TeacherController] Looking up teacher by query parameter', ['teacher_id' => $teacherId]);
                $teacher = Teacher::find($teacherId);
                if ($teacher) {
                    \Log::info('[TeacherController] Found teacher via query param', ['teacher_id' => $teacher->id]);
                }
            } 
            // Otherwise, try to get from JWT auth_user
            else {
                $authUser = $request->get('auth_user');
                \Log::info('[TeacherController] auth_user from request:', ['auth_user' => json_encode($authUser)]);
                
                if (!$authUser) {
                    \Log::error('[TeacherController] No auth_user and no teacher_id query param');
                    return response()->json([
                        'status' => 'error',
                        'message' => 'User not authenticated and no teacher_id provided'
                    ], 401);
                }

                $userId = $authUser['userId'] ?? null;
                \Log::info('[TeacherController] Looking for teacher by user_id:', ['userId' => $userId]);
                
                if (!$userId) {
                    \Log::error('[TeacherController] No userId in auth_user payload');
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Invalid token payload'
                    ], 401);
                }
                
                try {
                    $teacher = Teacher::where('user_id', $userId)->first();
                    if ($teacher) {
                        \Log::info('[TeacherController] Found teacher via JWT user_id', ['teacher_id' => $teacher->id]);
                    }
                } catch (\Exception $e) {
                    \Log::error('[TeacherController] Error querying teacher by user_id', ['error' => $e->getMessage()]);
                }
            }

            if (!$teacher) {
                \Log::error('[TeacherController] No teacher found');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            \Log::info('[TeacherController] Teacher found, fetching courses', ['teacher_id' => $teacher->id]);

            try {
                // Get all course offerings for this teacher
                $allCourseOfferings = CourseOffering::where('teacher_id', $teacher->id)
                    ->with('course', 'semester')
                    ->get();

                \Log::info('[TeacherController] Retrieved course offerings', [
                    'count' => $allCourseOfferings->count(),
                    'teacher_id' => $teacher->id
                ]);

                // Get today's day of week (format: Monday, Tuesday, etc.)
                $today = now()->format('l');
                \Log::info('[TeacherController] Today is:', ['day' => $today]);

                // Filter for today's classes
                $todayClasses = $allCourseOfferings->filter(function($offering) use ($today) {
                    return isset($offering->day_of_week) && $offering->day_of_week === $today;
                })->map(function($offering) {
                    return [
                        'id' => $offering->id,
                        'course_code' => $offering->course->code ?? 'N/A',
                        'course_title' => $offering->course->title ?? 'Unknown Course',
                        'time' => $offering->class_time ?? 'TBD',
                        'room' => $offering->room_number ?? 'TBD',
                        'section' => $offering->section ?? 'A',
                        'students' => $offering->current_enrollment ?? 0,
                        'day' => $offering->day_of_week ?? 'Unknown',
                    ];
                })->values();

                // Count pending marks (results without marks)
                $pendingResults = Result::whereIn('course_offering_id', $allCourseOfferings->pluck('id'))
                    ->whereNull('final_marks')
                    ->count();

                \Log::info('[TeacherController] Dashboard prepared successfully', [
                    'today_classes' => $todayClasses->count(),
                    'pending_marks' => $pendingResults,
                    'total_courses' => $allCourseOfferings->count()
                ]);

                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'today_classes' => $todayClasses,
                        'pending_marks_count' => $pendingResults,
                        'active_courses_count' => $allCourseOfferings->count(),
                    ]
                ], 200);
            } catch (\Exception $courseError) {
                \Log::error('[TeacherController] Error fetching courses', [
                    'error' => $courseError->getMessage(),
                    'file' => $courseError->getFile(),
                    'line' => $courseError->getLine()
                ]);
                throw $courseError;
            }
        } catch (\Exception $e) {
            \Log::error('[TeacherController] getDashboard exception', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve dashboard data',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Debug endpoint - returns what request data is available, or teacher dashboard with hardcoded teacher_id
     */
    public function getDashboardDebug(Request $request)
    {
        // Allow passing teacher_id as query param for testing
        $teacherId = $request->query('teacher_id');
        
        if ($teacherId) {
            // Test with hardcoded teacher to bypass JWT
            try {
                $teacher = Teacher::find($teacherId);
                
                if (!$teacher) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Teacher not found',
                        'teacher_id' => $teacherId
                    ], 404);
                }

                $allCourseOfferings = CourseOffering::where('teacher_id', $teacher->id)
                    ->with('course', 'semester')
                    ->get();

                $today = now()->format('l');

                $todayClasses = $allCourseOfferings->filter(function($offering) use ($today) {
                    return $offering->day_of_week === $today;
                })->map(function($offering) {
                    return [
                        'id' => $offering->id,
                        'course_code' => $offering->course->code ?? 'N/A',
                        'course_title' => $offering->course->title ?? 'Unknown',
                        'time' => $offering->class_time ?? 'TBD',
                        'room' => $offering->room_number ?? 'TBD',
                        'section' => $offering->section ?? 'A', 
                        'students' => $offering->current_enrollment ?? 0,
                        'day' => $offering->day_of_week,
                    ];
                })->values();

                $pendingResults = Result::whereIn('course_offering_id', $allCourseOfferings->pluck('id'))
                    ->whereNull('final_marks')
                    ->count();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Debug - teacher dashboard data',
                    'data' => [
                        'today_classes' => $todayClasses,
                        'pending_marks_count' => $pendingResults,
                        'active_courses_count' => $allCourseOfferings->count(),
                    ]
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
        
        // Otherwise return request debugging info
        return response()->json([
            'status' => 'debug',
            'message' => 'Debug endpoint - auth inspection',
            'request_headers' => [
                'Authorization' => $request->header('Authorization') ? 'Present' : 'Missing',
                'Content-Type' => $request->header('Content-Type')
            ],
            'request_user' => $request->user() ? 'User available' : 'No user',
            'request_auth_user' => $request->get('auth_user') ? 'Auth user available' : 'No auth_user',
            'auth_user_data' => $request->get('auth_user'),
            'timestamp' => now()->toIso8601String()
        ], 200);
    }

    /**
     * Get list of courses assigned to a teacher
     */
    public function getCourses(Request $request)
    {
        try {
            $teacherId = $request->query('teacher_id');
            
            if (!$teacherId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'teacher_id query parameter is required'
                ], 400);
            }

            $teacher = Teacher::find($teacherId);
            
            if (!$teacher) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Teacher not found'
                ], 404);
            }

            // Get all course offerings for this teacher
            $courses = CourseOffering::where('teacher_id', $teacher->id)
                ->with('course', 'course.department', 'semester')
                ->get()
                ->map(function($offering) {
                    return [
                        'id' => $offering->id,
                        'code' => $offering->course->code ?? 'N/A',
                        'title' => $offering->course->title ?? 'Unknown Course',
                        'level' => $offering->course->level ?? 'N/A',
                        'dept' => $offering->course->department->name ?? 'N/A',
                        'semester' => $offering->semester->name ?? 'N/A',
                        'section' => $offering->section ?? 'A',
                        'day_of_week' => $offering->day_of_week,
                        'class_time' => $offering->class_time,
                        'room_number' => $offering->room_number,
                        'enrollment_count' => $offering->current_enrollment ?? 0,
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => [
                    'courses' => $courses,
                    'active_courses_count' => count($courses),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get marks for a specific course
     */
    public function getMarks(Request $request)
    {
        try {
            $courseOfferingId = $request->query('course_offering_id');
            
            if (!$courseOfferingId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'course_offering_id query parameter is required'
                ], 400);
            }

            $courseOffering = CourseOffering::find($courseOfferingId);
            
            if (!$courseOffering) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Course offering not found'
                ], 404);
            }

            // Get all enrollments for this course with their results
            $enrollments = Enrollment::where('course_offering_id', $courseOfferingId)
                ->with('student.user')
                ->get();

            $students = $enrollments->map(function($enrollment) use ($courseOfferingId) {
                $result = Result::where('course_offering_id', $courseOfferingId)
                    ->where('student_id', $enrollment->student_id)
                    ->first();

                return [
                    'id' => $enrollment->student->id,
                    'name' => $enrollment->student->user->first_name . ' ' . $enrollment->student->user->last_name ?? 'Unknown',
                    'student_registration_number' => $enrollment->student->student_id ?? 'N/A',
                    'student_id' => $enrollment->student_id,
                    'enrollment_id' => $enrollment->id,
                    'attendance_marks' => $result->attendance_marks ?? 0,
                    'assignment_marks' => $result->assignment_marks ?? 0,
                    'midterm_marks' => $result->midterm_marks ?? 0,
                    'final_marks' => $result->final_marks ?? null,
                    'total_marks' => ($result->attendance_marks ?? 0) + ($result->assignment_marks ?? 0) + ($result->midterm_marks ?? 0) + ($result->final_marks ?? 0),
                ];
            })->values();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'course_offering_id' => $courseOfferingId,
                    'students' => $students,
                    'total_students' => count($students),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve marks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit/update marks for students in a course
     */
    public function submitMarks(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_offering_id' => 'required|exists:course_offerings,id',
                'marks' => 'required|array',
                'marks.*.student_id' => 'required|exists:students,id',
                'marks.*.attendance_marks' => 'numeric|min:0|max:10',
                'marks.*.assignment_marks' => 'numeric|min:0|max:10',
                'marks.*.midterm_marks' => 'numeric|min:0|max:20',
                'marks.*.final_marks' => 'numeric|min:0|max:60',
            ]);

            $courseOfferingId = $validated['course_offering_id'];

            foreach ($validated['marks'] as $markData) {
                $result = Result::where('course_offering_id', $courseOfferingId)
                    ->where('student_id', $markData['student_id'])
                    ->first();

                if ($result) {
                    $result->update([
                        'attendance_marks' => $markData['attendance_marks'] ?? $result->attendance_marks,
                        'assignment_marks' => $markData['assignment_marks'] ?? $result->assignment_marks,
                        'midterm_marks' => $markData['midterm_marks'] ?? $result->midterm_marks,
                        'final_marks' => $markData['final_marks'] ?? $result->final_marks,
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Marks submitted successfully',
                'data' => [
                    'course_offering_id' => $courseOfferingId,
                    'marks_count' => count($validated['marks']),
                ]
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to submit marks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get attendance records for a course
     */
    public function getAttendance(Request $request)
    {
        try {
            $courseOfferingId = $request->query('course_offering_id');
            $date = $request->query('date') ?? now()->format('Y-m-d');

            if (!$courseOfferingId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'course_offering_id query parameter is required'
                ], 400);
            }

            $courseOffering = CourseOffering::find($courseOfferingId);
            
            if (!$courseOffering) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Course offering not found'
                ], 404);
            }

            // ===== DEBUG: Check what records exist in attendance table =====
            $existingRecords = Attendance::where('course_offering_id', $courseOfferingId)
                ->whereDate('attendance_date', $date)
                ->get();
            \Log::info("GET ATTENDANCE - EXISTING RECORDS IN TABLE:", [
                'date_query' => $date,
                'course_offering_id' => $courseOfferingId,
                'count' => $existingRecords->count(),
                'records' => $existingRecords->map(fn($r) => [
                    'id' => $r->id,
                    'course_offering_id' => $r->course_offering_id,
                    'student_id' => $r->student_id,
                    'student_id_type' => gettype($r->student_id),
                    'is_present' => $r->is_present,
                    'attendance_date' => $r->attendance_date,
                ])->toArray(),
            ]);

            // Get all enrollments for this course
            $enrollments = Enrollment::where('course_offering_id', $courseOfferingId)
                ->with('student.user')
                ->get();

            \Log::info("GET ATTENDANCE - ENROLLMENTS:", [
                'count' => $enrollments->count(),
                'first_enrollment' => $enrollments->first() ? [
                    'student_id' => $enrollments->first()->student->id,
                    'student_id_type' => gettype($enrollments->first()->student->id),
                ] : null,
            ]);

            $students = $enrollments->map(function($enrollment) use ($courseOfferingId, $date) {
                // Cast student ID to string to match VARCHAR column in attendance table
                $originalStudentId = $enrollment->student->id;
                $studentId = (string)$enrollment->student->id;
                
                // ===== DEBUG: Show query for each student =====
                $query = Attendance::where('course_offering_id', $courseOfferingId)
                    ->where('student_id', $studentId)
                    ->whereDate('attendance_date', $date);
                
                \Log::info("GET ATTENDANCE - QUERY FOR STUDENT:", [
                    'enrollment_id' => $enrollment->id,
                    'original_student_id' => $originalStudentId,
                    'original_student_id_type' => gettype($originalStudentId),
                    'after_string_cast' => $studentId,
                    'after_string_cast_type' => gettype($studentId),
                    'sql' => $query->toSql(),
                    'bindings' => $query->getBindings(),
                ]);

                $attendance = $query->first();
                
                \Log::info("GET ATTENDANCE - QUERY RESULT FOR STUDENT:", [
                    'student_id' => $studentId,
                    'attendance_found' => $attendance ? true : false,
                    'attendance_is_present' => $attendance ? $attendance->is_present : null,
                ]);

                return [
                    'id' => $enrollment->student->student_id ?? 'N/A',
                    'name' => ($enrollment->student->user->first_name ?? '') . ' ' . ($enrollment->student->user->last_name ?? ''),
                    'student_registration_number' => $enrollment->student->student_id ?? 'N/A',
                    'student_id' => $enrollment->student->id,
                    'enrollment_id' => $enrollment->id,
                    'is_present' => $attendance ? $attendance->is_present : false,
                    'attendance_id' => $attendance ? $attendance->id : null,
                ];
            })->values();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'course_offering_id' => $courseOfferingId,
                    'date' => $date,
                    'students' => $students,
                    'total_students' => count($students),
                    'present_count' => collect($students)->where('is_present', true)->count(),
                ]
            ], 200);
        } catch (\Exception $e) {
            \Log::error('GET ATTENDANCE - EXCEPTION:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve attendance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit/update attendance for students in a course
     */
    public function submitAttendance(Request $request)
    {
        try {
            // ===== RAW INPUT DEBUGGING =====
            $rawInput = $request->getContent();
            \Log::info('SUBMIT ATTENDANCE - RAW JSON INPUT:', ['raw' => $rawInput]);

            $validated = $request->validate([
                'course_offering_id' => 'required|exists:course_offerings,id',
                'date' => 'required|date',
                'attendance' => 'required|array',
                'attendance.*.student_id' => 'required|exists:students,id',
                'attendance.*.is_present' => 'required|boolean',
            ]);

            $courseOfferingId = $validated['course_offering_id'];
            $date = $validated['date'];

            // ===== VALIDATED DATA DEBUGGING =====
            \Log::info('SUBMIT ATTENDANCE - VALIDATED DATA:', [
                'course_offering_id' => $courseOfferingId,
                'course_offering_id_type' => gettype($courseOfferingId),
                'date' => $date,
                'attendance_count' => count($validated['attendance']),
                'first_record' => $validated['attendance'][0] ?? null,
                'first_record_student_id_type' => gettype($validated['attendance'][0]['student_id'] ?? null),
            ]);

            $saveResults = [];
            foreach ($validated['attendance'] as $idx => $attendanceData) {
                $originalStudentId = $attendanceData['student_id'];
                $studentId = (string)$attendanceData['student_id'];  // Cast to string for VARCHAR column
                $isPresent = $attendanceData['is_present'];

                // ===== BEFORE SAVE DEBUGGING =====
                \Log::info("SUBMIT ATTENDANCE - STUDENT {$idx}:", [
                    'original_student_id' => $originalStudentId,
                    'original_type' => gettype($originalStudentId),
                    'after_string_cast' => $studentId,
                    'string_cast_type' => gettype($studentId),
                    'is_present' => $isPresent,
                    'is_present_type' => gettype($isPresent),
                ]);

                // Find existing attendance record with string comparison
                $query = Attendance::where('course_offering_id', $courseOfferingId)
                    ->where('student_id', $studentId)
                    ->whereDate('attendance_date', $date);
                
                \Log::info("SUBMIT ATTENDANCE - SQL QUERY FOR SEARCH:", [
                    'sql' => $query->toSql(),
                    'bindings' => $query->getBindings(),
                    'course_offering_id' => $courseOfferingId,
                    'student_id_for_query' => $studentId,
                    'student_id_type_for_query' => gettype($studentId),
                    'date' => $date,
                ]);

                $attendance = $query->first();

                if ($attendance) {
                    // Update existing record
                    $attendance->update(['is_present' => $isPresent]);
                    \Log::info("SUBMIT ATTENDANCE - UPDATED EXISTING RECORD:", [
                        'attendance_id' => $attendance->id,
                        'student_id' => $attendance->student_id,
                        'is_present' => $attendance->is_present,
                    ]);
                    $saveResults[] = ['action' => 'update', 'student_id' => $studentId, 'success' => true];
                } else {
                    // Create new record
                    $newRecord = Attendance::create([
                        'course_offering_id' => $courseOfferingId,
                        'student_id' => $studentId,
                        'attendance_date' => $date,
                        'is_present' => $isPresent,
                    ]);
                    \Log::info("SUBMIT ATTENDANCE - CREATED NEW RECORD:", [
                        'attendance_id' => $newRecord->id,
                        'student_id' => $newRecord->student_id,
                        'student_id_type' => gettype($newRecord->student_id),
                        'attendance_date' => $newRecord->attendance_date,
                        'is_present' => $newRecord->is_present,
                    ]);
                    $saveResults[] = ['action' => 'create', 'student_id' => $studentId, 'success' => true];
                }
            }

            // ===== VERIFY SAVED DATA =====
            $savedRecords = Attendance::where('course_offering_id', $courseOfferingId)
                ->whereDate('attendance_date', $date)
                ->get();
            \Log::info("SUBMIT ATTENDANCE - VERIFICATION (ALL RECORDS AFTER SAVE):", [
                'count' => $savedRecords->count(),
                'records' => $savedRecords->map(fn($r) => [
                    'id' => $r->id,
                    'student_id' => $r->student_id,
                    'student_id_type' => gettype($r->student_id),
                    'is_present' => $r->is_present,
                    'attendance_date' => $r->attendance_date,
                ])->toArray(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Attendance submitted successfully',
                'data' => [
                    'course_offering_id' => $courseOfferingId,
                    'date' => $date,
                    'attendance_count' => count($validated['attendance']),
                    'save_results' => $saveResults,
                ]
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('SUBMIT ATTENDANCE - EXCEPTION:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to submit attendance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * View attendance records for a course offering
     */
    public function viewAttendance(Request $request)
    {
        $validated = $request->validate([
            'course_offering_id' => 'required|integer|exists:course_offerings,id',
            'student_id' => 'nullable|integer|exists:users,id',
            'attendance_date' => 'nullable|date',
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100'
        ]);

        try {
            $teacher = Teacher::where('user_id', $request->user()->id)->firstOrFail();
            
            $courseOfferingId = $validated['course_offering_id'];
            
            // Verify teacher owns this course offering
            $courseOffering = CourseOffering::where('id', $courseOfferingId)
                ->where('teacher_id', $teacher->id)
                ->firstOrFail();

            // Build query for attendance records
            $query = Attendance::where('course_offering_id', $courseOfferingId);

            // Filter by student if provided
            if (!empty($validated['student_id'])) {
                $query->where('student_id', $validated['student_id']);
            }

            // Filter by date if provided
            if (!empty($validated['attendance_date'])) {
                $query->whereDate('attendance_date', $validated['attendance_date']);
            }

            // Get paginated results
            $page = $validated['page'] ?? 1;
            $perPage = $validated['per_page'] ?? 15;
            $attendanceRecords = $query->orderBy('attendance_date', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => 'success',
                'data' => $attendanceRecords,
                'message' => 'Attendance records retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('VIEW ATTENDANCE - EXCEPTION:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve attendance records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update attendance record for a student
     */
    public function updateAttendance(Request $request)
    {
        $validated = $request->validate([
            'attendance_id' => 'required|integer|exists:attendances,id',
            'is_present' => 'required|boolean',
        ]);

        try {
            $teacher = Teacher::where('user_id', $request->user()->id)->firstOrFail();
            
            $attendance = Attendance::findOrFail($validated['attendance_id']);
            
            // Verify teacher owns the course offering for this attendance record
            $courseOffering = CourseOffering::where('id', $attendance->course_offering_id)
                ->where('teacher_id', $teacher->id)
                ->firstOrFail();

            \Log::info('UPDATE ATTENDANCE - REQUEST:', [
                'attendance_id' => $validated['attendance_id'],
                'is_present' => $validated['is_present'],
                'is_present_type' => gettype($validated['is_present']),
            ]);

            // Update attendance record
            $attendance->update([
                'is_present' => $validated['is_present']
            ]);

            \Log::info('UPDATE ATTENDANCE - SUCCESS:', [
                'attendance_id' => $attendance->id,
                'is_present' => $attendance->is_present,
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $attendance,
                'message' => 'Attendance record updated successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Attendance record not found or you do not have permission to update it'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('UPDATE ATTENDANCE - EXCEPTION:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update attendance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
