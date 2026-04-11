<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingController extends Controller
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
        \Log::info('[SettingController] getCurrentUser() called');
        $user = Auth::user();
        if ($user) {
            \Log::info('[SettingController] User found in Auth', ['user_id' => $user->id, 'role' => $user->role]);
            return $user;
        }

        \Log::info('[SettingController] Auth::user() result', ['is_null' => $user === null]);
        \Log::info('[SettingController] Attempting JWT extraction');

        try {
            $token = $this->jwtService->getTokenFromRequest();
            \Log::info('[SettingController] Token from request', ['token_exists' => $token !== null, 'token_length' => $token ? strlen($token) : 0]);
            
            if (!$token) {
                return null;
            }

            $payload = $this->jwtService->validateToken($token);
            \Log::info('[SettingController] Token validation result', ['payload' => json_encode($payload)]);
            
            if (!$payload || !isset($payload['userId'])) {
                return null;
            }

            $user = User::find($payload['userId']);
            \Log::info('[SettingController] User found from JWT', ['user_id' => $user ? $user->id : null, 'user_role' => $user ? $user->role : null]);
            return $user;
        } catch (\Exception $e) {
            \Log::error('[SettingController] JWT extraction error', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Check if user is admin
     */
    private function isAdmin()
    {
        \Log::info('[SettingController] isAdmin() called');
        $user = $this->getCurrentUser();
        \Log::info('[SettingController] isAdmin check', ['user_exists' => $user !== null, 'user_role' => $user ? $user->role : null, 'is_admin' => $user && ($user->role === 'admin' || $user->role === 'superadmin') ? true : false]);
        
        if (!$user) {
            return false;
        }

        $isAdmin = $user->role === 'admin' || $user->role === 'superadmin';
        \Log::info('[SettingController] isAdmin determination', ['user_id' => $user->id, 'role' => $user->role, 'result' => $isAdmin]);
        return $isAdmin;
    }

    /**
     * Get all settings (public endpoint)
     */
    public function index()
    {
        try {
            \Log::info('[SettingController] index() called - fetching all settings');
            $settings = Setting::all();
            $data = [];
            
            foreach ($settings as $setting) {
                $data[$setting->key] = $setting->value;
                \Log::info('[SettingController] Setting retrieved', ['key' => $setting->key, 'value_length' => strlen((string)$setting->value)]);
            }

            \Log::info('[SettingController] All settings retrieved', ['count' => count($data), 'keys' => array_keys($data)]);

            return response()->json([
                'status' => 'success',
                'data' => $data
            ], 200);
        } catch (\Exception $e) {
            \Log::error('[SettingController] Failed to retrieve settings', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update settings (admin only)
     */
    public function update(Request $request)
    {
        \Log::info('[SettingController] update() called');
        \Log::info('[SettingController] Request data', ['method' => $request->method(), 'content_type' => $request->header('Content-Type')]);
        
        $isAdmin = $this->isAdmin();
        \Log::info('[SettingController] isAdmin result', ['is_admin' => $isAdmin]);
        
        if (!$isAdmin) {
            \Log::warning('[SettingController] Admin access denied');
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        try {
            $updated = [];

            // Handle institution_name
            if ($request->has('institution_name')) {
                $value = $request->input('institution_name');
                \Log::info('[SettingController] Saving setting', ['key' => 'institution_name', 'value_length' => strlen((string)$value), 'value' => $value]);
                $result = Setting::put('institution_name', $value);
                \Log::info('[SettingController] Saved institution_name', ['result' => $result ? 'success' : 'failed']);
                
                // Verify it was saved
                $saved = Setting::get('institution_name');
                \Log::info('[SettingController] Verified save', ['original' => $value, 'saved' => $saved]);
                $updated['institution_name'] = $saved ?: $value;
            }

            // Handle tagline
            if ($request->has('tagline')) {
                $value = $request->input('tagline');
                \Log::info('[SettingController] Saving setting', ['key' => 'tagline', 'value_length' => strlen((string)$value)]);
                $result = Setting::put('tagline', $value);
                \Log::info('[SettingController] Saved tagline', ['result' => $result ? 'success' : 'failed']);
                
                // Verify it was saved
                $saved = Setting::get('tagline');
                \Log::info('[SettingController] Verified save', ['original' => $value, 'saved' => $saved]);
                $updated['tagline'] = $saved ?: $value;
            }

            // Handle logo file upload
            if ($request->hasFile('logo')) {
                try {
                    $file = $request->file('logo');
                    \Log::info('[SettingController] Logo file received', [
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize()
                    ]);

                    // Store the logo file in storage/app/public/logos
                    $path = $file->store('logos', 'public');
                    $logoUrl = '/storage/' . $path;
                    
                    \Log::info('[SettingController] Logo stored', ['path' => $path, 'url' => $logoUrl]);
                    $result = Setting::put('logo_url', $logoUrl);
                    \Log::info('[SettingController] Saved logo_url', ['result' => $result ? 'success' : 'failed']);
                    
                    // Verify it was saved
                    $saved = Setting::get('logo_url');
                    \Log::info('[SettingController] Verified save', ['original' => $logoUrl, 'saved' => $saved]);
                    $updated['logo_url'] = $saved ?: $logoUrl;
                } catch (\Exception $fileError) {
                    \Log::error('[SettingController] Logo upload failed', [
                        'error' => $fileError->getMessage(),
                        'file' => $fileError->getFile(),
                        'line' => $fileError->getLine()
                    ]);
                    throw $fileError;
                }
            }
            // Handle logo_url as base64 or direct string (fallback)
            elseif ($request->has('logo_url') && $request->input('logo_url')) {
                $value = $request->input('logo_url');
                // If it looks like a data URL, store it directly (small strings only)
                if (strlen($value) < 10000) { // Limit to 10KB for direct storage
                    \Log::info('[SettingController] Saving logo_url setting', ['value_length' => strlen($value)]);
                    $result = Setting::put('logo_url', $value);
                    
                    // Verify it was saved
                    $saved = Setting::get('logo_url');
                    \Log::info('[SettingController] Verified save', ['original_length' => strlen($value), 'saved_length' => strlen($saved ?: '')]);
                    $updated['logo_url'] = $saved ?: $value;
                } else {
                    \Log::warning('[SettingController] Logo URL too large for direct storage', ['size' => strlen($value)]);
                    // Return success but don't update if no file was provided for large strings
                }
            }

            \Log::info('[SettingController] Settings updated successfully', ['updated_keys' => array_keys($updated), 'updated_data' => $updated]);

            return response()->json([
                'status' => 'success',
                'message' => 'Settings updated successfully',
                'data' => $updated
            ], 200);
        } catch (\Exception $e) {
            \Log::error('[SettingController] Update failed', [
                'error' => $e->getMessage(), 
                'file' => $e->getFile(), 
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
