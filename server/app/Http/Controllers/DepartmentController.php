<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use App\Services\JwtService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DepartmentController extends Controller
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
        \Log::info('[DepartmentController] getCurrentUser() called');
        
        $user = Auth::user();
        \Log::info('[DepartmentController] Auth::user() result', ['is_null' => is_null($user)]);
        
        if ($user) {
            \Log::info('[DepartmentController] Auth user found', ['user_id' => $user->id, 'role' => $user->role]);
            return $user;
        }

        // Try to get user from JWT token
        \Log::info('[DepartmentController] Attempting JWT extraction');
        try {
            $token = $this->jwtService->getTokenFromRequest();
            \Log::info('[DepartmentController] Token from request', ['token_exists' => !is_null($token), 'token_length' => $token ? strlen($token) : 0]);
            
            if (!$token) {
                \Log::warning('[DepartmentController] No token found in request');
                return null;
            }

            $payload = $this->jwtService->validateToken($token);
            \Log::info('[DepartmentController] Token validation result', ['payload' => json_encode($payload)]);
            
            if (!$payload || !isset($payload['userId'])) {
                \Log::warning('[DepartmentController] Invalid token payload', ['has_payload' => !is_null($payload), 'has_userId' => $payload && isset($payload['userId'])]);
                return null;
            }

            $user = User::find($payload['userId']);
            \Log::info('[DepartmentController] User found from JWT', ['user_id' => $user ? $user->id : null, 'user_role' => $user ? $user->role : null]);
            
            return $user;
        } catch (\Exception $e) {
            \Log::error('[DepartmentController] Exception in getCurrentUser', ['exception_class' => get_class($e), 'message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return null;
        }
    }

    /**
     * Check if user is admin - with JWT validation for public routes
     */
    private function isAdmin()
    {
        \Log::info('[DepartmentController] isAdmin() called');
        $user = $this->getCurrentUser();
        
        \Log::info('[DepartmentController] isAdmin check', [
            'user_exists' => !is_null($user),
            'user_role' => $user ? $user->role : 'null',
            'is_admin' => $user && ($user->role === 'admin' || $user->role === 'superadmin')
        ]);
        
        if (!$user) {
            \Log::warning('[DepartmentController] User not found in isAdmin check - returning false');
            return false;
        }

        $isAdmin = $user->role === 'admin' || $user->role === 'superadmin';
        \Log::info('[DepartmentController] isAdmin determination', ['user_id' => $user->id, 'role' => $user->role, 'result' => $isAdmin]);
        
        return $isAdmin;
    }

    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 15);
            $departments = Department::withCount('students', 'teachers', 'courses')
                ->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Departments retrieved successfully',
                'data' => $departments
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve departments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        try {
            $validated = $request->validate([
                'name' => 'required|unique:departments,name',
                'code' => 'required|unique:departments,code',
                'description' => 'nullable|string',
                'head_id' => 'nullable|exists:users,id',
            ]);

            $department = Department::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Department created successfully',
                'data' => $department
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
                'message' => 'Failed to create department',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Department $department)
    {
        try {
            $department->loadCount('students', 'teachers', 'courses');

            return response()->json([
                'status' => 'success',
                'message' => 'Department retrieved successfully',
                'data' => $department
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve department',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Department $department)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        try {
            $validated = $request->validate([
                'name' => 'nullable|unique:departments,name,' . $department->id,
                'code' => 'nullable|unique:departments,code,' . $department->id,
                'description' => 'nullable|string',
                'head_id' => 'nullable|exists:users,id',
            ]);

            $department->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Department updated successfully',
                'data' => $department
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
                'message' => 'Failed to update department',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Department $department)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        try {
            // Check if department has any students or teachers
            if ($department->students()->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete department with assigned students'
                ], 403);
            }

            if ($department->teachers()->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete department with assigned teachers'
                ], 403);
            }

            $department->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Department deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete department',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
