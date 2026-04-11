<?php

namespace Database\Seeders;

use App\Models\Result;
use App\Models\Enrollment;
use App\Models\CourseOffering;
use App\Models\Semester;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ResultSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Generate grades and results for completed enrollments
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        // Only generate results for completed semesters and completed enrollments
        $completedEnrollments = Enrollment::where('enrollment_status', 'Completed')
            ->whereHas('semester', function ($q) {
                $q->where('status', 'completed');
            })
            ->get();

        $gradeMap = [
            'A+' => [95, 100, 4.0],
            'A' => [90, 94, 3.75],
            'A-' => [85, 89, 3.5],
            'B+' => [80, 84, 3.25],
            'B' => [75, 79, 3.0],
            'B-' => [70, 74, 2.75],
            'C+' => [65, 69, 2.5],
            'C' => [60, 64, 2.25],
            'C-' => [55, 59, 2.0],
            'D+' => [50, 54, 1.75],
            'D' => [45, 49, 1.5],
            'F' => [0, 44, 0.0],
        ];

        foreach ($completedEnrollments as $enrollment) {
            // Check if result already exists
            $existingResult = Result::where('enrollment_id', $enrollment->id)->first();
            
            if (!$existingResult && $enrollment->courseOffering) {
                $gradeKey = array_rand($gradeMap);
                [$minMarks, $maxMarks, $gradePoint] = $gradeMap[$gradeKey];
                $finalMarks = $faker->randomFloat(2, $minMarks, $maxMarks);
                $credits = $enrollment->courseOffering->course->credits ?? 3.0;
                $qualityPoints = $credits * $gradePoint;

                Result::create([
                    'student_id' => $enrollment->student_id,
                    'course_offering_id' => $enrollment->course_offering_id,
                    'enrollment_id' => $enrollment->id,
                    'semester_id' => $enrollment->semester_id,
                    'final_marks' => $finalMarks,
                    'grade' => $gradeKey,
                    'grade_point' => $gradePoint,
                    'quality_points' => $qualityPoints,
                    'semester_gpa' => $faker->randomFloat(3, 2.0, 4.0),
                    'cgpa' => $faker->randomFloat(3, 2.0, 4.0),
                    'is_regular' => $faker->randomElement([true, true, true, false]),
                    'result_status' => 'Published',
                    'result_date' => $enrollment->semester()->first()?->end_date ?? now()->format('Y-m-d'),
                ]);
            }
        }
    }
}
