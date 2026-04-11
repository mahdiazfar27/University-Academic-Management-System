<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Link teacher users to Teacher model with departments, qualifications, specializations
     */
    public function run(): void
    {
        $departments = Department::all();
        
        // Get all teacher users (those with role='teacher')
        $teacherUsers = User::where('role', 'teacher')->get();

        $specializations = [
            'Advanced Algorithms',
            'Database Systems',
            'Artificial Intelligence',
            'Machine Learning',
            'Web Development',
            'Mobile Development',
            'Cloud Computing',
            'Cybersecurity',
            'Data Science',
            'Power Systems',
            'Electronics Design',
            'Control Systems',
            'Structural Analysis',
            'Foundation Engineering',
            'Thermodynamics',
            'Fluid Mechanics',
            'Finance & Accounting',
            'Human Resource Management',
            'Marketing Management',
            'Operations Research',
            'Abstract Algebra',
            'Real Analysis',
            'Statistics & Probability',
        ];

        $qualifications = [
            'M.S.',
            'Ph.D.',
            'M.Tech',
            'B.Tech',
            'MBA',
            'M.A.',
            'M.Sc.',
        ];

        $employmentTypes = ['Tenure', 'Tenure-Track', 'Contractual', 'Adjunct'];

        $employeeIdBase = 'FAC';
        $counter = 2022001;

        foreach ($teacherUsers as $index => $user) {
            $department = $departments[($index % $departments->count())];
            
            Teacher::create([
                'user_id' => $user->id,
                'department_id' => $department->id,
                'employee_id' => $employeeIdBase . '-' . ($counter + $index),
                'qualification' => $qualifications[array_rand($qualifications)],
                'specialization' => $specializations[array_rand($specializations)] . ', ' . 
                                   $specializations[array_rand($specializations)],
            ]);
        }
    }
}
