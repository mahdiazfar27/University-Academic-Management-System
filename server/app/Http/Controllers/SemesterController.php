<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SemesterController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Semester::query();
            if ($request->has('status')) {
                $query->where('status', $request->query('status'));
            }
            $semesters = $query->paginate($request->query('per_page', 15));

            return response()->json(['status' => 'success', 'message' => 'Semesters retrieved', 'data' => $semesters], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to retrieve semesters', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate(['name' => 'required', 'code' => 'required|unique:semesters', 'start_date' => 'required|date', 'end_date' => 'required|date|after:start_date', 'status' => 'in:planned,active,completed,cancelled']);
            $semester = Semester::create($validated);
            return response()->json(['status' => 'success', 'message' => 'Semester created', 'data' => $semester], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to create semester', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Semester $semester)
    {
        return response()->json(['status' => 'success', 'message' => 'Semester retrieved', 'data' => $semester], 200);
    }

    public function update(Request $request, Semester $semester)
    {
        try {
            $validated = $request->validate(['status' => 'in:planned,active,completed,cancelled']);
            $semester->update($validated);
            return response()->json(['status' => 'success', 'message' => 'Semester updated', 'data' => $semester], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Semester $semester)
    {
        try {
            $semester->delete();
            return response()->json(['status' => 'success', 'message' => 'Semester deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed', 'error' => $e->getMessage()], 500);
        }
    }
}
