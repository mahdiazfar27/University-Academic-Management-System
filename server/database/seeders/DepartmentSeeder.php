<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Create 5-6 departments representing various academic disciplines
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Computer Science & Engineering',
                'code' => 'CSE',
                'description' => 'Department of Computer Science & Engineering - focuses on software development, algorithms, databases, and systems',
            ],
            [
                'name' => 'Electrical & Electronics Engineering',
                'code' => 'EEE',
                'description' => 'Department of Electrical & Electronics Engineering - covers power systems, electronics, telecommunications',
            ],
            [
                'name' => 'Civil Engineering',
                'code' => 'CE',
                'description' => 'Department of Civil Engineering - focuses on infrastructure, construction, structural analysis',
            ],
            [
                'name' => 'Mechanical Engineering',
                'code' => 'ME',
                'description' => 'Department of Mechanical Engineering - includes mechanics, thermodynamics, manufacturing',
            ],
            [
                'name' => 'Business Administration',
                'code' => 'BUS',
                'description' => 'Department of Business Administration - covers management, finance, accounting, economics',
            ],
            [
                'name' => 'Mathematics',
                'code' => 'MATH',
                'description' => 'Department of Mathematics - pure and applied mathematics, statistics, computational methods',
            ],
        ];

        foreach ($departments as $dept) {
            Department::create($dept);
        }
    }
}
