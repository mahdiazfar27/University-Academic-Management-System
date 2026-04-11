SELECT 
    s.id,
    s.user_id,
    s.student_id,
    s.department_id,
    s.cgpa,
    (SELECT COUNT(*) FROM enrollments WHERE student_id = s.student_id) as enrollment_count,
    (SELECT COUNT(*) FROM results WHERE student_id = s.student_id) as result_count
FROM students s
WHERE s.id = 1;
