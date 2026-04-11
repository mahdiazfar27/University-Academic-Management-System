#!/usr/bin/env php
<?php
// Direct PHP test of the attendance endpoints
require 'bootstrap/app.php';

use App\Models\CourseOffering, App\Models\Enrollment;

$app = require_once __DIR__. '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Http\Kernel')->handle(
    $request = Illuminate\Http\Request::capture()
);

// Get first course offering with enrollments
$course = CourseOffering::with('enrollments.student.user')->first();
if (!$course) {
    echo "NO COURSES FOUND\n";
    exit(1);
}

$enrollments = $course->enrollments();
echo "Course ID: {$course->id}\n";
echo "Total enrollments: " . $enrollments->count() . "\n\n";

// Simulate what getAttendance returns
$today = now()->format('Y-m-d');
$students = $enrollments->with('student.user')
    ->get()
    ->map(function($enrollment) use ($course, $today) {
        return [
            'id' => $enrollment->student->student_id ?? 'N/A',  // registration number
            'name' => ($enrollment->student->user->first_name ?? '') . ' ' . ($enrollment->student->user->last_name ?? ''),
            'student_registration_number' => $enrollment->student->student_id ?? 'N/A',
            'student_id' => $enrollment->student->id,  // DATABASE ID
            'enrollment_id' => $enrollment->id,
            'is_present' => false,
            'attendance_id' => null,
        ];
    })
    ->values();

echo "First 3 students that would be returned to frontend:\n";
$students->take(3)->each(function($s) {
    echo json_encode($s, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
});

echo "\nFrontend would map these to:\n";
$mapped = $students->take(3)->map(function($student) {
    return [
        'id' => intval($student['student_id']),  // Parse as int
        'name' => $student['name'],
        'registrationNumber' => $student['id'],
        'status' => $student['is_present'] === true ? 'P' : 'A'
    ];
});
$mapped->each(function($s) {
    echo json_encode($s, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
});

echo "\nWhen submitting, frontend would send:\n";
$toSend = $mapped->map(function($s) {
    return [
        'student_id' => $s['id'],
        'is_present' => $s['status'] === 'P'
    ];
});
$payload = [
    'course_offering_id' => $course->id,
    'date' => $today,
    'attendance' => $toSend->values()->all()
];
echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
