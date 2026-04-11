<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds - Create 5-6 admins, 50-60 teachers, 250-300 students
     */
    public function run(): void
    {
        $faker = Faker::create();

        // ============ CREATE ADMIN USERS (5-6) ============
        $adminNames = [
            ['Robert', 'Fox'],
            ['Julianna', 'Dawson'],
            ['Sarah', 'Mitchell'],
            ['James', 'Anderson'],
            ['Patricia', 'Thompson'],
            ['Michael', 'Garcia'],
        ];

        foreach ($adminNames as $idx => $name) {
            User::create([
                'first_name' => $name[0],
                'last_name' => $name[1],
                'email' => strtolower($name[0]) . '.admin' . ($idx + 1) . '@iums.edu',
                'password' => Hash::make('admin@123'),
                'role' => 'admin',
                'status' => 'active',
                'phone_number' => $faker->phoneNumber(),
                'date_of_birth' => $faker->dateTimeBetween('-60 years', '-30 years')->format('Y-m-d'),
                'gender' => $faker->randomElement(['M', 'F']),
                'blood_group' => $faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                'religion' => $faker->randomElement(['Islam', 'Hinduism', 'Buddhism', 'Christianity', 'Other']),
                'profile_image_url' => 'https://i.pravatar.cc/150?u=' . $name[0] . $name[1],
            ]);
        }

        // ============ CREATE TEACHER USERS (50-60) ============
        $firstNames = ['Arthur', 'Alexander', 'Benjamin', 'Charles', 'David', 'Edward', 'Frederick', 'George', 'Henry', 'Jack',
            'James', 'Joseph', 'Lawrence', 'Michael', 'Nathan', 'Oliver', 'Patrick', 'Quentin', 'Richard', 'Samuel',
            'Thomas', 'Victor', 'William', 'Xavier', 'Yuri', 'Zachary', 'Alice', 'Betty', 'Catherine', 'Diana',
            'Eleanor', 'Fiona', 'Grace', 'Helen', 'Iris', 'Jennifer', 'Katherine', 'Laura', 'Margaret', 'Nancy',
            'Olivia', 'Patricia', 'Quinn', 'Rachel', 'Sandra', 'Teresa', 'Ursula', 'Victoria', 'Wendy', 'Xenia',
            'Yasmine', 'Zoe'];

        $lastNames = ['Henderson', 'Lewis', 'Walker', 'Young', 'Hernandez', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson',
            'White', 'Harris', 'Martin', 'Lee', 'Perez', 'Thompson', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];

        $numTeachers = 55;
        for ($i = 0; $i < $numTeachers; $i++) {
            $firstName = $firstNames[$i % count($firstNames)];
            $lastName = $lastNames[$i % count($lastNames)];
            
            User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => strtolower($firstName) . '.' . strtolower($lastName) . '@iums.edu',
                'password' => Hash::make('teacher@123'),
                'role' => 'teacher',
                'status' => $faker->randomElement(['active', 'active', 'active', 'inactive']),
                'phone_number' => $faker->phoneNumber(),
                'date_of_birth' => $faker->dateTimeBetween('-65 years', '-30 years')->format('Y-m-d'),
                'gender' => $faker->randomElement(['M', 'F']),
                'blood_group' => $faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                'religion' => $faker->randomElement(['Islam', 'Hinduism', 'Buddhism', 'Christianity', 'Other']),
                'profile_image_url' => 'https://i.pravatar.cc/150?u=' . $firstName . $lastName,
            ]);
        }

        // ============ CREATE STUDENT USERS (250-300) ============
        $numStudents = 280;
        $studentFirstNames = ['Ahsan', 'Adrian', 'Aaron', 'Albert', 'Andrew', 'Anthony', 'Austin', 'Adam', 'Amir', 'Amelia',
            'Ava', 'Aurora', 'Anna', 'Amanda', 'Abigail', 'Bailey', 'Blake', 'Brandon', 'Brian', 'Barry',
            'Benjamin', 'Bernard', 'Bruce', 'Boris', 'Bradley', 'Bradley', 'Brooklyn', 'Briana', 'Brooke', 'Brittany',
            'Bella', 'Brianna', 'Beatrice', 'Bethany', 'Beverly', 'Caroline', 'Catherine', 'Caleb', 'Cameron', 'Carl',
            'Calvin', 'Camille', 'Cecilia', 'Charlotte', 'Claire', 'Chloe', 'Christina', 'Cristina', 'Claudia', 'Cassandra'];

        $studentLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
            'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
            'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
            'Young', 'Flores', 'Green', 'Nelson', 'Carter', 'Merritt', 'Harrington', 'Dalton', 'Abbott', 'Kemp',
            'Knight', 'Knowles', 'Knox', 'Koch', 'Koen', 'Koerner', 'Kohl', 'Kohler', 'Kohler', 'Kohler'];

        for ($i = 0; $i < $numStudents; $i++) {
            $firstName = $studentFirstNames[$i % count($studentFirstNames)];
            $lastName = $studentLastNames[$i % count($studentLastNames)];
            $studentEmail = strtolower(substr($firstName, 0, 1) . $lastName . ($i + 1)) . '@iums.edu';

            User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $studentEmail,
                'password' => Hash::make('student@123'),
                'role' => 'student',
                'status' => $faker->randomElement(['active', 'active', 'active', 'inactive']),
                'phone_number' => $faker->phoneNumber(),
                'date_of_birth' => $faker->dateTimeBetween('-24 years', '-17 years')->format('Y-m-d'),
                'gender' => $faker->randomElement(['M', 'F', 'Other']),
                'blood_group' => $faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                'religion' => $faker->randomElement(['Islam', 'Hinduism', 'Buddhism', 'Christianity', 'Other']),
                'profile_image_url' => 'https://i.pravatar.cc/150?u=' . $firstName . $lastName,
            ]);
        }
    }
}

