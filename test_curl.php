<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
$token = $user->createToken('test')->accessToken;

$ch = curl_init('http://127.0.0.1:8000/api/profile');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    '_method' => 'PUT',
    'name' => 'SD Harapan Bangsa',
    'phone' => '12345678',
    'email' => 'sdharapan@test.com',
    'npsn' => '888888',
    'address' => 'Jl. Test'
]);

$response = curl_exec($ch);
echo "RESPONSE: " . $response . "\n";
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo "HTTP CODE: " . $httpCode . "\n";
curl_close($ch);
