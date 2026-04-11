<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\Student;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    /**
     * Display a listing of results with pagination
     */
    public function index(Request $request)
    {
        try {
            $query = Result::query();

            // Get current user from JWT token to filter student results
            $user = null;
            $student = null;
            try {
                $jwtService = app('App\Services\JwtService');
                $token = $jwtService->getTokenFromRequest();
                if ($token) {
                    $payload = $jwtService->validateToken($token);
                    $user = \App\Models\User::find($payload['userId'] ?? null);
                    // Get the student record for this user
                    if ($user) {
                        $student = \App\Models\Student::where('user_id', $user->id)->first();
                    }
                }
            } catch (\Exception $e) {
                // Continue without JWT
            }

            // If student is accessing, filter to their results only
            if ($student && (!$user || $user->role === 'student')) {
                $query->where('student_id', $student->id);
            }

            // Filter by student_id (admin override)
            if ($request->has('student_id')) {
                $query->where('student_id', $request->query('student_id'));
            }

            // Filter by semester_id
            if ($request->has('semester_id')) {
                $query->where('semester_id', $request->query('semester_id'));
            }

            $perPage = $request->query('per_page', 15);
            $results = $query->with('student', 'courseOffering.course', 'semester')
                ->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Results retrieved successfully',
                'data' => $results
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve results',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created result
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_id' => 'required|exists:students,student_id',
                'course_offering_id' => 'required|exists:course_offerings,id',
                'enrollment_id' => 'required|exists:enrollments,id',
                'semester_id' => 'required|exists:semesters,id',
                'final_marks' => 'required|numeric|min:0|max:100',
                'grade' => 'required|in:A+,A,A-,B+,B,B-,C+,C,C-,D+,D,D-,F',
                'grade_point' => 'required|numeric|min:0|max:4',
            ]);

            $result = Result::create($validated);
            $result->load('student', 'courseOffering', 'semester');

            return response()->json([
                'status' => 'success',
                'message' => 'Result created successfully',
                'data' => $result
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create result',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified result
     */
    public function show(Result $result, Request $request)
    {
        try {
            $include = $request->query('include', 'student,courseOffering,semester');
            $relations = explode(',', $include);
            
            $result->load($relations);

            return response()->json([
                'status' => 'success',
                'message' => 'Result retrieved successfully',
                'data' => $result
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve result',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified result
     */
    public function update(Request $request, Result $result)
    {
        try {
            $validated = $request->validate([
                'final_marks' => 'numeric|min:0|max:100',
                'grade' => 'in:A+,A,A-,B+,B,B-,C+,C,C-,D+,D,D-,F',
                'grade_point' => 'numeric|min:0|max:4',
                'result_status' => 'in:Draft,Submitted,Reviewed,Published',
            ]);

            $result->update($validated);
            $result->load('student', 'courseOffering', 'semester');

            return response()->json([
                'status' => 'success',
                'message' => 'Result updated successfully',
                'data' => $result
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update result',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified result
     */
    public function destroy(Result $result)
    {
        try {
            $result->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Result deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete result',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student's results for a specific semester
     */
    public function getStudentResults(Request $request, Student $student)
    {
        try {
            $semesterId = $request->query('semester_id');
            $query = $student->results();

            if ($semesterId) {
                $query->where('semester_id', $semesterId);
            }

            $results = $query->with('courseOffering.course', 'semester')->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Student results retrieved successfully',
                'data' => $results
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve student results',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
