<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "=== CHECKING TEACHER STATUS ===\n\n";

$teachers = User::where('role', 'teacher')->limit(10)->get(['email', 'status']);
echo "First 10 Teachers:\n";
foreach($teachers as $t) {
    echo "  {$t->email}: {$t->status}\n";
}

echo "\nActive Teachers: " . User::where('role', 'teacher')->where('status', 'active')->count() . "\n";
echo "Inactive Teachers: " . User::where('role', 'teacher')->where('status', '!= ', 'active')->count() . "\n";

echo "\n=== GETTING ACTIVE TEACHER FOR LOGIN TEST ===\n";
$activeTeacher = User::where('role', 'teacher')->where('status', 'active')->first(['email']);
if ($activeTeacher) {
    echo "Try this teacher: " . $activeTeacher->email . "\n";
} else {
    echo "No active teachers found!\n";
}
