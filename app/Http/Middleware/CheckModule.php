<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModule
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $profile = \App\Models\SchoolProfile::with('service.modules')->first();
        
        $activeModules = [];
        if ($profile && $profile->service) {
            $activeModules = $profile->service->modules->pluck('code')->toArray();
        }
        
        if (!in_array($module, $activeModules)) {
            return response()->json(['message' => 'Module '.$module.' is not active for this school.'], 403);
        }

        return $next($request);
    }
}
