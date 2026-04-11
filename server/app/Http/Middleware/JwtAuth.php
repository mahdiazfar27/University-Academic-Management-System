<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            \Log::info('[JWT Auth] Middleware STARTED');

            // Get authorization header directly from request
            $authHeader = $request->header('Authorization');
            
            \Log::info('[JWT Auth] Got auth header', ['present' => $authHeader ? 'yes' : 'no']);
            
            // Extract token from "Bearer <token>" format
            $token = null;
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $token = substr($authHeader, 7);
                \Log::info('[JWT Auth] Token extracted', ['length' => strlen($token)]);
            }

            if (!$token) {
                \Log::warning('[JWT Auth] No Bearer token found');
                return response()->json([
                    'success' => false,
                    'message' => 'Missing authorization token'
                ], 401);
            }

            // Instantiate JWT service
            $jwtService = app('App\Services\JwtService');
            \Log::info('[JWT Auth] JwtService resolved');

            try {
                \Log::info('[JWT Auth] Attempting token validation');
                $payload = $jwtService->validateToken($token);
                
                \Log::info('[JWT Auth] Token VALID', [
                    'userId' => $payload['userId'] ?? 'unknown',
                ]);
                
                // Attach user data to request
                $request->merge(['auth_user' => $payload]);
                
                \Log::info('[JWT Auth] Auth payload merged, passing to next');
                return $next($request);
            } catch (\Exception $valError) {
                \Log::error('[JWT Auth] Token validation exception', [
                    'error' => $valError->getMessage(),
                    'file' => $valError->getFile(),
                    'line' => $valError->getLine(),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid token',
                    'error' => $valError->getMessage()
                ], 401);
            }
        } catch (\Throwable $e) {
            \Log::error('[JWT Auth] CAUGHT EXCEPTION', [
                'message' => $e->getMessage(),
                ' file' => $e->getFile(),
                'line' => $e->getLine(),
                'class' => get_class($e),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Middleware error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
