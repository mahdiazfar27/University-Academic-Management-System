#!/usr/bin/env php
<?php
// Quick test to show exact API response structure
// Usage: php test_api_response.php <course_offering_id> <teacher_id>

if ($argc < 2) {
    echo "Usage: php test_api_response.php <course_offering_id> [teacher_id]\n";
    echo "Example: php test_api_response.php 1\n";
    exit(1);
}

require 'bootstrap/app.php';

use Illuminate\Http\Request;
use App\Http\Controllers\TeacherController;

$courseId = $argv[1] ?? 1;
$date = date('Y-m-d');

// Create a mock request
$request = Request::create(
    "/api/v1/teacher/attendance?course_offering_id=$courseId&date=$date",
    'GET'
);

// Call the controller method directly
$controller = new TeacherController();
$response = $controller->getAttendance($request);
$data = json_decode($response->getContent(), true);

echo "=== API RESPONSE STRUCTURE ===\n";
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";

if (isset($data['data']['students']) && count($data['data']['students']) > 0) {
    echo "=== FIRST STUDENT DETAIL ===\n";
    $firstStudent = $data['data']['students'][0];
    foreach ($firstStudent as $key => $value) {
        echo "  $key: " . json_encode($value) . " (type: " . gettype($value) . ")\n";
    }
}
