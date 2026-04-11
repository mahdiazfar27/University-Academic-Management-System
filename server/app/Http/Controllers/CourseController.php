<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use App\Services\JwtService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
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
        \Log::info('[CourseController] getCurrentUser() called');
        
        $user = Auth::user();
        \Log::info('[CourseController] Auth::user() result', ['is_null' => is_null($user)]);
        
        if ($user) {
            \Log::info('[CourseController] Auth user found', ['user_id' => $user->id, 'role' => $user->role]);
            return $user;
        }

        // Try to get user from JWT token
        \Log::info('[CourseController] Attempting JWT extraction');
        try {
            $token = $this->jwtService->getTokenFromRequest();
            \Log::info('[CourseController] Token from request', ['token_exists' => !is_null($token), 'token_length' => $token ? strlen($token) : 0]);
            
            if (!$token) {
                \Log::warning('[CourseController] No token found in request');
                return null;
            }

            $payload = $this->jwtService->validateToken($token);
            \Log::info('[CourseController] Token validation result', ['payload' => json_encode($payload)]);
            
            if (!$payload || !isset($payload['userId'])) {
                \Log::warning('[CourseController] Invalid token payload', ['has_payload' => !is_null($payload), 'has_userId' => $payload && isset($payload['userId'])]);
                return null;
            }

            $user = User::find($payload['userId']);
            \Log::info('[CourseController] User found from JWT', ['user_id' => $user ? $user->id : null, 'user_role' => $user ? $user->role : null]);
            
            return $user;
        } catch (\Exception $e) {
            \Log::error('[CourseController] Exception in getCurrentUser', ['exception_class' => get_class($e), 'message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return null;
        }
    }

    /**
     * Check if user is admin - with JWT validation for public routes
     */
    private function isAdmin()
    {
        \Log::info('[CourseController] isAdmin() called');
        $user = $this->getCurrentUser();
        
        \Log::info('[CourseController] isAdmin check', [
            'user_exists' => !is_null($user),
            'user_role' => $user ? $user->role : 'null',
            'is_admin' => $user && ($user->role === 'admin' || $user->role === 'superadmin')
        ]);
        
        if (!$user) {
            \Log::warning('[CourseController] User not found in isAdmin check - returning false');
            return false;
        }

        $isAdmin = $user->role === 'admin' || $user->role === 'superadmin';
        \Log::info('[CourseController] isAdmin determination', ['user_id' => $user->id, 'role' => $user->role, 'result' => $isAdmin]);
        
        return $isAdmin;
    }    /**
     * Display a listing of courses with filtering and pagination
     */
    public function index(Request $request)
    {
        try {
            $query = Course::query();

            // Filter by department
            if ($request->has('department_id')) {
                $query->where('department_id', $request->query('department_id'));
            }

            // Search by code or title
            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%$search%")
                        ->orWhere('title', 'like', "%$search%");
                });
            }

            $perPage = $request->query('per_page', 15);
            $courses = $query->with('department')
                ->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Courses retrieved successfully',
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

    /**
     * Store a newly created course (admin only)
     */
    public function store(Request $request)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        try {
            $validated = $request->validate([
                'code' => 'required|unique:courses,code',
                'title' => 'required|string',
                'description' => 'nullable|string',
                'credits' => 'required|numeric|min:0.5|max:6',
                'department_id' => 'required|exists:departments,id',
            ]);

            $course = Course::create($validated);
            $course->load('department');

            return response()->json([
                'status' => 'success',
                'message' => 'Course created successfully',
                'data' => $course
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
                'message' => 'Failed to create course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified course
     */
    public function show(Course $course, Request $request)
    {
        try {
            $include = $request->query('include', 'department');
            $relations = explode(',', $include);
            
            $course->load($relations);

            return response()->json([
                'status' => 'success',
                'message' => 'Course retrieved successfully',
                'data' => $course
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified course (admin only)
     */
    public function update(Request $request, Course $course)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        try {
            $validated = $request->validate([
                'title' => 'nullable|string',
                'description' => 'nullable|string',
                'credits' => 'nullable|numeric|min:0.5|max:6',
            ]);

            $course->update($validated);
            $course->load('department');

            return response()->json([
                'status' => 'success',
                'message' => 'Course updated successfully',
                'data' => $course
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
                'message' => 'Failed to update course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified course (admin only)
     */
    public function destroy(Course $course)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        try {
            $course->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Course deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete course',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
