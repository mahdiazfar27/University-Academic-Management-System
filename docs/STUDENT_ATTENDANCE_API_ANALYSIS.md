# Student Attendance API Analysis Report

## 1. AVAILABLE ENDPOINTS FOR STUDENT ATTENDANCE

### ✅ Currently Implemented Endpoints

#### 1. Get Student's Attendance in a Specific Course
**Endpoint:** `GET /v1/attendance/student/{studentId}/course/{courseOfferingId}`
- **Controller:** `AttendanceController::studentCourseAttendance()`
- **Auth:** Required (JWT)
- **Access:** Student can view own attendance, teachers can view their course attendance
- **Parameters:**
  - `studentId` (path) - Student ID
  - `courseOfferingId` (path) - Course offering ID

#### 2. Get Student's Attendance for an Enrollment
**Endpoint:** `GET /v1/attendance/enrollment/{enrollmentId}`
- **Controller:** `AttendanceController::enrollmentAttendance()`
- **Auth:** Required (JWT)
- **Access:** Student can view own enrollment attendance
- **Parameters:**
  - `enrollmentId` (path) - Enrollment ID

---

## 2. RESPONSE STRUCTURE FOR STUDENT ATTENDANCE

### Response Format for `GET /v1/attendance/student/{studentId}/course/{courseOfferingId}`

```javascript
{
  "success": true,
  "data": {
    "course": {
      "id": 1,
      "name": "Data Structures",
      "code": "CS201"
    },
    "attendance_summary": {
      "total_classes": 24,
      "classes_present": 22,
      "classes_absent": 2,
      "attendance_percentage": 91.67
    },
    "attendance_records": [
      {
        "date": "2026-04-01",
        "is_present": true
      },
      {
        "date": "2026-04-02",
        "is_present": false
      }
      // ... more records
    ]
  }
}
```

### Response Format for `GET /v1/attendance/enrollment/{enrollmentId}`

```javascript
{
  "success": true,
  "data": {
    "course": "Data Structures",
    "total_classes": 24,
    "classes_present": 22,
    "classes_absent": 2,
    "attendance_percentage": 91.67,
    "records": [
      {
        "date": "2026-04-01",
        "is_present": true
      },
      // ... more records
    ]
  }
}
```

---

## 3. MISSING ENDPOINTS - NOT CURRENTLY AVAILABLE

❌ **No Student Dashboard Attendance Summary Endpoint**
- Missing: Overall attendance percentage across all courses
- Missing: Attendance summary per course for quick dashboard view
- Missing: Attendance warnings/alerts

❌ **No Teacher View - All Students Attendance Endpoint**
- Missing: Aggregated view of all students' attendance across course
- Missing: Attendance statistics per student

---

## 4. DATABASE SCHEMA & ATTENDANCE TABLE

### Attendance Table Structure
```sql
CREATE TABLE `attendance` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `course_offering_id` BIGINT NOT NULL,
  `student_id` VARCHAR(255) NOT NULL,
  `attendance_date` DATE NOT NULL,
  `is_present` BOOLEAN DEFAULT false,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP,
  
  UNIQUE KEY `unique_attendance` (course_offering_id, student_id, attendance_date),
  FOREIGN KEY (course_offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE
);
```

### Key Relationships
- Student Model: `hasMany(Attendance::class, 'student_id', 'student_id')`
- Attendance Model: 
  - `belongsTo(Student::class, 'student_id', 'student_id')`
  - `belongsTo(CourseOffering::class)`

---

## 5. SQL QUERIES FOR MISSING CALCULATIONS

### A. Calculate Overall Attendance Percentage Across All Courses for a Student

```sql
SELECT 
    s.id as student_id,
    s.student_id as student_code,
    u.first_name,
    u.last_name,
    COUNT(a.id) as total_classes_attended,
    SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) as classes_present,
    SUM(CASE WHEN a.is_present = false THEN 1 ELSE 0 END) as classes_absent,
    ROUND(
        (SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) / COUNT(a.id)) * 100,
        2
    ) as overall_attendance_percentage
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN attendance a ON s.student_id = a.student_id
WHERE s.id = ? -- Replace with student ID
GROUP BY s.id, s.student_id, u.first_name, u.last_name;
```

### B. Calculate Attendance Percentage Per Course for a Student

```sql
SELECT 
    s.id as student_id,
    s.student_id as student_code,
    c.id as course_id,
    c.code as course_code,
    c.title as course_name,
    co.id as course_offering_id,
    t.id as teacher_id,
    CONCAT(tu.first_name, ' ', tu.last_name) as teacher_name,
    COUNT(a.id) as total_classes,
    SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) as classes_present,
    SUM(CASE WHEN a.is_present = false THEN 1 ELSE 0 END) as classes_absent,
    ROUND(
        (SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) / COUNT(a.id)) * 100,
        2
    ) as attendance_percentage
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN course_offerings co ON e.course_offering_id = co.id
JOIN courses c ON co.course_id = c.id
JOIN teachers t ON co.teacher_id = t.id
JOIN users tu ON t.user_id = tu.id
LEFT JOIN attendance a ON s.student_id = a.student_id AND a.course_offering_id = co.id
WHERE s.id = ? -- Replace with student ID
    AND e.status IN ('active', 'completed')
GROUP BY s.id, c.id, co.id, t.id
ORDER BY c.title;
```

### C. Calculate Overall Attendance for All Students in a Course

```sql
SELECT 
    s.id as student_id,
    s.student_id as student_code,
    CONCAT(u.first_name, ' ', u.last_name) as student_name,
    COUNT(a.id) as total_classes,
    SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) as classes_present,
    SUM(CASE WHEN a.is_present = false THEN 1 ELSE 0 END) as classes_absent,
    ROUND(
        (SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) / COUNT(a.id)) * 100,
        2
    ) as attendance_percentage
FROM students s
JOIN users u ON s.user_id = u.id
JOIN enrollments e ON s.id = e.student_id
JOIN attendance a ON s.student_id = a.student_id AND a.course_offering_id = e.course_offering_id
WHERE e.course_offering_id = ? -- Replace with course offering ID
GROUP BY s.id, s.student_id, u.first_name, u.last_name
ORDER BY attendance_percentage DESC;
```

### D. Calculate Attendance Summary for Dashboard (Multiple Courses)

```sql
SELECT 
    s.id as student_id,
    s.student_id as student_code,
    CONCAT(u.first_name, ' ', u.last_name) as student_name,
    COUNT(DISTINCT co.id) as enrolled_courses,
    COUNT(a.id) as total_classes_recorded,
    SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) as total_classes_present,
    SUM(CASE WHEN a.is_present = false THEN 1 ELSE 0 END) as total_classes_absent,
    ROUND(
        (SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) / COUNT(a.id)) * 100,
        2
    ) as overall_attendance_percentage,
    -- Flag students with low attendance (below 75%)
    CASE 
        WHEN (SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) / COUNT(a.id)) * 100 < 75 THEN 'LOW'
        WHEN (SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) / COUNT(a.id)) * 100 < 85 THEN 'MEDIUM'
        ELSE 'GOOD'
    END as attendance_status
FROM students s
JOIN users u ON s.user_id = u.id
JOIN enrollments e ON s.id = e.student_id
JOIN course_offerings co ON e.course_offering_id = co.id
LEFT JOIN attendance a ON s.student_id = a.student_id AND a.course_offering_id = co.id
WHERE s.enrollment_status = 'active'
GROUP BY s.id, s.student_id, u.first_name, u.last_name
HAVING COUNT(a.id) > 0;
```

---

## 6. RECOMMENDATIONS FOR IMPLEMENTATION

### Suggested New Endpoints to Add

1. **Get Student Overall Attendance Dashboard**
   - `GET /v1/students/{studentId}/attendance/summary`
   - Returns: Overall percentage + breakdown by course
   - Use Query B above

2. **Get Student Attendance by Semester**
   - `GET /v1/students/{studentId}/attendance/semester/{semesterId}`
   - Returns: Attendance data filtered by semester
   - Better performance than loading all courses

3. **Get Course Attendance Statistics (for Teachers)**
   - `GET /v1/teacher/{teacherId}/courses/{courseOfferingId}/attendance/statistics`
   - Returns: All students' attendance with statistics
   - Use Query C above

4. **Get Student Attendance Warnings**
   - `GET /v1/students/{studentId}/attendance/warnings`
   - Returns: List of courses where attendance is below 75%
   - Quick alert system for students

---

## 7. CURRENT IMPLEMENTATION SUMMARY

| Aspect | Status | Notes |
|--------|--------|-------|
| **Student can view own course attendance** | ✅ Implemented | Endpoint: `/v1/attendance/student/{id}/course/{offeringId}` |
| **Student can view enrollment attendance** | ✅ Implemented | Endpoint: `/v1/attendance/enrollment/{id}` |
| **Teacher can record attendance** | ✅ Implemented | Endpoint: `POST /v1/attendance/record/{courseOfferingId}` |
| **Teacher can view course attendance sheet** | ✅ Implemented | Endpoint: `/v1/attendance/attendance-sheet/{courseOfferingId}` |
| **Overall student attendance percentage** | ❌ Missing | Requires new endpoint |
| **Student attendance per course summary** | ❌ Missing | Requires new endpoint |
| **Attendance warnings/alerts** | ❌ Missing | Requires new endpoint |
| **Attendance statistics dashboard** | ❌ Missing | Requires new endpoint |

