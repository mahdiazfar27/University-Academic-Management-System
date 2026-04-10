# PowerShell Attendance Test Script
$apiUrl = "http://127.0.0.1:8000/api/v1"

# 1. LOGIN
Write-Host "1. Logging in as teacher..." -ForegroundColor Cyan
$loginResp = Invoke-WebRequest -Uri "$apiUrl/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -UseBasicParsing `
  -Body (ConvertTo-Json @{
    email = "alexander.lewis@iums.edu"
    password = "teacher@123"
    role = "teacher"
  })
$loginData = ConvertFrom-Json $loginResp.Content
$token = $loginData.data.token
$teacherId = $loginData.data.user.teacher_id
Write-Host "✓ Logged in. Token length: $([math]::Round($token.Length/10))0, Teacher ID: $teacherId" -ForegroundColor Green

# 2. GET TEACHER COURSES
Write-Host "2. Fetching teacher courses..." -ForegroundColor Cyan
$coursesResp = Invoke-WebRequest -Uri "$apiUrl/teacher/$teacherId/course-offerings" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} `
  -UseBasicParsing
$coursesData = ConvertFrom-Json $coursesResp.Content
$courseId = $coursesData.data[0].id
Write-Host "✓ Found course ID: $courseId" -ForegroundColor Green

# 3. GET STUDENTS FOR COURSE (with enrollment details)
Write-Host "3. Getting students for course..." -ForegroundColor Cyan
$studentResp = Invoke-WebRequest -Uri "$apiUrl/course-offerings/$courseId/students" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} `
  -UseBasicParsing
$studentData = ConvertFrom-Json $studentResp.Content
$students = $studentData.data | Select-Object -First 2
Write-Host "✓ Found students:" -ForegroundColor Green
$students | ForEach-Object { 
    Write-Host "  - ID: $($_.id) [type: $(($_.id).GetType().Name)], Name: $($_.name)"
}

# 4. SUBMIT ATTENDANCE
Write-Host "4. Submitting attendance..." -ForegroundColor Cyan
$today = (Get-Date).ToString("yyyy-MM-dd")

$studentIds = @($students[0].id, $students[1].id)
Write-Host "Student IDs being sent: $studentIds (types: $($studentIds | ForEach-Object { $_.GetType().Name }))" -ForegroundColor Yellow

$attendancePayload = @{
    course_offering_id = $courseId
    date = $today
    attendance = @(
        @{ student_id = $students[0].id; is_present = $true }
        @{ student_id = $students[1].id; is_present = $false }
    )
}
Write-Host "Payload: $(ConvertTo-Json $attendancePayload -Depth 10)" -ForegroundColor Yellow

$submitResp = Invoke-WebRequest -Uri "$apiUrl/teacher/attendance" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} `
  -UseBasicParsing `
  -Body (ConvertTo-Json $attendancePayload)
$submitData = ConvertFrom-Json $submitResp.Content
Write-Host "✓ Response: $(ConvertTo-Json $submitData)" -ForegroundColor Green

Write-Host "`n5. Waiting for logs to flush..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

Write-Host "6. Getting attendance for verification..." -ForegroundColor Cyan
$getResp = Invoke-WebRequest -Uri "$apiUrl/teacher/attendance?course_offering_id=$courseId&date=$today" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} `
  -UseBasicParsing
$getData = ConvertFrom-Json $getResp.Content
$retrievedCount = @($getData.data.students | Where-Object { $_.is_present -eq $true }).Count
Write-Host "✓ Retrieved: Total students: $($getData.data.total_students), Present: $($getData.data.present_count)" -ForegroundColor Green
Write-Host "First 2 students:" -ForegroundColor Yellow
$getData.data.students | Select-Object -First 2 | ForEach-Object {
    Write-Host "  - ID: $($_.student_id), Name: $($_.name), Present: $($_.is_present)"
}

Write-Host "`n7. Check laravel.log for detailed debugging" -ForegroundColor Cyan
