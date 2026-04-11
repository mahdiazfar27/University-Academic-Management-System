<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Check student 1 (asmith1@iums.edu)
$student = \App\Models\Student::find(1);
echo "Student: " . ($student ? $student->user->name : 'Not found') . "\n";

// Check enrollments for student 1
$enrollments = \App\Models\Enrollment::where('student_id', 1)->with('courseOffering.course')->get();
echo "Enrollments count: " . $enrollments->count() . "\n";
if ($enrollments->count() > 0) {
  foreach ($enrollments as $e) {
    echo "  - " . $e->courseOffering->course->name . "\n";
  }
}

// Check results/grades for student 1
$results = \App\Models\Result::where('student_id', 1)->get();
echo "Results count: " . $results->count() . "\n";

// Check attendance for student 1
$attendance = \App\Models\Attendance::where('student_id', '1')->get();
echo "Attendance records count: " . $attendance->count() . "\n";
