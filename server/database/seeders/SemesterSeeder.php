<?php

namespace Database\Seeders;

use App\Models\Semester;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SemesterSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Create semesters for current and previous years
     */
    public function run(): void
    {
        $semesters = [
            // Current/Recent semesters
            [
                'name' => 'Fall 2024',
                'code' => 'FALL-2024',
                'start_date' => Carbon::create(2024, 8, 15)->format('Y-m-d'),
                'end_date' => Carbon::create(2024, 12, 20)->format('Y-m-d'),
                'status' => 'active',
            ],
            [
                'name' => 'Spring 2024',
                'code' => 'SPRING-2024',
                'start_date' => Carbon::create(2024, 1, 16)->format('Y-m-d'),
                'end_date' => Carbon::create(2024, 5, 25)->format('Y-m-d'),
                'status' => 'completed',
            ],
            [
                'name' => 'Summer 2023',
                'code' => 'SUMMER-2023',
                'start_date' => Carbon::create(2023, 6, 1)->format('Y-m-d'),
                'end_date' => Carbon::create(2023, 7, 31)->format('Y-m-d'),
                'status' => 'completed',
            ],
            [
                'name' => 'Fall 2023',
                'code' => 'FALL-2023',
                'start_date' => Carbon::create(2023, 8, 15)->format('Y-m-d'),
                'end_date' => Carbon::create(2023, 12, 20)->format('Y-m-d'),
                'status' => 'completed',
            ],
            [
                'name' => 'Spring 2023',
                'code' => 'SPRING-2023',
                'start_date' => Carbon::create(2023, 1, 16)->format('Y-m-d'),
                'end_date' => Carbon::create(2023, 5, 25)->format('Y-m-d'),
                'status' => 'completed',
            ],
            // Future semesters
            [
                'name' => 'Spring 2025',
                'code' => 'SPRING-2025',
                'start_date' => Carbon::create(2025, 1, 15)->format('Y-m-d'),
                'end_date' => Carbon::create(2025, 5, 30)->format('Y-m-d'),
                'status' => 'planned',
            ],
        ];

        foreach ($semesters as $semester) {
            Semester::create($semester);
        }
    }
}
