# Attendance System - Exact SQL Queries & Data Types

## 📊 Database Schema Reference

### attendance table structure
```sql
CREATE TABLE `attendance` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `course_offering_id` bigint unsigned NOT NULL,
  `student_id` varchar(255) NOT NULL,           ← VARCHAR! Not integer!
  `attendance_date` date NOT NULL,
  `is_present` boolean DEFAULT false,
  `timestamps` ...
  UNIQUE KEY unique_attendance (course_offering_id, student_id, attendance_date),
  FOREIGN KEY (course_offering_id) REFERENCES course_offerings(id)
);
```

### Key Point: `student_id` is VARCHAR, not INTEGER
- Stores values like: "1", "2", "3" (strings)
- Matches against: students.id (integer) but cast as string for query
- Cannot store null values (NOT NULL constraint)

---

## 🔄 SUBMIT ATTENDANCE FLOW - Exact SQL

### Input Data (from Frontend)
```json
{
  "course_offering_id": 1,
  "date": "2026-04-08",
  "attendance": [
    {"student_id": 1, "is_present": true},
    {"student_id": 2, "is_present": false},
    {"student_id": 3, "is_present": false}
  ]
}
```

### PHP Processing (per student)
```php
$studentId = (string)$attendanceData['student_id'];  // "1"
$isPresent = $attendanceData['is_present'];           // true/false
```

### Query 1: Check if record exists
```sql
SELECT * FROM `attendance`
WHERE `course_offering_id` = 1
  AND `student_id` = '1'           ← String comparison
  AND DATE(`attendance_date`) = '2026-04-08'
LIMIT 1;
```
- Bindings: [1, "1", "2026-04-08"]
- Result: null (first time) or Attendance model instance (if exists)

### Query 2a: If record exists → UPDATE
```sql
UPDATE `attendance` 
SET `is_present` = 1, `updated_at` = '2026-04-08 12:00:00'
WHERE `id` = 1;
```

### Query 2b: If record NOT exists → INSERT
```sql
INSERT INTO `attendance` (
  `course_offering_id`, 
  `student_id`, 
  `attendance_date`, 
  `is_present`, 
  `created_at`, 
  `updated_at`
) VALUES (
  1,                      ← integer
  '1',                    ← string (VARCHAR)
  '2026-04-08',           ← date
  1,                      ← boolean (stored as 1/0)
  '2026-04-08 12:00:00',  ← datetime
  '2026-04-08 12:00:00'   ← datetime
);
```

### Result in Database
```
attendance table after submission:
┌────┬──────────────────┬────────────┬─────────────────┬──────────┐
│ id │ course_offering_ │ student_id │ attendance_date │ is_present
├────┼──────────────────┼────────────┼─────────────────┼──────────┤
│ 1  │ 1                │ "1"        │ 2026-04-08      │ 1        │
│ 2  │ 1                │ "2"        │ 2026-04-08      │ 0        │
│ 3  │ 1                │ "3"        │ 2026-04-08      │ 0        │
└────┴──────────────────┴────────────┴─────────────────┴──────────┘
```

---

## 🔍 GET ATTENDANCE FLOW - Exact SQL

### Query 1: Get all enrollments for course
```sql
SELECT 
  e.id as enrollment_id,
  s.id as student_db_id,
  s.student_id as registration_number,
  u.first_name,
  u.last_name
FROM `enrollments` e
JOIN `students` s ON e.student_id = s.id
JOIN `users` u ON s.user_id = u.id
WHERE e.course_offering_id = 1;
```

Result:
```
enrollment_id: 1, student_db_id: 1, registration_number: "CSE-001", 
enrollment_id: 2, student_db_id: 2, registration_number: "CSE-002",
enrollment_id: 3, student_db_id: 3, registration_number: "CSE-003",
```

### Query 2: For each student, get attendance (per student)
```sql
SELECT * FROM `attendance`
WHERE `course_offering_id` = 1
  AND `student_id` = '1'           ← Cast student_db_id (1) to string "1"
  AND DATE(`attendance_date`) = '2026-04-08'
LIMIT 1;
```

- Bindings: [1, "1", "2026-04-08"]
- Result: Attendance object with is_present = 1

### PHP Response Mapping
```php
// For each enrollment, build response array:
return [
    'id' => 'CSE-001',                          // student.student_id (registration)
    'name' => 'John Smith',                     // user name
    'student_id' => 1,                          // student.id (database ID) ← CRITICAL
    'is_present' => true,                       // attendance.is_present
    'attendance_id' => 1                        // attendance.id
];
```

### Final API Response
```json
{
  "status": "success",
  "data": {
    "course_offering_id": 1,
    "date": "2026-04-08",
    "students": [
      {
        "id": "CSE-001",
        "name": "John Smith",
        "student_id": 1,          ← Must be integer!
        "is_present": true,       ← Data persisted!
        "attendance_id": 1
      },
      {
        "id": "CSE-002",
        "name": "Jane Doe",
        "student_id": 2,
        "is_present": false,
        "attendance_id": 2
      },
      {
        "id": "CSE-003",
        "name": "Bob Johnson",
        "student_id": 3,
        "is_present": false,
        "attendance_id": 3
      }
    ],
    "total_students": 3,
    "present_count": 1
  }
}
```

---

## ⚠️ TYPE MISMATCHES THAT CAUSE FAILURE

### ❌ Scenario 1: Frontend sends null
```
Frontend sends: {"student_id": null}
Backend receives: null
Validation: fails (exists:students,id)
Database: Not inserted
Reload: Shows absent (default)
```

### ❌ Scenario 2: Frontend sends NaN
```
Frontend sends: {"student_id": NaN}  (NaN becomes null in JSON)
Backend receives: null
Same result as Scenario 1
```

### ❌ Scenario 3: Frontend sends string "1" instead of integer
```
Frontend sends: {"student_id": "1"}
Backend receives: "1"
PHP casts: (string)"1" = "1" (still string)
Database: Stores "1" (correct, it's VARCHAR)
BUT parseInt("1") was skipped, so if validation needs integer...
Might work or fail depending on validation rules
```

### ✅ Scenario 4: Frontend sends integer 1
```
Frontend sends: {"student_id": 1}
Backend receives: integer (PHP JSON decoder)
PHP casts: (string)1 = "1"
Database: Stores "1" (correct)
Reload: Query WHERE student_id = "1" finds record ✓
```

---

## 🔧 DATA TYPE VERIFICATION

### Before Submission (Frontend Console Check)
```javascript
console.log(typeof attendanceData.attendance[0].student_id);
// Expected: "number"
// Bad: "string", "undefined", undefined

console.log(JSON.stringify(attendanceData).includes("null"));
// Expected: false
// Bad: true (means NaN or undefined somewhere)
```

### After Submission (Server Log Check)
```php
// In storage/logs/laravel.log should show:
"after_string_cast": "1"
"string_cast_type": "string"

// NOT:
"after_string_cast": null
"string_cast_type": "NULL"
```

### After Reload (Database Check)
```sql
SELECT * FROM attendance WHERE course_offering_id = 1;
-- Should return 3 rows with is_present = 0 or 1
-- NOT: 0 rows

SELECT student_id, is_present FROM attendance 
WHERE course_offering_id = 1 AND student_id = '1';
-- Should return: student_id='1', is_present=1
```

---

## 📈 Complete Data Type Flow

```
FRONTEND (JavaScript)          TRANSMISSION (JSON)           BACKEND (PHP)            DATABASE (MySQL)
===============================================================================================
Number: 1                  →   JSON number: 1            →   Integer: 1          →   VARCHAR: "1"
String: "1"                →   JSON string: "1"          →   String: "1"         →   VARCHAR: "1"
Boolean: true              →   JSON boolean: true        →   Boolean: true/1     →   BOOLEAN/INT: 1
undefined                  →   (ERROR - JSON.stringify   →   N/A                 →   N/A
                               converts to null)                
NaN                        →   JSON null: null           →   NULL/null           →   Rejected (NOT NULL)
null                       →   JSON null: null           →   NULL/null           →   Rejected (NOT NULL)
```

---

## ✅ VALIDATION RULES APPLIED

### Frontend Validation (Client-side)
- ✓ `typeof student_id === 'number'`
- ✓ `!isNaN(student_id)`
- ✓ `student_id !== undefined && student_id !== null`
- ✓ `course_offering_id > 0`
- ✓ `date matches YYYY-MM-DD format`

### Backend Validation (Server-side)
- ✓ `required` - value must exist
- ✓ `exists:students,id` - value must exist in students table
- ✓ `required|boolean` - true/false only

### Database Constraints
- ✓ `NOT NULL` - cannot be null or empty
- ✓ `UNIQUE (course_offering_id, student_id, attendance_date)` - one record per student per day
- ✓ `FOREIGN KEY (course_offering_id)` - must reference valid course

---

## 🧪 TEST SQL QUERY

Run this to verify the complete flow:

```sql
-- 1. Check schema
DESCRIBE attendance;

-- 2. Check student_id column type
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'attendance' AND COLUMN_NAME = 'student_id';

-- 3. Check records for today
SELECT * FROM attendance 
WHERE DATE(attendance_date) = CURDATE()
LIMIT 5;

-- 4. Check for course 1 today
SELECT COUNT(*) as record_count FROM attendance 
WHERE course_offering_id = 1 
AND DATE(attendance_date) = CURDATE();

-- 5. Check for specific student
SELECT * FROM attendance 
WHERE student_id = '1' 
AND DATE(attendance_date) = CURDATE();

-- 6. Verify joins work
SELECT a.*, s.student_id as reg_number, u.first_name, u.last_name
FROM attendance a
JOIN enrollments e ON a.student_id = CAST(SUBSTRING(s.id, LOCATE('-', s.id) + 1) AS UNSIGNED)
JOIN students s ON e.student_id = s.id
JOIN users u ON s.user_id = u.id
LIMIT 5;
```
