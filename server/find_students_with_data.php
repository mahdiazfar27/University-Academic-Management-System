<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Find a student with enrollments
$enrollmentsWithData = \App\Models\Enrollment::groupBy('student_id')
  ->selectRaw('student_id, COUNT(*) as count')
  ->orderByDesc('count')
  ->limit(5)
  ->get();

echo "Students with most enrollments:\n";
foreach ($enrollmentsWithData as $e) {
  $enrollmentCount = \App\Models\Enrollment::where('student_id', $e->student_id)->count();
  $resultsCount = \App\Models\Result::where('student_id', $e->student_id)->count();
  $attendanceCount = \App\Models\Attendance::where('student_id', (string)$e->student_id)->count();
  
  echo "Student ID {$e->student_id}: {$enrollmentCount} enrollments, {$resultsCount} results, {$attendanceCount} attendance records\n";
}
