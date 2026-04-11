$course = App\Models\CourseOffering::with('enrollments.student.user')->first();
if (!$course) { echo "NO COURSES"; exit; }

$today = now()->format('Y-m-d');
$students = $course->enrollments()->with('student.user')->get()->map(function($enrollment) use ($course, $today) {
    return [
        'id' => $enrollment->student->student_id ?? 'N/A',
        'name' => ($enrollment->student->user->first_name ?? '') . ' ' . ($enrollment->student->user->last_name ?? ''),
        'student_id' => $enrollment->student->id,
        'is_present' => false,
    ];
})->values();

echo "=== BACKEND RESPONSE (First 2) ===\n";
$students->take(2)->each(fn($s) => echo json_encode($s). "\n");

echo "\n=== FRONTEND MAPPING ===\n";
$mapped = $students->take(2)->map(fn($student) => [
    'id' => intval($student['student_id']),
    'status' => $student['is_present'] === true ? 'P' : 'A'
]);
$mapped->each(fn($s) => echo json_encode($s) . "\n");

echo "\n=== SUBMISSION PAYLOAD ===\n";
$payload = [
    'course_offering_id' => $course->id,
    'date' => $today,
    'attendance' => $mapped->map(fn($s) => [
        'student_id' => $s['id'],
        'is_present' => $s['status'] === 'P'
    ])->values()->all()
];
echo json_encode($payload) . "\n";
