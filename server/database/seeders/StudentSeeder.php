<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class StudentSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Link student users to Student model with departments, IDs, and academic info
     */
    public function run(): void
    {
        $faker = Faker::create();
        $departments = Department::all();
        
        // Get all student users
        $studentUsers = User::where('role', 'student')->get();

        $fatherNames = ['Md. Zahirul Islam', 'Mohammad Ali', 'Rahman Ahmed', 'Abdur Rashid', 'Kamal Uddin', 
                        'Nasir Ahmed', 'Habib Ur Rahman', 'Syed Ibrahim', 'Tanvir Hasan', 'Rafique Ahmed'];
        
        $motherNames = ['Sultana Begum', 'Fatima Akhter', 'Nasrin Akter', 'Aminat Begum', 'Rukhsana Begum',
                        'Shamima Begum', 'Hafiza Begum', 'Salma Akter', 'Nadia Begum', 'Yasmin Akter'];

        $studentIdBase = 2023; // Admission year
        $counter = 01001;

        foreach ($studentUsers as $index => $user) {
            $department = $departments[($index % $departments->count())];
            $currentYear = ($index % 4) + 1; // Years 1-4
            
            Student::create([
                'user_id' => $user->id,
                'department_id' => $department->id,
                'student_id' => $studentIdBase . str_pad($department->id, 2, '0', STR_PAD_LEFT) . str_pad($counter + $index, 5, '0', STR_PAD_LEFT),
                'admission_year' => $studentIdBase - (4 - $currentYear),
                'current_semester' => $currentYear * 2 - $faker->randomElement([0, 1]),
                'gpa' => $faker->randomFloat(2, 2.5, 4.0),
                'cgpa' => $faker->randomFloat(2, 2.5, 4.0),
                'admission_semester' => $faker->randomElement(['Spring', 'Summer', 'Fall', 'Winter']),
                'enrollment_status' => $faker->randomElement(['active', 'active', 'active', 'inactive', 'graduated']),
                'father_name' => $fatherNames[array_rand($fatherNames)],
                'mother_name' => $motherNames[array_rand($motherNames)],
            ]);
        }
    }
}
