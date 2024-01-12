<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $usersData = [
            ['name' => 'Nihal', 'email' => 'nihal@gmail.com', 'password' => 'nihal@123'],
            ['name' => 'Appu', 'email' => 'appu@gmail.com', 'password' => 'appu@123'],
            ['name' => 'Ammue', 'email' => 'ammu@gmail.com', 'password' => 'ammu@123'],
        ];

        foreach ($usersData as $userData) {
            User::create($userData);
        }
    }
}
