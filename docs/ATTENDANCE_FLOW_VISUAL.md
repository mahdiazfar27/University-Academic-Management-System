# ATTENDANCE DATA FLOW - VISUAL REFERENCE & SQL QUERIES

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    ATTENDANCE SUBMISSION FLOW                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─ FRONTEND (React) ──────────────────────────────────────────────────────────┐
│                            Attendance.jsx                                     │
│                                                                               │
│  1. User selects course from dropdown                                        │
│     selectedCourse = "1"  (string from <select> element)                    │
│                                                                               │
│  2. Call: getCourseAttendance(courseId, date)                              │
│     ├─ URL: GET /teacher/attendance?course_offering_id=1&date=2026-04-08   │
│     └─ RESPONSE:                                                            │
│        {                                                                     │
│          "students": [                                                      │
│            {                                                                │
│              "id": "CSE-001",              ← Registration number           │
│              "student_id": 1,              ← Database ID (INTEGER!)        │
│              "name": "John Smith",                                         │
│              "is_present": false                                           │
│            }                                                                │
│          ]                                                                  │
│        }                                                                     │
│                                                                               │
│  3. Map response to internal format:                                        │
│     ┌─ BEFORE MAPPING (from API) ──────────────────────────────────────┐  │
│     │ student.student_id = 1 (INTEGER)                                  │  │
│     │ student.id = "CSE-001" (STRING)                                   │  │
│     └─────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│     ┌─ PARSED (in component) ───────────────────────────────────────────┐  │
│     │ id: parseInt(student.student_id)  = parseInt(1) = 1 ✅            │  │
│     │ name: "John Smith"                                                 │  │
│     │ registrationNumber: student.id    = "CSE-001"                     │  │
│     │ status: "A"                       = Absent (default)              │  │
│     └─────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  4. User marks attendance (clicks Present button)                           │
│     status: "P"  (Present)                                                 │
│                                                                               │
│  5. User clicks "Submit Attendance"                                         │
│     ┌─ VALIDATION ───────────────────────────────────────────────────┐   │
│     │ ✓ Check: student_id is number (not null, NaN, undefined)       │   │
│     │ ✓ Check: isNaN(student.id) === false                           │   │
│     │ ✓ Check: course_offering_id is > 0                             │   │
│     └────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  6. Build submission payload                                                │
│     const attendanceData = {                                               │
│       course_offering_id: parseInt(selectedCourse),  ← 1 (INTEGER)        │
│       date: "2026-04-08",                           ← date string        │
│       attendance: [                                 ← array of records   │
│         {                                                                  │
│           student_id: 1,                            ← 1 (INTEGER!)      │
│           is_present: true                          ← true (BOOLEAN)    │
│         }                                                                  │
│       ]                                                                    │
│     }                                                                       │
│                                                                               │
│  7. Serialize to JSON                                                      │
│     JSON.stringify(attendanceData)                                         │
│     {"course_offering_id":1,"date":"2026-04-08","attendance":[...]}       │
│                                                                               │
│  8. Send POST request                                                      │
│     POST /teacher/attendance                                               │
│     Content-Type: application/json                                        │
│     Authorization: Bearer {token}                                         │
│     Body: {"course_offering_id":1,"attendance":[{"student_id":1,...}]} │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─ BACKEND (Laravel) ────────────────────────────────────────────────────────┐
│                      TeacherController::submitAttendance                     │
│                                                                               │
│  1. Receive POST request with JSON body                                     │
│     $request->getContent() = '{"course_offering_id":1,"attendance":[...]}'  │
│                                                                               │
│  2. Validate input                                                          │
│     $validated = $request->validate([                                      │
│       'course_offering_id' => 'required|exists:course_offerings,id',       │
│       'date' => 'required|date',                                           │
│       'attendance.*.student_id' => 'required|exists:students,id',         │
│       'attendance.*.is_present' => 'required|boolean',                    │
│     ]);                                                                      │
│                                                                               │
│     Validation Result:                                                      │
│     ✓ course_offering_id: 1 exists in course_offerings table               │
│     ✓ date: valid ISO date format                                          │
│     ✓ all student_id values exist in students table                       │
│     ✓ all is_present are boolean                                           │
│                                                                               │
│  3. Process each attendance record                                          │
│     foreach ($validated['attendance'] as $attendanceData) {                │
│       $studentId = (string)$attendanceData['student_id'];    ← "1"        │
│       $isPresent = $attendanceData['is_present'];             ← true      │
│                                                                               │
│       // Log debug info                                                     │
│       Log::info('Data received:', [                                        │
│         'original' => $attendanceData['student_id'],  ← 1 (int)           │
│         'after_cast' => $studentId,                   ← "1" (string)      │
│         'is_present' => $isPresent                    ← true (bool)       │
│       ]);                                                                    │
│     }                                                                        │
│                                                                               │
│  4. Execute SQL: Find existing record                                      │
│     Query 1:                                                                │
│     ┌─────────────────────────────────────────────────────────────────┐  │
│     │ SELECT * FROM `attendance`                                        │  │
│     │ WHERE `course_offering_id` = ?           ← 1                     │  │
│     │   AND `student_id` = ?                   ← "1" (string match)   │  │
│     │   AND DATE(`attendance_date`) = ?        ← "2026-04-08"         │  │
│     │ LIMIT 1;                                                          │  │
│     │                                                                    │  │
│     │ Bindings: [1, "1", "2026-04-08"]                                │  │
│     │ Result: NULL (no record found)                                   │  │
│     └─────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  5. Record doesn't exist, so INSERT new record                              │
│     Query 2:                                                                │
│     ┌─────────────────────────────────────────────────────────────────┐  │
│     │ INSERT INTO `attendance`                                          │  │
│     │   (`course_offering_id`, `student_id`, `attendance_date`,        │  │
│     │    `is_present`, `created_at`, `updated_at`)                     │  │
│     │ VALUES (?, ?, ?, ?, NOW(), NOW())                               │  │
│     │                                                                    │  │
│     │ Bindings:                                                         │  │
│     │   [1, "1", "2026-04-08", 1]                                      │  │
│     │   [int, VARCHAR, DATE, BOOL]                                     │  │
│     │                                                                    │  │
│     │ Result: 1 row inserted                                            │  │
│     │ New ID: 1 (or next auto_increment value)                         │  │
│     └─────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  6. Return success response                                                 │
│     {                                                                       │
│       "status": "success",                                                 │
│       "message": "Attendance submitted successfully",                      │
│       "data": {                                                            │
│         "course_offering_id": 1,                                          │
│         "date": "2026-04-08",                                             │
│         "attendance_count": 1                                             │
│       }                                                                     │
│     }                                                                        │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─ DATABASE (MySQL) ─────────────────────────────────────────────────────────┐
│                           attendance table                                   │
│                                                                               │
│  Result after INSERT:                                                       │
│  ┌─────┬──────────────────┬────────────┬─────────────────┬──────────┐     │
│  │ id  │ course_offering_ │ student_id │ attendance_date │ is_present    │
│  ├─────┼──────────────────┼────────────┼─────────────────┼──────────┤     │
│  │ 1   │ 1                │ "1"        │ 2026-04-08      │ 1        │     │
│  │ 2   │ 1                │ "2"        │ 2026-04-08      │ 0        │     │
│  │ 3   │ 1                │ "3"        │ 2026-04-08      │ 0        │     │
│  ├─────┼──────────────────┼────────────┼─────────────────┼──────────┤     │
│  │ ... │ ...              │ ...        │ ...             │ ...      │     │
│  └─────┴──────────────────┴────────────┴─────────────────┴──────────┘     │
│                                                                               │
│  Data Persisted! ✓                                                          │
│  - 3 records created                                                        │
│  - student 1: present (is_present = 1)                                    │
│  - students 2,3: absent (is_present = 0)                                  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 DATA TYPE TRANSFORMATION

```
FRONTEND (JSON)       BACKEND (PHP)         DATABASE (MySQL)      DISPLAY
════════════════════════════════════════════════════════════════════════════
Number: 1         →   Integer: 1        →   VARCHAR: "1"     →   "1" on form
Boolean: true     →   Boolean: true     →   TINYINT: 1        →   Checkbox
Boolean: false    →   Boolean: false    →   TINYINT: 0        →   Unchecked
Date: "2026-04-08" → Carbon: 2026-04-08 → DATE: 2026-04-08 → "Apr 8, 2026"

⚠️  DANGER ZONE  ⚠️
════════════════════════════════════════════════════════════════════════════════
undefined        →   NULL              →   REJECTED (NOT NULL) → Error!
NaN              →   NULL (serializes) →   REJECTED            → Error!
null             →   NULL              →   REJECTED            → Error!
```

---

## 🔄 RETRIEVAL (GET) FLOW

```
┌─ FRONTEND (Page Reload) ────────────────────────────────────────────────┐
│  1. Component mounts, calls fetchAttendance()                            │
│  2. GET /teacher/attendance?course_offering_id=1&date=2026-04-08        │
└─────────────────────────────────────────────────────────────────────────┘
                              ↓
┌─ BACKEND: getAttendance() ──────────────────────────────────────────────┐
│                                                                           │
│  Query 1: Get enrollments for this course                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ SELECT e.id, s.id, s.student_id, u.first_name, u.last_name       │  │
│  │ FROM enrollments e                                                  │  │
│  │ JOIN students s ON e.student_id = s.id                            │  │
│  │ JOIN users u ON s.user_id = u.id                                  │  │
│  │ WHERE e.course_offering_id = 1;                                   │  │
│  │                                                                    │  │
│  │ Result:                                                             │  │
│  │ e.id: 1,  s.id: 1,  s.student_id: "CSE-001", name: "John"         │  │
│  │ e.id: 2,  s.id: 2,  s.student_id: "CSE-002", name: "Jane"         │  │
│  │ e.id: 3,  s.id: 3,  s.student_id: "CSE-003", name: "Bob"          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  For each enrollment (loop):                                             │
│  ┌─ For enrollment 1 (student ID = 1) ──────────────────────────────┐  │
│  │   $studentId = (string)1 = "1"                                    │  │
│  │                                                                    │  │
│  │   Query 2A: Find attendance record                               │  │
│  │   ┌─────────────────────────────────────────────────────────┐  │  │
│  │   │ SELECT * FROM attendance                                 │  │  │
│  │   │ WHERE course_offering_id = 1                             │  │  │
│  │   │   AND student_id = "1"                                  │  │  │
│  │   │   AND DATE(attendance_date) = "2026-04-08"              │  │  │
│  │   │ LIMIT 1;                                                 │  │  │
│  │   │                                                          │  │  │
│  │   │ Bindings: [1, "1", "2026-04-08"]                        │  │  │
│  │   │ Result: FOUND! attendance record                        │  │  │
│  │   │ {                                                        │  │  │
│  │   │   id: 1,                                                 │  │  │
│  │   │   student_id: "1",                                       │  │  │
│  │   │   is_present: 1                                          │  │  │
│  │   │ }                                                        │  │  │
│  │   └─────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │   Build response for this student:                               │  │
│  │   {                                                               │  │
│  │     "id": "CSE-001",                                             │  │
│  │     "name": "John Smith",                                        │  │
│  │     "student_id": 1,              ← INTEGER (matches what we    │  │
│  │     "is_present": true,           ← Found in attendance!        │  │
│  │     "attendance_id": 1                                           │  │
│  │   }                                                               │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─ For enrollment 2 (student ID = 2) ──────────────────────────────┐  │
│  │   Query 2B: Find attendance record                               │  │
│  │   WHERE course_offering_id = 1 AND student_id = "2"              │  │
│  │   Result: FOUND! is_present = 0 (false)                         │  │
│  │   Response: { ..., "is_present": false }                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  Final response:                                                         │
│  {                                                                       │
│    "status": "success",                                                 │
│    "data": {                                                            │
│      "students": [                                                      │
│        {"id": "CSE-001", "name": "John", "is_present": true},          │
│        {"id": "CSE-002", "name": "Jane", "is_present": false},         │
│        {"id": "CSE-003", "name": "Bob", "is_present": false}           │
│      ]                                                                   │
│    }                                                                     │
│  }                                                                       │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
                              ↓
┌─ FRONTEND (Update UI) ──────────────────────────────────────────────────┐
│  1. Receive response with attendance data                               │
│  2. Map students array:                                                 │
│     {                                                                     │
│       id: 1,    (parsed from student_id)                                │
│       status: "P"  (because is_present: true)                           │
│     }                                                                     │
│  3. Render checkboxes with correct status ✓                             │
│  4. User sees: John ☑ (Present), Jane ☐ (Absent), Bob ☐ (Absent)      │
│                                                                           │
│  Result: DATA PERSISTED! ✓✓✓                                            │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## ❌ FAILURE SCENARIO

```
If frontend sends:  {"student_id": null, "is_present": true}
                                    ↓
Backend receives:   null (failed to cast/serialize)
                                    ↓
Validation fails:   exists:students,id check on null → FALSE ❌
                                    ↓
Response error:     {status: 'error', message: 'Validation failed', ...}
                                    ↓
Database:           NO record inserted (validation rejected)
                                    ↓
On reload:          Query WHERE student_id = '1' finds nothing
                    Returns is_present: false (default)
                                    ↓
Result:             ALL STUDENTS SHOW AS ABSENT ❌
```

---

## ✅ SUCCESS INDICATORS

1. **Browser Console shows**:
   ```
   Student 0: {id: 1, id_type: "number", is_nan: false, status: "P"}
   Student 1: {id: 2, id_type: "number", is_nan: false, status: "A"}
   ```
   NOT:
   ```
   Student 0: {id: NaN, id_type: "nan", is_nan: true}
   ```

2. **Server logs show**:
   ```
   "original_student_id": 1,
   "after_string_cast": "1",
   "string_cast_type": "string"
   ```
   NOT:
   ```
   "original_student_id": null,
   "after_string_cast": null
   ```

3. **Database query returns**:
   ```
   SELECT * FROM attendance WHERE course_offering_id = 1;
   (3 rows: student_id=1,2,3 with correct is_present values)
   ```
   NOT:
   ```
   (0 rows)
   ```

4. **Page reload shows**:
   ```
   John (Present) ✓
   Jane (Absent)
   Bob (Absent)
   ```
   NOT all showing as Absent

---

## 🧪 COMPLETE TEST SCENARIO

```
1. SETUP
   └─ Ensure course 1 has students 1, 2, 3 enrolled

2. SUBMIT ATTENDANCE
   ├─ Select course 1
   ├─ Mark: Student 1 = Present, Student 2 = Absent, Student 3 = Absent
   ├─ Click Submit
   └─ Check console: student_id should be [1, 2, 3], not [null, null, null]

3. CHECK DATABASE
   SELECT * FROM attendance WHERE course_offering_id = 1 
   AND DATE(attendance_date) = CURDATE();
   Result should show 3 records:
   ├─ student_id: 1, is_present: 1
   ├─ student_id: 2, is_present: 0
   └─ student_id: 3, is_present: 0

4. RELOAD PAGE
   ├─ Go to Attendance page again
   ├─ Select same course 1
   └─ Verify checkboxes match what was submitted
       Student 1: ☑ (Present) ← This is the proof of persistence
       Student 2: ☐ (Absent)
       Student 3: ☐ (Absent)

5. RESULT
   └─ ✅ DATA PERSISTED - Issue is fixed!
```

---

**Key Message**: All student_id values must be NUMBERS, not null/NaN/undefined, to ensure data persists correctly through the entire flow.
