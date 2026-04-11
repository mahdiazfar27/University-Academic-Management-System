<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://localhost',
        ];

        $origin = $request->header('Origin');

        // Handle preflight requests - must respond BEFORE routing
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 204);
            $response->header('Access-Control-Allow-Origin', in_array($origin, $allowedOrigins) ? $origin : '*');
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
            $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
            $response->header('Access-Control-Allow-Credentials', 'true');
            $response->header('Access-Control-Max-Age', '3600');
            return $response;
        }

        // For actual requests, process and add CORS headers
        $response = $next($request);

        // Add CORS headers to response
        if (in_array($origin, $allowedOrigins) || !$origin) {
            $response->header('Access-Control-Allow-Origin', $origin ?? '*');
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
            $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
            $response->header('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }
}
