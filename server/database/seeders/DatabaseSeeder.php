<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with comprehensive test data
     * 
     * Execution Order:
     * 1. DepartmentSeeder - Create 5-6 departments
     * 2. UserSeeder - Create 6 admins, 55 teachers, 280 students
     * 3. TeacherSeeder - Link users to Teacher model & departments
     * 4. StudentSeeder - Link users to Student model & departments
     * 5. SemesterSeeder - Create academic semesters
     * 6. CourseSeeder - Create 60+ courses across departments
     * 7. CourseOfferingSeeder - Create course sections with teachers
     * 8. EnrollmentSeeder - Enroll students in courses
     * 9. ResultSeeder - Generate grades for completed courses
     * 10. PaymentSeeder - Create payment records for students
     */
    public function run(): void
    {
        $this->call([
            DepartmentSeeder::class,
            UserSeeder::class,
            TeacherSeeder::class,
            StudentSeeder::class,
            SemesterSeeder::class,
            CourseSeeder::class,
            CourseOfferingSeeder::class,
            EnrollmentSeeder::class,
            ResultSeeder::class,
            PaymentSeeder::class,
        ]);
    }
}
