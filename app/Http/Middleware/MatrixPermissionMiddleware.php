<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class MatrixPermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('api')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($user->hasRole('Super Admin')) {
            return $next($request);
        }

        // Determine required permission based on route name or path
        $path = $request->path();
        $method = $request->method();

        // Basic mapping for RESTful routes
        $action = 'read';
        if ($method === 'POST') $action = 'create';
        if ($method === 'PUT' || $method === 'PATCH') $action = 'update';
        if ($method === 'DELETE') $action = 'delete';

        // Custom actions like approve or verify
        if (str_contains($path, 'approve') || str_contains($path, 'verify')) {
            $action = 'approve';
        }

        // Module detection (simplistic for this example)
        $module = '';
        if (str_contains($path, 'news')) $module = '/admin/news';
        if (str_contains($path, 'ppdb')) $module = '/admin/ppdb';
        if (str_contains($path, 'profile')) $module = '/admin/profile';
        if (str_contains($path, 'rbac')) $module = '/admin/rbac';

        if ($module) {
            $permissionName = $module . '.' . $action;
            if (!$user->hasPermissionTo($permissionName)) {
                return response()->json(['message' => 'Forbidden. Requires: ' . $permissionName], 403);
            }
        }

        return $next($request);
    }
}
