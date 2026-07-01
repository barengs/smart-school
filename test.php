<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$kernel->bootstrap(); // this bootstraps the app fully!

$user = App\Models\User::first();
auth()->guard('api')->setUser($user);

$request = Illuminate\Http\Request::create('/api/profile', 'POST', [
    '_method' => 'PUT',
    'name' => 'Testing School',
    'phone' => '12345',
    'address' => 'Test Address',
    'email' => 'test@test.com',
    'npsn' => '123'
]);
$request->headers->set('Accept', 'application/json');
$request->setUserResolver(function () use ($user) {
    return $user;
});

$response = $kernel->handle($request);
echo $response->getContent();
