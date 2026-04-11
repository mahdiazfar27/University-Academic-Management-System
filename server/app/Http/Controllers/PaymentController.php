<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Student;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    /**
     * Get current student's own payment records (via JWT)
     */
    public function myPayments(Request $request)
    {
        try {
            $user = null;
            $student = null;
            
            // Try JWT service first (for JWT-protected routes)
            try {
                $jwtService = app('App\Services\JwtService');
                $token = $jwtService->getTokenFromRequest();
                if ($token) {
                    $payload = $jwtService->validateToken($token);
                    $user = \App\Models\User::find($payload['userId'] ?? null);
                    if ($user) {
                        $student = \App\Models\Student::where('user_id', $user->id)->first();
                    }
                }
            } catch (\Exception $e) {
                // Fall through
            }

            if (!$user || !$student || $user->role !== 'student') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized - Student access required'
                ], 401);
            }

            $status = $request->query('status');
            $query = Payment::where('student_id', $student->student_id);

            if ($status) {
                $query->where('payment_status', $status);
            }

            $payments = $query->get();

            $totalDue = $payments->sum('amount');
            $totalPaid = $payments->where('payment_status', 'paid')->sum('amount');
            $totalOutstanding = $totalDue - $totalPaid;

            return response()->json([
                'status' => 'success',
                'message' => 'Payment records retrieved',
                'data' => [
                    'student' => [
                        'id' => $student->id,
                        'name' => $user->name,
                        'student_id' => $student->student_id,
                    ],
                    'summary' => [
                        'total_due' => $totalDue,
                        'total_paid' => $totalPaid,
                        'total_outstanding' => $totalOutstanding,
                    ],
                    'payments' => $payments->map(fn($p) => [
                        'id' => $p->id,
                        'semester' => $p->semester,
                        'fee_group' => $p->fee_group,
                        'amount' => $p->amount,
                        'amount_due' => $p->amount,
                        'amount_paid' => $p->payment_status === 'paid' ? $p->amount : 0,
                        'due_date' => $p->application_date,
                        'paid_date' => $p->payment_date,
                        'payment_method' => $p->payment_method,
                        'transaction_id' => $p->transaction_id,
                        'payment_status' => $p->payment_status,
                    ])->toArray(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving payments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student's payment records (admin endpoint)
     */
    public function studentPayments($studentId, Request $request)
    {
        try {
            $user = auth()->user();

            // Allow student to view own payments or admin/teacher to view student's
            if ($user->role === 'student' && $user->student?->id != $studentId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - Cannot view other student payments',
                ], 403);
            }

            $student = Student::with('user')->find($studentId);

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found',
                ], 404);
            }

            $status = $request->query('status');
            $query = Payment::where('student_id', $studentId);

            if ($status) {
                $query->where('payment_status', $status);
            }

            $payments = $query->get();

            $totalDue = $payments->sum('amount');
            $totalPaid = $payments->where('payment_status', 'paid')->sum('amount');
            $totalOutstanding = $totalDue - $totalPaid;

            return response()->json([
                'success' => true,
                'data' => [
                    'student' => [
                        'id' => $student->id,
                        'name' => $student->user->name,
                        'student_id' => $student->student_id,
                    ],
                    'summary' => [
                        'total_due' => $totalDue,
                        'total_paid' => $totalPaid,
                        'total_outstanding' => $totalOutstanding,
                    ],
                    'payments' => $payments->map(fn($p) => [
                        'id' => $p->id,
                        'semester' => $p->semester,
                        'fee_group' => $p->fee_group,
                        'amount' => $p->amount,
                        'amount_due' => $p->amount,
                        'amount_paid' => $p->payment_status === 'paid' ? $p->amount : 0,
                        'due_date' => $p->application_date,
                        'paid_date' => $p->payment_date,
                        'payment_method' => $p->payment_method,
                        'transaction_id' => $p->transaction_id,
                        'payment_status' => $p->payment_status,
                    ])->toArray(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving payments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Record a payment
     */
    public function recordPayment(Request $request, $studentId)
    {
        try {
            $user = auth()->user();

            // Only admin can record payments
            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - Admin access required',
                ], 403);
            }

            $validated = $request->validate([
                'semester_id' => 'required|exists:semesters,id',
                'amount_paid' => 'required|numeric|min:0.01',
                'payment_method' => 'required|in:bank_transfer,cash,check,online',
                'transaction_id' => 'nullable|string|max:100',
                'remarks' => 'nullable|string|max:500',
            ]);

            $student = Student::find($studentId);

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found',
                ], 404);
            }

            // Find or create payment record
            $payment = Payment::firstOrCreate(
                [
                    'student_id' => $studentId,
                    'semester_id' => $validated['semester_id'],
                ],
                [
                    'amount_due' => 50000, // Default tuition fee
                    'amount_paid' => 0,
                    'payment_status' => 'pending',
                    'due_date' => Semester::find($validated['semester_id'])->end_date,
                ]
            );

            // Update payment
            $newAmountPaid = $payment->amount_paid + $validated['amount_paid'];
            $payment->amount_paid = $newAmountPaid;
            $payment->payment_method = $validated['payment_method'];
            $payment->transaction_id = $validated['transaction_id'];
            $payment->remarks = $validated['remarks'];

            // Determine payment status
            if ($newAmountPaid >= $payment->amount_due) {
                $payment->payment_status = 'paid';
                $payment->paid_date = now();
            } elseif ($newAmountPaid > 0) {
                $payment->payment_status = 'partial';
            }

            $payment->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment recorded successfully',
                'data' => [
                    'payment_id' => $payment->id,
                    'student_id' => $studentId,
                    'semester_id' => $validated['semester_id'],
                    'amount_paid' => $newAmountPaid,
                    'amount_due' => $payment->amount_due,
                    'outstanding' => $payment->amount_due - $newAmountPaid,
                    'status' => $payment->payment_status,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recording payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get payment statistics
     */
    public function paymentStatistics(Request $request)
    {
        try {
            $user = auth()->user();

            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - Admin access required',
                ], 403);
            }

            $semesterId = $request->query('semester_id');

            $query = Payment::query();

            if ($semesterId) {
                $query->where('semester_id', $semesterId);
            }

            $totalPayments = $query->sum('amount_paid');
            $totalDue = $query->sum('amount_due');
            $totalOutstanding = $totalDue - $totalPayments;
            $paidCount = $query->where('payment_status', 'paid')->count();
            $pendingCount = $query->where('payment_status', 'pending')->count();
            $partialCount = $query->where('payment_status', 'partial')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_due' => $totalDue,
                    'total_paid' => $totalPayments,
                    'total_outstanding' => $totalOutstanding,
                    'status_counts' => [
                        'paid' => $paidCount,
                        'partial' => $partialCount,
                        'pending' => $pendingCount,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving payment statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
