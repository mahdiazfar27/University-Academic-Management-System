<?php
// Database connection
$mysqli = new mysqli(
    getenv('DB_HOST') ?: 'localhost',
    getenv('DB_USER') ?: 'root',
    getenv('DB_PASSWORD') ?: '',
    getenv('DB_DATABASE') ?: 'university_academic'
);

if ($mysqli->connect_error) {
    echo "Connection failed: " . $mysqli->connect_error . "\n";
    exit(1);
}

echo "Connected to database successfully\n";

// First, let me check if student 1 has a student_id
$result = $mysqli->query("SELECT id, user_id, student_id FROM students WHERE id = 1");
$student = $result->fetch_assoc();

echo "Student 1 Data:\n";
echo "ID: " . $student['id'] . "\n";
echo "User ID: " . $student['user_id'] . "\n";
echo "Registration Number (student_id): " . ($student['student_id'] ?? 'NULL') . "\n";

// If student doesn't have a registration number, let's assign one
if (empty($student['student_id'])) {
    echo "\nAssigning registration number to student 1...\n";
    $new_registration = "20230100001";
    $mysqli->query("UPDATE students SET student_id = '$new_registration' WHERE id = 1");
    $student['student_id'] = $new_registration;
    echo "Assigned: $new_registration\n";
}

// Now let's create some test enrollments for this student
echo "\n Creating test enrollments for student 1...\n";

// Get some course offerings
$coursesResult = $mysqli->query("SELECT id FROM course_offerings LIMIT 3");
$enrollmentData = [];
while ($course = $coursesResult->fetch_assoc()) {
    // Check if enrollment already exists
    $existsResult = $mysqli->query("SELECT id FROM enrollments WHERE student_id = '{$student['student_id']}' AND course_offering_id = {$course['id']}");
    if ($existsResult->num_rows == 0) {
        // Insert enrollment
        $status = 'enrolled';
        $enrollmentDate = date('Y-m-d H:i:s');
        $mysqli->query("INSERT INTO enrollments (student_id, course_offering_id, enrollment_status, enrollment_date, created_at, updated_at) 
            VALUES ('{$student['student_id']}', {$course['id']}, '$status', '$enrollmentDate', '$enrollmentDate', '$enrollmentDate')");
        echo "  - Created enrollment for course offering {$course['id']}\n";
        $enrollmentData[] = $course['id'];
    }
}

// Verify enrollments were created
$enrollmentCount = $mysqli->query("SELECT COUNT(*) as count FROM enrollments WHERE student_id = '{$student['student_id']}'")->fetch_assoc();
echo "\nTotal enrollments for student 1: " . $enrollmentCount['count'] . "\n";

// Also create some results/grades for this student
echo "\nCreating test results for student 1...\n";
$resultsCreated = 0;
foreach ($enrollmentData as $courseId) {
    // Get the enrollment record
    $enrollmentResult = $mysqli->query("SELECT id FROM enrollments WHERE student_id = '{$student['student_id']}' AND course_offering_id = $courseId LIMIT 1");
    if ($enrollmentResult->num_rows > 0) {
        $enrollment = $enrollmentResult->fetch_assoc();
        
        // Check if result already exists
        $existsResult = $mysqli->query("SELECT id FROM results WHERE enrollment_id = {$enrollment['id']}");
        if ($existsResult->num_rows == 0) {
            $grade = ['A', 'B+', 'B', 'A-'][rand(0, 3)];
            $marks = rand(70, 95);
            $createdAt = date('Y-m-d H:i:s');
            $mysqli->query("INSERT INTO results (enrollment_id, marks, grade, created_at, updated_at, student_id) 
                VALUES ({$enrollment['id']}, $marks, '$grade', '$createdAt', '$createdAt', '{$student['student_id']}')");
            $resultsCreated++;
            echo "  - Created result for enrollment {$enrollment['id']}: Grade $grade, Marks $marks\n";
        }
    }
}

echo "\nTotal results created: $resultsCreated\n";
echo "\nTest data setup complete!\n";

$mysqli->close();
?>
