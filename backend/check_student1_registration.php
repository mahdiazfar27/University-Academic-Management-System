<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$student = \App\Models\Student::find(1);
if ($student) {
    echo "Student 1 Found\n";
    echo "ID: " . $student->id . "\n";
    echo "User ID: " . $student->user_id . "\n";
    echo "Registration Number (student_id): " . ($student->student_id ?? "NULL") . "\n";
    echo "Department ID: " . $student->department_id . "\n";
    
    // Also check how many enrollments this student has using different filters
    $enrollmentsByNumericId = \App\Models\Enrollment::where('student_id', 1)->count();
    $enrollmentsByRegistration = \App\Models\Enrollment::where('student_id', $student->student_id)->count();
    
    echo "\nEnrollments by numeric ID (1): " . $enrollmentsByNumericId . "\n";
    echo "Enrollments by registration ($student->student_id): " . $enrollmentsByRegistration . "\n";
} else {
    echo "Student 1 not found\n";
}
?>
