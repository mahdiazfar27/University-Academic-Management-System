<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,teacher,student',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'status' => 'active',
            ]);

            $token = $this->jwtService->generateToken(
                $user->id,
                $user->email,
                $user->role,
                $user->first_name . ' ' . $user->last_name
            );

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
            'role' => 'required|in:admin,teacher,student',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)
                ->where('role', $request->role)
                ->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            if ($user->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'User account is inactive'
                ], 403);
            }

            $token = $this->jwtService->generateToken(
                $user->id,
                $user->email,
                $user->role,
                $user->first_name . ' ' . $user->last_name
            );

            // Build user response data
            $userData = [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'role' => $user->role,
            ];

            // For students, include the student record ID and student_id string
            if ($user->role === 'student') {
                $student = \App\Models\Student::where('user_id', $user->id)->first();
                if ($student) {
                    $userData['student_id'] = $student->id;  // numeric ID for profile
                    $userData['student_code'] = $student->student_id;  // string ID for enrollments
                }
            }

            // For teachers, include the teacher record ID
            if ($user->role === 'teacher') {
                $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();
                if ($teacher) {
                    $userData['teacher_id'] = $teacher->id;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => $userData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current user from token
     */
    public function me(Request $request)
    {
        try {
            $token = $this->jwtService->getTokenFromRequest();
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'No token provided'
                ], 401);
            }

            $payload = $this->jwtService->validateToken($token);

            $user = User::findOrFail($payload['userId']);

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }
    }

    /**
     * Logout (frontend handles this by deleting token)
     */
    public function logout()
    {
        return response()->json([
            'success' => true,
            'message' => 'Logout successful'
        ], 200);
    }
}
