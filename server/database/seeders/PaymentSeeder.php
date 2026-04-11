<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Student;
use App\Models\Semester;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all students and semesters
        $students = Student::all();
        $semesters = Semester::all();

        foreach ($students as $student) {
            foreach ($semesters as $semester) {
                // Check if payment already exists
                $existingPayment = Payment::where('student_id', $student->student_id)
                    ->where('semester', "{$semester->academic_year} {$semester->semester}")
                    ->first();

                if (!$existingPayment) {
                    // Create payment records
                    $statuses = ['paid', 'partial', 'pending'];
                    $status = array_rand(array_flip($statuses));
                    $dueDate = $semester->end_date ? Carbon::parse($semester->end_date)->subMonths(1) : now();

                    Payment::create([
                        'student_id' => $student->student_id,
                        'semester' => "{$semester->academic_year} {$semester->semester}",
                        'fee_group' => 'Tuition Fee',
                        'amount' => 50000,
                        'currency' => 'BDT',
                        'application_date' => $dueDate,
                        'payment_date' => $status === 'pending' ? null : now(),
                        'payment_method' => $status === 'pending' ? null : ['bank_transfer', 'cash', 'online'][rand(0, 2)],
                        'transaction_id' => $status === 'pending' ? null : 'TXN-' . strtoupper(uniqid()),
                        'payment_status' => $status,
                    ]);
                }
            }
        }

        $this->command->info('Payment records seeded successfully!');
    }
}
