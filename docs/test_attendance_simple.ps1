$apiUrl = "http://127.0.0.1:8000/api/v1"

Write-Host "1. Logging in..." -ForegroundColor Cyan
$loginResp = Invoke-WebRequest -Uri "$apiUrl/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -UseBasicParsing -Body (ConvertTo-Json @{email="alexander.lewis@iums.edu"; password="teacher@123"; role="teacher"})
$loginData = ConvertFrom-Json $loginResp.Content
$token = $loginData.data.token
$teacherId = $loginData.data.user.teacher_id
Write-Host "OK - Teacher ID: $teacherId"

Write-Host "2. Get courses..." -ForegroundColor Cyan
$coursesResp = Invoke-WebRequest -Uri "$apiUrl/teacher/$teacherId/course-offerings" -Method GET -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} -UseBasicParsing
$coursesData = ConvertFrom-Json $coursesResp.Content
$courseId = $coursesData.data[0].id
Write-Host "OK - Course ID: $courseId"

Write-Host "3. Get students..." -ForegroundColor Cyan
$studentResp = Invoke-WebRequest -Uri "$apiUrl/course-offerings/$courseId/students" -Method GET -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} -UseBasicParsing
$studentData = ConvertFrom-Json $studentResp.Content
$student1 = $studentData.data[0]
$student2 = $studentData.data[1]
Write-Host "OK - Students: $($student1.id), $($student2.id)"

Write-Host "4. Submit attendance..." -ForegroundColor Cyan
$today = (Get-Date).ToString("yyyy-MM-dd")
$payload = @{
    course_offering_id = $courseId
    date = $today
    attendance = @(
        @{student_id = $student1.id; is_present = $true}
        @{student_id = $student2.id; is_present = $false}
    )
}
$submitResp = Invoke-WebRequest -Uri "$apiUrl/teacher/attendance" -Method POST -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} -UseBasicParsing -Body (ConvertTo-Json $payload)
$submitData = ConvertFrom-Json $submitResp.Content
Write-Host $submitData.message

Start-Sleep -Seconds 1

Write-Host "5. Get attendance..." -ForegroundColor Cyan
$getResp = Invoke-WebRequest -Uri "$apiUrl/teacher/attendance?course_offering_id=$courseId&date=$today" -Method GET -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} -UseBasicParsing
$getData = ConvertFrom-Json $getResp.Content
Write-Host "Total: $($getData.data.total_students), Present: $($getData.data.present_count)"
$getData.data.students | Select-Object -First 2 | ForEach-Object {Write-Host "  - $($_.name): $($_.is_present)"}

Write-Host "6. Check logs NOW:" -ForegroundColor Green
