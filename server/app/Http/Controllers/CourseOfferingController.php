<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\Teacher;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CourseOfferingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $offerings = CourseOffering::with('course', 'semester', 'teacher')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $offerings
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve course offerings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseOffering $courseOffering)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseOffering $courseOffering)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseOffering $courseOffering)
    {
        //
    }

    /**
     * Get course offerings for a specific teacher
     */
    public function teacherCourseOfferings($teacher_id)
    {
        try {
            $offerings = CourseOffering::where('teacher_id', $teacher_id)
                ->with('course', 'semester', 'teacher')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $offerings
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve teacher courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get students enrolled in a course offering
     */
    public function getCourseStudents($courseOfferingId)
    {
        try {
            $courseOffering = CourseOffering::with(['enrollments.student.user', 'course'])
                ->find($courseOfferingId);

            if (!$courseOffering) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Course offering not found'
                ], 404);
            }

            // Extract student information from enrollments
            $students = $courseOffering->enrollments->map(function($enrollment) {
                return [
                    'enrollment_id' => $enrollment->id,
                    'student_id' => $enrollment->student->id,
                    'student_code' => $enrollment->student->student_id,
                    'name' => $enrollment->student->user->name,
                    'email' => $enrollment->student->user->email,
                    'enrollment_status' => $enrollment->enrollment_status,
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => [
                    'course_offering' => [
                        'id' => $courseOffering->id,
                        'course' => $courseOffering->course->code . ' - ' . $courseOffering->course->title,
                        'section' => $courseOffering->section,
                    ],
                    'students' => $students,
                    'total_students' => $students->count(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve course students',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student's class schedule/routine
     */
    public function studentSchedule(Request $request)
    {
        try {
            // Get current user from JWT
            $jwtService = app('App\Services\JwtService');
            $token = $jwtService->getTokenFromRequest();
            
            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Authentication required'
                ], 401);
            }

            $payload = $jwtService->validateToken($token);
            $user = \App\Models\User::find($payload['userId'] ?? null);
            
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            $student = \App\Models\Student::where('user_id', $user->id)->first();
            if (!$student) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Get enrollments for current semester
            $semesterId = $request->query('semester_id');
            $query = $student->enrollments()
                ->with('courseOffering.course', 'courseOffering.teacher.user', 'semester');

            if ($semesterId) {
                $query->where('semester_id', $semesterId);
            }

            $enrollments = $query->get();

            // Format schedule data
            $schedule = $enrollments->map(function($enrollment) {
                $offering = $enrollment->courseOffering;
                return [
                    'id' => $enrollment->id,
                    'course_code' => $offering->course->course_code,
                    'course_title' => $offering->course->title,
                    'credits' => $offering->course->credits,
                    'section' => $offering->section,
                    'day' => $offering->day ?? 'TBA',
                    'start_time' => $offering->start_time ?? 'TBA',
                    'end_time' => $offering->end_time ?? 'TBA',
                    'room' => $offering->room ?? 'TBA',
                    'teacher' => $offering->teacher ? $offering->teacher->user->name : 'TBA',
                    'status' => $enrollment->enrollment_status,
                ];
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Student schedule retrieved',
                'data' => $schedule
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve schedule',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get course schedule details
     */
    public function courseSchedule($courseOfferingId)
    {
        try {
            $offering = CourseOffering::with('course', 'teacher.user', 'semester')
                ->find($courseOfferingId);

            if (!$offering) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Course offering not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'id' => $offering->id,
                    'course_code' => $offering->course->course_code,
                    'course_title' => $offering->course->title,
                    'credits' => $offering->course->credits,
                    'description' => $offering->course->description,
                    'section' => $offering->section,
                    'capacity' => $offering->capacity,
                    'day' => $offering->day ?? 'TBA',
                    'start_time' => $offering->start_time ?? 'TBA',
                    'end_time' => $offering->end_time ?? 'TBA',
                    'room' => $offering->room ?? 'TBA',
                    'teacher' => $offering->teacher ? $offering->teacher->user->name : 'TBA',
                    'semester' => $offering->semester->academic_year . ' ' . $offering->semester->semester,
                    'status' => $offering->status,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve course schedule',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

