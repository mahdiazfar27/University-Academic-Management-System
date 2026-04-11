<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Http\Controllers\AuthController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "--- Testing Login Logic for arthur.henderson@iums.edu ---\n";

try {
    $user = User::where('email', 'arthur.henderson@iums.edu')->where('role', 'teacher')->first();
    if (!$user) {
        die("Error: User not found in DB\n");
    }
    echo "1. User Found: " . $user->email . "\n";
    
    $password = 'teacher@123';
    $pass_check = Hash::check($password, $user->password);
    echo "2. Password Check: " . ($pass_check ? 'PASS' : 'FAIL') . "\n";
    
    $jwtService = app(\App\Services\JwtService::class);
    echo "3. JwtService instantiated\n";
    
    $token = $jwtService->generateToken(
        $user->id,
        $user->email,
        $user->role,
        $user->first_name . ' ' . $user->last_name
    );
    echo "4. Token generated successfully\n";
    echo "Token length: " . strlen($token) . "\n";
    
    // Simulate AuthController
    $controller = app(AuthController::class);
    $request = new Request();
    $request->replace(['email' => 'arthur.henderson@iums.edu', 'password' => 'teacher@123', 'role' => 'teacher']);
    $response = $controller->login($request);
    echo "5. Controller Response (Content): " . $response->getContent() . "\n";

} catch (\Throwable $e) {
    echo "--- FATAL ERROR REVEALED ---\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File   : " . $e->getFile() . "\n";
    echo "Line   : " . $e->getLine() . "\n";
    echo "Stack  : " . $e->getTraceAsString() . "\n";
}
