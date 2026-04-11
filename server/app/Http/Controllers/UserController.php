<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
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
        \Log::info('[UserController] getCurrentUser() called');
        
        $user = Auth::user();
        \Log::info('[UserController] Auth::user() result', ['is_null' => is_null($user)]);
        
        if ($user) {
            \Log::info('[UserController] Auth user found', ['user_id' => $user->id, 'role' => $user->role]);
            return $user;
        }

        // Try to get user from JWT token
        \Log::info('[UserController] Attempting JWT extraction');
        try {
            $token = $this->jwtService->getTokenFromRequest();
            \Log::info('[UserController] Token from request', ['token_exists' => !is_null($token), 'token_length' => $token ? strlen($token) : 0]);
            
            if (!$token) {
                \Log::warning('[UserController] No token found in request');
                return null;
            }

            $payload = $this->jwtService->validateToken($token);
            \Log::info('[UserController] Token validation result', ['payload' => json_encode($payload)]);
            
            if (!$payload || !isset($payload['userId'])) {
                \Log::warning('[UserController] Invalid token payload', ['has_payload' => !is_null($payload), 'has_userId' => $payload && isset($payload['userId'])]);
                return null;
            }

            $user = User::find($payload['userId']);
            \Log::info('[UserController] User found from JWT', ['user_id' => $user ? $user->id : null, 'user_role' => $user ? $user->role : null]);
            
            return $user;
        } catch (\Exception $e) {
            \Log::error('[UserController] Exception in getCurrentUser', ['exception_class' => get_class($e), 'message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return null;
        }
    }

    /**
     * Check if user is admin - with JWT validation for public routes
     */
    private function isAdmin()
    {
        \Log::info('[UserController] isAdmin() called');
        $user = $this->getCurrentUser();
        
        \Log::info('[UserController] isAdmin check', [
            'user_exists' => !is_null($user),
            'user_role' => $user ? $user->role : 'null',
            'is_admin' => $user && ($user->role === 'admin' || $user->role === 'superadmin')
        ]);
        
        if (!$user) {
            \Log::warning('[UserController] User not found in isAdmin check - returning false');
            return false;
        }

        $isAdmin = $user->role === 'admin' || $user->role === 'superadmin';
        \Log::info('[UserController] isAdmin determination', ['user_id' => $user->id, 'role' => $user->role, 'result' => $isAdmin]);
        
        return $isAdmin;
    }

    /**
     * Display a listing of all users (admin only)
     */
    public function index(Request $request)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        try {
            $query = User::query();

            // Filter by role if provided
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%$search%")
                      ->orWhere('last_name', 'like', "%$search%")
                      ->orWhere('email', 'like', "%$search%");
                });
            }

            // Sort by created_at descending (newest first)
            $query->orderBy('created_at', 'desc');

            // Pagination
            $perPage = $request->get('per_page', 15);
            $users = $query->paginate($perPage);

            return response()->json([
                'message' => 'Users retrieved successfully',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching users: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created user (admin only)
     */
    public function store(Request $request)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:student,teacher,admin',
            'status' => 'nullable|in:active,inactive,suspended',
            'phone_number' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'blood_group' => 'nullable|string|max:3',
            'religion' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            // Split full name into first and last name
            $nameParts = explode(' ', trim($request->name), 2);
            $firstName = $nameParts[0];
            $lastName = isset($nameParts[1]) ? $nameParts[1] : '';

            $user = User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'status' => $request->status ?? 'active',
                'phone_number' => $request->phone_number,
                'date_of_birth' => $request->date_of_birth,
                'gender' => $request->gender,
                'blood_group' => $request->blood_group,
                'religion' => $request->religion,
            ]);

            return response()->json([
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error creating user: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified user (admin or self)
     */
    public function show(User $user)
    {
        $currentUser = $this->getCurrentUser();
        
        // Allow admins to see any user, or users to see themselves
        if (!$this->isAdmin() && (!$currentUser || $currentUser->id !== $user->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'message' => 'User retrieved successfully',
            'data' => $user
        ]);
    }

    /**
     * Update the specified user (admin or self for non-sensitive fields)
     */
    public function update(Request $request, User $user)
    {
        $currentUser = $this->getCurrentUser();
        $isAdmin = $this->isAdmin();

        // Users can update their own profile (limited fields)
        // Admins can update any user
        if (!$isAdmin && (!$currentUser || $currentUser->id !== $user->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => $isAdmin ? 'nullable|in:student,teacher,admin' : 'prohibited',
            'status' => $isAdmin ? 'nullable|in:active,inactive,suspended' : 'prohibited',
            'phone_number' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'blood_group' => 'nullable|string|max:3',
            'religion' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            // Handle name field - split into first_name and last_name
            if ($request->has('name')) {
                $nameParts = explode(' ', trim($request->name), 2);
                $user->first_name = $nameParts[0];
                $user->last_name = isset($nameParts[1]) ? $nameParts[1] : '';
            }

            if ($request->has('email')) $user->email = $request->email;
            if ($request->has('password')) $user->password = Hash::make($request->password);
            if ($isAdmin && $request->has('role')) $user->role = $request->role;
            if ($isAdmin && $request->has('status')) $user->status = $request->status;
            if ($request->has('phone_number')) $user->phone_number = $request->phone_number;
            if ($request->has('date_of_birth')) $user->date_of_birth = $request->date_of_birth;
            if ($request->has('gender')) $user->gender = $request->gender;
            if ($request->has('blood_group')) $user->blood_group = $request->blood_group;
            if ($request->has('religion')) $user->religion = $request->religion;

            $user->save();

            return response()->json([
                'message' => 'User updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating user: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified user (admin only)
     */
    public function destroy(User $user)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        try {
            // Don't allow deleting the last admin
            if ($user->role === 'admin') {
                $adminCount = User::where('role', 'admin')->count();
                if ($adminCount <= 1) {
                    return response()->json(['message' => 'Cannot delete the last admin account'], 403);
                }
            }

            // Delete related records if applicable
            if ($user->role === 'student') {
                Student::where('user_id', $user->id)->delete();
            } elseif ($user->role === 'teacher') {
                Teacher::where('user_id', $user->id)->delete();
            }

            $user->delete();

            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting user: ' . $e->getMessage()], 500);
        }
    }
}
