<?php

namespace App\Http\Middleware;

use Closure;


use Illuminate\Http\Request;

class TestMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        \Log::info('TEST MIDDLEWARE HANDLE CALLED', [
            'path' => $request->path(),
            'has_auth' => $request->header('Authorization') ? 'yes' : 'no'
        ]);
        
        return $next($request);
    }
}
