<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\CourseOffering;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    protected $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Get current user from Auth or JWT token
     */
    private function getCurrentUser()
    {
        $user = Auth::user();
        if ($user) {
            return $user;
        }

        // Try to get user from JWT token
        try {
            $token = $this->jwtService->getTokenFromRequest();
            if (!$token) {
                return null;
            }

            $payload = $this->jwtService->validateToken($token);
            if (!$payload || !isset($payload['userId'])) {
                return null;
            }

            return User::find($payload['userId']);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Record attendance for a course session
     */
    public function recordAttendance(Request $request, $courseOfferingId)
    {
        try {
            $user = $this->getCurrentUser();

            if (!$user || $user->role !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - Teacher access required',
                ], 403);
            }

            $courseOffering = CourseOffering::find($courseOfferingId);

            if (!$courseOffering) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course offering not found',
                ], 404);
            }

            // Verify teacher owns this course
            if ($courseOffering->teacher_id != $user->teacher?->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - This is not your course',
                ], 403);
            }

            $validated = $request->validate([
                'attendance_date' => 'required|date',
                'attendance' => 'required|array',
                'attendance.*.student_id' => 'required|integer',
                'attendance.*.is_present' => 'required|boolean',
                'remarks' => 'nullable|string|max:1000',
            ]);

            $attendanceRecords = [];

            foreach ($validated['attendance'] as $record) {
                $studentId = $record['student_id'];

                // Verify student is enrolled
                $enrollment = Enrollment::where('student_id', $studentId)
                    ->where('course_offering_id', $courseOfferingId)
                    ->first();

                if (!$enrollment) {
                    continue; // Skip if not enrolled
                }

                $attendance = Attendance::updateOrCreate(
                    [
                        'student_id' => $studentId,
                        'course_offering_id' => $courseOfferingId,
                        'attendance_date' => $validated['attendance_date'],
                    ],
                    [
                        'is_present' => $record['is_present'],
                        'remarks' => $validated['remarks'] ?? null,
                    ]
                );

                $attendanceRecords[] = $attendance;
            }

            return response()->json([
                'success' => true,
                'message' => 'Attendance recorded successfully',
                'data' => [
                    'course_offering_id' => $courseOfferingId,
                    'attendance_date' => $validated['attendance_date'],
                    'records_updated' => count($attendanceRecords),
                    'attendance' => $attendanceRecords,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recording attendance',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get attendance sheet for a course offering
     */
    public function courseAttendanceSheet($courseOfferingId, Request $request)
    {
        try {
            $user = $this->getCurrentUser();

            if (!$user || $user->role !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - Teacher access required',
                ], 403);
            }

            $courseOffering = CourseOffering::with(['course', 'semester'])
                ->find($courseOfferingId);

            if (!$courseOffering) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course offering not found',
                ], 404);
            }

            // Verify teacher owns this course
            if ($courseOffering->teacher_id != $user->teacher?->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - This is not your course',
                ], 403);
            }

            $fromDate = $request->query('from_date');
            $toDate = $request->query('to_date');

            $query = Attendance::where('course_offering_id', $courseOfferingId)
                ->with('student.user');

            if ($fromDate) {
                $query->whereDate('attendance_date', '>=', $fromDate);
            }

            if ($toDate) {
                $query->whereDate('attendance_date', '<=', $toDate);
            }

            $attendance = $query->get();

            // Group by student
            $byStudent = $attendance->groupBy('student_id')
                ->map(function ($records) {
                    $total = $records->count();
                    $present = $records->where('is_present', true)->count();
                    $percentage = $total > 0 ? round(($present / $total) * 100, 2) : 0;

                    return [
                        'student_id' => $records->first()->student_id,
                        'student_name' => $records->first()->student->user->name,
                        'total_classes' => $total,
                        'classes_present' => $present,
                        'classes_absent' => $total - $present,
                        'attendance_percentage' => $percentage,
                        'records' => $records->map(fn($r) => [
                            'date' => $r->attendance_date,
                            'is_present' => $r->is_present,
                        ])->toArray(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'course_offering' => $courseOffering,
                    'total_records' => $attendance->count(),
                    'attendance_by_student' => $byStudent->values(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving attendance sheet',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get student's attendance in a course
     */
    public function studentCourseAttendance($studentId, $courseOfferingId)
    {
        try {
            $user = $this->getCurrentUser();

            // If student, verify they're viewing own attendance
            if ($user && $user->role === 'student' && $user->student?->id != $studentId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - Cannot view other student attendance',
                ], 403);
            }

            $enrollment = Enrollment::where('student_id', $studentId)
                ->where('course_offering_id', $courseOfferingId)
                ->with('courseOffering.course')
                ->first();

            if (!$enrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Enrollment not found',
                ], 404);
            }

            $attendance = Attendance::where('student_id', $studentId)
                ->where('course_offering_id', $courseOfferingId)
                ->get();

            $total = $attendance->count();
            $present = $attendance->where('is_present', true)->count();
            $percentage = $total > 0 ? round(($present / $total) * 100, 2) : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'course' => [
                        'id' => $enrollment->courseOffering->course->id,
                        'name' => $enrollment->courseOffering->course->name,
                        'code' => $enrollment->courseOffering->course->course_code,
                    ],
                    'attendance_summary' => [
                        'total_classes' => $total,
                        'classes_present' => $present,
                        'classes_absent' => $total - $present,
                        'attendance_percentage' => $percentage,
                    ],
                    'attendance_records' => $attendance->map(fn($a) => [
                        'date' => $a->attendance_date,
                        'is_present' => $a->is_present,
                    ])->toArray(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving attendance',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all attendance for a specific enrollment
     */
    public function enrollmentAttendance($enrollmentId)
    {
        try {
            $user = $this->getCurrentUser();

            $enrollment = Enrollment::with(['student', 'courseOffering.course'])->find($enrollmentId);

            if (!$enrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Enrollment not found',
                ], 404);
            }

            // Verify student accessing own enrollment
            if ($user && $user->role === 'student' && $enrollment->student->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            $attendance = Attendance::where('student_id', $enrollment->student_id)
                ->where('course_offering_id', $enrollment->course_offering_id)
                ->get();

            $total = $attendance->count();
            $present = $attendance->where('is_present', true)->count();
            $percentage = $total > 0 ? round(($present / $total) * 100, 2) : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'course' => [
                        'id' => $enrollment->courseOffering->course->id,
                        'name' => $enrollment->courseOffering->course->name,
                        'code' => $enrollment->courseOffering->course->course_code,
                    ],
                    'attendance_summary' => [
                        'total_classes' => $total,
                        'classes_present' => $present,
                        'classes_absent' => $total - $present,
                        'attendance_percentage' => $percentage,
                    ],
                    'attendance_records' => $attendance->map(fn($a) => [
                        'date' => $a->attendance_date,
                        'is_present' => $a->is_present,
                    ])->toArray(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving attendance',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
