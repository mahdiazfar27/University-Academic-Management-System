<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoticeController extends Controller
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
        \Log::info('[NoticeController] getCurrentUser() called');
        
        $user = Auth::user();
        \Log::info('[NoticeController] Auth::user() result', ['is_null' => is_null($user)]);
        
        if ($user) {
            \Log::info('[NoticeController] Auth user found', ['user_id' => $user->id, 'role' => $user->role]);
            return $user;
        }

        // Try to get user from JWT token
        \Log::info('[NoticeController] Attempting JWT extraction');
        try {
            $token = $this->jwtService->getTokenFromRequest();
            \Log::info('[NoticeController] Token from request', ['token_exists' => !is_null($token), 'token_length' => $token ? strlen($token) : 0]);
            
            if (!$token) {
                \Log::warning('[NoticeController] No token found in request');
                return null;
            }

            $payload = $this->jwtService->validateToken($token);
            \Log::info('[NoticeController] Token validation result', ['payload' => json_encode($payload)]);
            
            if (!$payload || !isset($payload['userId'])) {
                \Log::warning('[NoticeController] Invalid token payload', ['has_payload' => !is_null($payload), 'has_userId' => $payload && isset($payload['userId'])]);
                return null;
            }

            $user = User::find($payload['userId']);
            \Log::info('[NoticeController] User found from JWT', ['user_id' => $user ? $user->id : null, 'user_role' => $user ? $user->role : null]);
            
            return $user;
        } catch (\Exception $e) {
            \Log::error('[NoticeController] Exception in getCurrentUser', ['exception_class' => get_class($e), 'message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return null;
        }
    }

    /**
     * Check if user is admin - with JWT validation for public routes
     */
    private function isAdmin()
    {
        $user = $this->getCurrentUser();
        \Log::info('[Notice] isAdmin() check', ['user_exists' => !is_null($user), 'user_id' => $user ? $user->id : null, 'role' => $user ? $user->role : null]);
        
        if (!$user) {
            \Log::warning('[Notice] isAdmin() returning false - no user found');
            return false;
        }

        $isAdmin = $user->role === 'admin' || $user->role === 'superadmin';
        \Log::info('[Notice] isAdmin() result', ['is_admin' => $isAdmin, 'role' => $user->role]);
        return $isAdmin;
    }

    /**
     * Display a listing of notices
     */
    public function index(Request $request)
    {
        try {
            $query = Notice::query();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->query('status'));
            }

            // Filter by audience
            if ($request->has('audience')) {
                $query->where('audience', $request->query('audience'));
            }

            // Filter by category
            if ($request->has('category')) {
                $query->where('category', $request->query('category'));
            }

            // Search by title or content
            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%$search%")
                      ->orWhere('reference_code', 'like', "%$search%");
                });
            }

            $perPage = $request->query('per_page', 15);
            $notices = $query->with('createdBy')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Notices retrieved successfully',
                'data' => $notices
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve notices',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created notice in storage
     * Allowed for: Admin, Teacher
     */
    public function store(Request $request)
    {
        $user = $this->getCurrentUser();
        
        // Check authorization - only admin and teacher can post notices
        if (!$user || !in_array($user->role, ['admin', 'superadmin', 'teacher'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Admin or Teacher access required'
            ], 403);
        }

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'audience' => 'required|in:all,students,teachers,admin,faculty',
                'category' => 'required|in:announcement,alert,scholarship,event,academic,other',
                'status' => 'required|in:draft,published,archived',
                'expires_at' => 'nullable|date_format:Y-m-d H:i:s|after:now',
            ]);

            $validated['created_by'] = $user->id;
            $validated['reference_code'] = Notice::generateReferenceCode($validated['category']);
            
            if ($validated['status'] === 'published') {
                $validated['published_at'] = now();
            }

            $notice = Notice::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Notice created successfully',
                'data' => $notice->load('createdBy')
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
                'message' => 'Failed to create notice',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified notice
     */
    public function show($id)
    {
        try {
            $notice = Notice::with('createdBy')->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Notice retrieved successfully',
                'data' => $notice
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Notice not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified notice
     */
    public function update(Request $request, $id)
    {
        // Check admin authorization
        if (!$this->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Admin access required'
            ], 403);
        }

        try {
            $notice = Notice::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'content' => 'sometimes|required|string',
                'audience' => 'sometimes|required|in:all,students,teachers,admin,faculty',
                'category' => 'sometimes|required|in:announcement,alert,scholarship,event,academic,other',
                'status' => 'sometimes|required|in:draft,published,archived',
                'expires_at' => 'nullable|date_format:Y-m-d H:i:s',
            ]);

            // If status is changing to published and not already published
            if ($request->has('status') && $request->status === 'published' && $notice->status !== 'published') {
                $validated['published_at'] = now();
            }

            $notice->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Notice updated successfully',
                'data' => $notice->load('createdBy')
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
                'message' => 'Failed to update notice',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified notice
     */
    public function destroy($id)
    {
        // Check admin authorization
        if (!$this->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Admin access required'
            ], 403);
        }

        try {
            $notice = Notice::findOrFail($id);
            $notice->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Notice deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete notice',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for notices dashboard
     */
    public function stats()
    {
        try {
            $totalNotices = Notice::count();
            $publishedNotices = Notice::where('status', 'published')->count();
            $draftNotices = Notice::where('status', 'draft')->count();
            $categories = Notice::select('category')
                ->distinct()
                ->get()
                ->pluck('category')
                ->count();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total' => $totalNotices,
                    'published' => $publishedNotices,
                    'draft' => $draftNotices,
                    'categories' => $categories
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
