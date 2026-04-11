<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\User;
use App\Services\JwtService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
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
        \Log::info('[EnrollmentController] getCurrentUser() called');
        
        $user = Auth::user();
        \Log::info('[EnrollmentController] Auth::user() result', ['is_null' => is_null($user)]);
        
        if ($user) {
            \Log::info('[EnrollmentController] User found via Auth', ['user_id' => $user->id]);
            return $user;
        }

        // Try to get user from JWT token
        try {
            $token = $this->jwtService->getTokenFromRequest();
            \Log::info('[EnrollmentController] Token from request', ['token_exists' => !is_null($token), 'token_length' => $token ? strlen($token) : 0]);
            
            if (!$token) {
                \Log::warning('[EnrollmentController] No JWT token found in request');
                return null;
            }

            $payload = $this->jwtService->validateToken($token);
            \Log::info('[EnrollmentController] Token validation result', ['payload' => json_encode($payload)]);
            
            if (!$payload || !isset($payload['userId'])) {
                \Log::warning('[EnrollmentController] Invalid token payload');
                return null;
            }

            $user = User::find($payload['userId']);
            \Log::info('[EnrollmentController] User from JWT', ['user_id' => $user ? $user->id : null]);
            
            // Set the role from JWT token (JWT role is authoritative)
            if ($user && isset($payload['role'])) {
                $user->role = $payload['role'];
                \Log::info('[EnrollmentController] Set role from JWT', ['role' => $payload['role']]);
            }
            
            return $user;
        } catch (\Exception $e) {
            \Log::error('[EnrollmentController] Error in getCurrentUser', ['exception' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Display a listing of enrollments with filtering
     */
    public function index(Request $request)
    {
        \Log::info('[EnrollmentController] index() called');
        
        // Get current user
        $user = $this->getCurrentUser();
        \Log::info('[EnrollmentController] index() user result', ['user_exists' => !is_null($user), 'user_role' => $user ? $user->role : 'null']);
        
        if (!$user) {
            \Log::warning('[EnrollmentController] No authenticated user');
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Authentication required.'
            ], 401);
        }

        try {
            $query = Enrollment::query();

            // Role-based filtering
            if ($user->role === 'student') {
                // Students can only see their own enrollments
                // Find the student record by user_id to get their student_id
                $student = \App\Models\Student::where('user_id', $user->id)->first();
                if (!$student) {
                    \Log::warning('[EnrollmentController] Student record not found for user', ['user_id' => $user->id]);
                    return response()->json([
                        'status' => 'success',
                        'message' => 'No student record found',
                        'data' => (object)['data' => []]
                    ], 200);
                }
                \Log::info('[EnrollmentController] Student accessing enrollments', ['user_id' => $user->id, 'student_id' => $student->student_id]);
                $query->where('student_id', $student->student_id);
            } else if ($user->role !== 'admin' && $user->role !== 'superadmin') {
                // Only students, admins, and superadmins can access enrollments
                \Log::warning('[EnrollmentController] Unauthorized role accessing enrollments', ['user_role' => $user->role]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. Only admins and students can access enrollments.'
                ], 403);
            }

            // Admin query filters (only admins can use these)
            if ($user->role !== 'student') {
                if ($request->has('student_id')) {
                    $query->where('student_id', $request->query('student_id'));
                }

                if ($request->has('course_offering_id')) {
                    $query->where('course_offering_id', $request->query('course_offering_id'));
                }

                if ($request->has('semester_id')) {
                    $query->where('semester_id', $request->query('semester_id'));
                }
            }

            $perPage = $request->query('per_page', 15);
            $enrollments = $query->with('student', 'courseOffering.course', 'semester')
                ->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Enrollments retrieved successfully',
                'data' => $enrollments
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve enrollments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created enrollment
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_id' => 'required|exists:students,student_id',
                'course_offering_id' => 'required|exists:course_offerings,id',
                'semester_id' => 'required|exists:semesters,id',
                'enrollment_status' => 'required|in:Enrolled,Withdrawn,Completed,Dropped',
                'enrollment_date' => 'required|date',
            ]);

            // Check for duplicate enrollment
            $existing = Enrollment::where([
                'student_id' => $validated['student_id'],
                'course_offering_id' => $validated['course_offering_id'],
            ])->first();

            if ($existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student is already enrolled in this course'
                ], 409);
            }

            $enrollment = Enrollment::create($validated);
            $enrollment->load('student', 'courseOffering', 'semester');

            return response()->json([
                'status' => 'success',
                'message' => 'Enrollment created successfully',
                'data' => $enrollment
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
                'message' => 'Failed to create enrollment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified enrollment
     */
    public function show(Enrollment $enrollment, Request $request)
    {
        try {
            $include = $request->query('include', 'student,courseOffering,semester');
            $relations = explode(',', $include);
            
            $enrollment->load($relations);

            return response()->json([
                'status' => 'success',
                'message' => 'Enrollment retrieved successfully',
                'data' => $enrollment
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve enrollment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified enrollment
     */
    public function update(Request $request, Enrollment $enrollment)
    {
        try {
            $validated = $request->validate([
                'enrollment_status' => 'in:Enrolled,Withdrawn,Completed,Dropped',
            ]);

            $enrollment->update($validated);
            $enrollment->load('student', 'courseOffering', 'semester');

            return response()->json([
                'status' => 'success',
                'message' => 'Enrollment updated successfully',
                'data' => $enrollment
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
                'message' => 'Failed to update enrollment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified enrollment
     */
    public function destroy(Enrollment $enrollment)
    {
        try {
            $enrollment->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Enrollment deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete enrollment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Self-enrollment endpoint for students to enroll in courses
     */
    public function selfEnroll(Request $request)
    {
        try {
            // Get current user from JWT token
            $user = $this->getCurrentUser();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized - Student authentication required'
                ], 401);
            }

            // Get student record
            $student = \App\Models\Student::where('user_id', $user->id)->first();
            if (!$student) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Validate request
            $validated = $request->validate([
                'course_offering_id' => 'required|exists:course_offerings,id',
                'semester_id' => 'required|exists:semesters,id',
            ]);

            // Check for duplicate enrollment
            $existing = Enrollment::where([
                'student_id' => $student->student_id,
                'course_offering_id' => $validated['course_offering_id'],
            ])->first();

            if ($existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You are already enrolled in this course'
                ], 409);
            }

            // Check course offering capacity
            $courseOffering = \App\Models\CourseOffering::findOrFail($validated['course_offering_id']);
            $enrolledCount = Enrollment::where('course_offering_id', $courseOffering->id)->count();
            
            if ($courseOffering->capacity && $enrolledCount >= $courseOffering->capacity) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Course is at full capacity'
                ], 409);
            }

            // Create enrollment
            $enrollment = Enrollment::create([
                'student_id' => $student->student_id,
                'course_offering_id' => $validated['course_offering_id'],
                'semester_id' => $validated['semester_id'],
                'enrollment_status' => 'Enrolled',
                'enrollment_date' => now()->toDateString(),
            ]);

            $enrollment->load('student', 'courseOffering', 'semester');

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully enrolled in course',
                'data' => $enrollment
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
                'message' => 'Enrollment failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available course offerings for student enrollment
     */
    public function availableCourses(Request $request)
    {
        try {
            $semesterId = $request->query('semester_id');
            $departmentId = $request->query('department_id');
            
            $query = \App\Models\CourseOffering::with('course', 'teacher', 'semester')
                ->where('status', 'active');

            if ($semesterId) {
                $query->where('semester_id', $semesterId);
            }

            if ($departmentId) {
                $query->whereHas('course', function ($q) use ($departmentId) {
                    $q->where('department_id', $departmentId);
                });
            }

            $courses = $query->paginate($request->query('per_page', 15));

            return response()->json([
                'status' => 'success',
                'message' => 'Available courses retrieved',
                'data' => $courses
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
