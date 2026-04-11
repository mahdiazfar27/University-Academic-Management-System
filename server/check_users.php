<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "=== CHECKING ACTUAL DATABASE USERS ===\n\n";

echo "ADMIN USERS:\n";
$admins = User::where('role', 'admin')->pluck('email');
foreach($admins as $email) echo '  ' . $email . "\n";

echo "\nFIRST 5 TEACHER EMAILS:\n";
$teachers = User::where('role', 'teacher')->limit(5)->pluck('email');
foreach($teachers as $email) echo '  ' . $email . "\n";

echo "\nFIRST 5 STUDENT EMAILS:\n";
$students = User::where('role', 'student')->limit(5)->pluck('email');
foreach($students as $email) echo '  ' . $email . "\n";

echo "\n=== PASSWORD VERIFICATION ===\n";
$testAdmin = User::where('email', 'robert.admin1@iums.edu')->first();
if ($testAdmin) {
    echo "Found admin: " . $testAdmin->email . "\n";
    echo "Password hash: " . substr($testAdmin->password, 0, 30) . "...\n";
    echo "Testing password 'admin@123': ";
    if (hash_equals($testAdmin->password, password_hash('admin@123', PASSWORD_BCRYPT))) {
        echo "NOT matching (expected)\n";
    } else {
        echo "Need to verify with auth\n";
    }
} else {
    echo "Admin robert.admin1@iums.edu NOT FOUND\n";
}

echo "\n=== TOTALS ===\n";
echo 'Total Users: ' . User::count() . "\n";
echo 'Admins: ' . User::where('role', 'admin')->count() . "\n";
echo 'Teachers: ' . User::where('role', 'teacher')->count() . "\n";
echo 'Students: ' . User::where('role', 'student')->count() . "\n";
