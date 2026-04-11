<?php

namespace Database\Seeders;

use App\Models\CourseOffering;
use App\Models\Course;
use App\Models\Semester;
use App\Models\Teacher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class CourseOfferingSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Create course sections with teacher assignments and schedules
     */
    public function run(): void
    {
        $faker = Faker::create();
        $courses = Course::all();
        $semesters = Semester::whereIn('status', ['active', 'completed', 'planned'])->get();
        $teachers = Teacher::all();

        $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $times = ['09:00', '10:00', '11:00', '01:00', '02:00', '03:00', '04:00'];
        $sections = ['A', 'B', 'C', 'D'];
        $rooms = ['102', '201', '202', '203', '301', '302', '303', '304', '401', '402', '403'];

        foreach ($courses as $course) {
            // Create 1-2 random semesters for this course
            $numSemesters = min($semesters->count(), rand(1, 2));
            $selectedSemesters = $semesters->random($numSemesters);
            
            foreach ($selectedSemesters as $semester) {
                $teacher = $teachers->random();
                
                for ($sectionIdx = 0; $sectionIdx < 2; $sectionIdx++) {
                    CourseOffering::create([
                        'course_id' => $course->id,
                        'semester_id' => $semester->id,
                        'teacher_id' => $teacher->id,
                        'section' => $sections[$sectionIdx],
                        'room_number' => $rooms[array_rand($rooms)],
                        'class_time' => $times[array_rand($times)] . ' - ' . ($times[array_rand($times)]),
                        'day_of_week' => $daysOfWeek[array_rand($daysOfWeek)],
                        'enrollment_limit' => $faker->randomElement([40, 45, 50, 55]),
                        'current_enrollment' => $faker->randomElement([30, 35, 40, 42, 45]),
                    ]);
                }
            }
        }
    }
}
