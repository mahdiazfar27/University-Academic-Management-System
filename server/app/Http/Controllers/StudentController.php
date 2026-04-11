<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of students with pagination
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 15);
            $students = Student::with('user', 'department')
                ->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Students retrieved successfully',
                'data' => $students
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve students',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created student in storage
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'department_id' => 'required|exists:departments,id',
                'student_id' => 'required|unique:students,student_id',
                'admission_year' => 'required|integer',
                'current_semester' => 'required|integer',
                'admission_semester' => 'required|string',
                'father_name' => 'required|string',
                'mother_name' => 'required|string',
            ]);

            $student = Student::create($validated);
            $student->load('user', 'department');

            return response()->json([
                'status' => 'success',
                'message' => 'Student created successfully',
                'data' => $student
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
                'message' => 'Failed to create student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified student
     */
    public function show(Student $student, Request $request)
    {
        try {
            $include = $request->query('include', 'user,department');
            $relations = explode(',', $include);
            
            $student->load($relations);

            return response()->json([
                'status' => 'success',
                'message' => 'Student retrieved successfully',
                'data' => $student
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified student
     */
    public function update(Request $request, Student $student)
    {
        try {
            $validated = $request->validate([
                'current_semester' => 'integer|min:1|max:8',
                'cgpa' => 'decimal:0,2|min:0|max:4',
                'gpa' => 'decimal:0,2|min:0|max:4',
                'enrollment_status' => 'in:active,inactive,graduated,dropped',
                'father_name' => 'string',
                'mother_name' => 'string',
            ]);

            $student->update($validated);
            $student->load('user', 'department');

            return response()->json([
                'status' => 'success',
                'message' => 'Student updated successfully',
                'data' => $student
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
                'message' => 'Failed to update student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified student
     */
    public function destroy(Student $student)
    {
        try {
            $student->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Student deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated student's profile
     */
    public function getProfile(Request $request)
    {
        try {
            // Get user from JWT token if available, otherwise from auth
            $user = null;
            
            // Try JWT service first (for JWT-protected routes)
            try {
                $jwtService = app('App\Services\JwtService');
                $token = $jwtService->getTokenFromRequest();
                if ($token) {
                    $payload = $jwtService->validateToken($token);
                    $user = \App\Models\User::find($payload['userId'] ?? null);
                }
            } catch (\Exception $e) {
                // Fall through to request->user()
            }
            
            if (!$user) {
                $user = $request->user();
            }

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized - authentication required'
                ], 401);
            }

            $student = Student::where('user_id', $user->id)
                ->with('user', 'department', 'enrollments', 'results')
                ->first();

            if (!$student) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student profile not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Student profile retrieved successfully',
                'data' => $student
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve student profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student's courses for current semester
     */
    public function getCourses(Request $request, Student $student)
    {
        try {
            $enrollments = $student->enrollments()
                ->with('courseOffering.course', 'courseOffering.teacher.user')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Student courses retrieved successfully',
                'data' => $enrollments
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve student courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update authenticated student's own profile
     */
    public function updateProfile(Request $request)
    {
        try {
            // Get user from JWT token if available, otherwise from auth
            $user = null;
            
            // Try JWT service first (for JWT-protected routes)
            try {
                $jwtService = app('App\Services\JwtService');
                $token = $jwtService->getTokenFromRequest();
                if ($token) {
                    $payload = $jwtService->validateToken($token);
                    $user = \App\Models\User::find($payload['userId'] ?? null);
                }
            } catch (\Exception $e) {
                // Fall through to request->user()
            }
            
            if (!$user) {
                $user = $request->user();
            }

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized - authentication required'
                ], 401);
            }

            $student = Student::where('user_id', $user->id)->first();
            if (!$student) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Validate update fields - allow students to update personal and guardian info
            $validated = $request->validate([
                // User table fields
                'first_name' => 'nullable|string|max:100',
                'last_name' => 'nullable|string|max:100',
                'gender' => 'nullable|in:M,F,Other',
                'date_of_birth' => 'nullable|date',
                'blood_group' => 'nullable|string|max:5',
                'religion' => 'nullable|string|max:50',
                'phone_number' => 'nullable|string|max:20',
                // Student table fields
                'father_name' => 'nullable|string|max:100',
                'mother_name' => 'nullable|string|max:100',
            ]);

            // Update user fields
            $userFields = ['first_name', 'last_name', 'gender', 'date_of_birth', 'blood_group', 'religion', 'phone_number'];
            $userData = array_filter(
                array_intersect_key($validated, array_flip($userFields)),
                function($value) { return $value !== null; }
            );
            
            if (!empty($userData)) {
                $user->update($userData);
            }

            // Update student fields
            $studentFields = ['father_name', 'mother_name'];
            $studentData = array_filter(
                array_intersect_key($validated, array_flip($studentFields)),
                function($value) { return $value !== null; }
            );
            
            if (!empty($studentData)) {
                $student->update($studentData);
            }

            $student->load('user', 'department');

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'data' => $student
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
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
