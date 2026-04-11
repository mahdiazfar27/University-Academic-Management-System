<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Create comprehensive course catalog across all departments
     */
    public function run(): void
    {
        $departments = Department::all();

        // Map courses to departments with codes, titles, and credits
        $courseCatalog = [
            'CSE' => [
                ['code' => 'CSE-101', 'title' => 'Introduction to Computer Science', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'CSE-102', 'title' => 'Programming Fundamentals', 'credits' => 4.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'CSE-201', 'title' => 'Data Structures', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'CSE-202', 'title' => 'Discrete Mathematics', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'CSE-203', 'title' => 'Database Management Systems', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'CSE-301', 'title' => 'Algorithm Design', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'CSE-302', 'title' => 'Operating Systems', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'CSE-303', 'title' => 'Computer Networks', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'CSE-401', 'title' => 'Advanced Algorithms & Complexity', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
                ['code' => 'CSE-402', 'title' => 'Machine Learning', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
            ],
            'EEE' => [
                ['code' => 'EEE-101', 'title' => 'Electrical Engineering Fundamentals', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'EEE-102', 'title' => 'Circuit Analysis I', 'credits' => 4.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'EEE-201', 'title' => 'Circuit Analysis II', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'EEE-202', 'title' => 'Electromagnetics I', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'EEE-203', 'title' => 'Digital Electronics', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'EEE-301', 'title' => 'Power Systems I', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'EEE-302', 'title' => 'Control Systems', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'EEE-303', 'title' => 'Electromagnetics II', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'EEE-401', 'title' => 'Power Systems II', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
                ['code' => 'EEE-402', 'title' => 'Microelectronics', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
            ],
            'CE' => [
                ['code' => 'CE-101', 'title' => 'Engineering Mechanics', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'CE-102', 'title' => 'Surveying I', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'CE-201', 'title' => 'Mechanics of Solids', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'CE-202', 'title' => 'Fluid Mechanics I', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'CE-203', 'title' => 'Building Materials', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'CE-301', 'title' => 'Structural Analysis I', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'CE-302', 'title' => 'Foundation Engineering', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'CE-303', 'title' => 'Hydraulics & Hydrology', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'CE-401', 'title' => 'Structural Design', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
                ['code' => 'CE-402', 'title' => 'Transportation Engineering', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
            ],
            'ME' => [
                ['code' => 'ME-101', 'title' => 'Mechanical Engineering Fundamentals', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'ME-102', 'title' => 'Engineering Thermodynamics I', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'ME-201', 'title' => 'Mechanics of Machines', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'ME-202', 'title' => 'Fluid Mechanics', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'ME-203', 'title' => 'Manufacturing Processes', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'ME-301', 'title' => 'Heat Transfer', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'ME-302', 'title' => 'Control Systems', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'ME-303', 'title' => 'CAD & Design', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'ME-401', 'title' => 'Industrial Engineering', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
                ['code' => 'ME-402', 'title' => 'Advanced Materials', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
            ],
            'BUS' => [
                ['code' => 'BUS-101', 'title' => 'Introduction to Business', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'BUS-102', 'title' => 'Fundamentals of Accounting', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'BUS-201', 'title' => 'Microeconomics', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'BUS-202', 'title' => 'Financial Accounting', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'BUS-203', 'title' => 'Management Principles', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'BUS-301', 'title' => 'Organizational Behavior', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'BUS-302', 'title' => 'Marketing Management', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'BUS-303', 'title' => 'Operations Research', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'BUS-401', 'title' => 'Financial Management', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
                ['code' => 'BUS-402', 'title' => 'Strategic Management', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
            ],
            'MATH' => [
                ['code' => 'MATH-101', 'title' => 'Calculus I', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'MATH-102', 'title' => 'Linear Algebra', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 1],
                ['code' => 'MATH-201', 'title' => 'Calculus II', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'MATH-202', 'title' => 'Differential Equations', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'MATH-203', 'title' => 'Probability & Statistics', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 2],
                ['code' => 'MATH-301', 'title' => 'Real Analysis I', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'MATH-302', 'title' => 'Complex Analysis', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'MATH-303', 'title' => 'Abstract Algebra', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 3],
                ['code' => 'MATH-401', 'title' => 'Real Analysis II', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
                ['code' => 'MATH-402', 'title' => 'Topology', 'credits' => 3.0, 'level' => 'Undergraduate', 'year' => 4],
            ],
        ];

        foreach ($departments as $department) {
            if (isset($courseCatalog[$department->code])) {
                foreach ($courseCatalog[$department->code] as $courseData) {
                    Course::create([
                        'code' => $courseData['code'],
                        'title' => $courseData['title'],
                        'credits' => $courseData['credits'],
                        'department_id' => $department->id,
                        'description' => 'Course: ' . $courseData['title'],
                    ]);
                }
            }
        }
    }
}
