<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Check student 1's details
$student = \App\Models\Student::find(1);
echo "Student ID 1 Details:\n";
echo "  Database ID: " . $student->id . "\n";
echo "  Student Code/Registration: " . $student->student_code . "\n";
echo "  User: " . ($student->user ? $student->user->name . " (" . $student->user->email . ")" : "Not found") . "\n";

// Get first student with real data
$studentWithData = \App\Models\Student::where('student_code', '20230500637')->first();
if ($studentWithData) {
  echo "\nFirst Student With Data (20230500637):\n";
  echo "  Database ID: " . $studentWithData->id . "\n";
  echo "  Student Code: " . $studentWithData->student_code . "\n"; 
  echo "  User: " . ($studentWithData->user ? $studentWithData->user->name . " (" . $studentWithData->user->email . ")" : "Not found") . "\n";
}
