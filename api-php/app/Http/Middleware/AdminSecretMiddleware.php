<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminSecretMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $adminSecret = env('ADMIN_SECRET', 'rempoah-admin-2026');
        
        $authHeader = $request->header('Authorization');
        
        if (!$authHeader || $authHeader !== "Bearer {$adminSecret}") {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        return $next($request);
    }
}
