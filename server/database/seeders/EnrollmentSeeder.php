<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Student;
use App\Models\CourseOffering;
use App\Models\Semester;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class EnrollmentSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Enroll students in course offerings
     */
    public function run(): void
    {
        $faker = Faker::create();
        $students = Student::where('enrollment_status', 'active')->get();
        $courseOfferings = CourseOffering::with('course', 'semester')->get();
        $activeSemesters = Semester::whereIn('status', ['active', 'completed'])->get();

        // For each student, enroll in 4-6 courses per active/completed semester
        foreach ($students as $student) {
            foreach ($activeSemesters as $semester) {
                $numCourses = $faker->randomElement([4, 5, 5, 6]);
                $semesterOfferings = $courseOfferings->where('semester_id', $semester->id)->random($numCourses);

                foreach ($semesterOfferings as $offering) {
                    $existingEnrollment = Enrollment::where([
                        'student_id' => $student->student_id,
                        'course_offering_id' => $offering->id,
                    ])->first();

                    if (!$existingEnrollment) {
                        Enrollment::create([
                            'student_id' => $student->student_id,
                            'course_offering_id' => $offering->id,
                            'semester_id' => $semester->id,
                            'enrollment_status' => $faker->randomElement(['Enrolled', 'Enrolled', 'Enrolled', 'Withdrawn', 'Completed']),
                            'enrollment_date' => $semester->start_date,
                        ]);
                    }
                }
            }
        }
    }
}
