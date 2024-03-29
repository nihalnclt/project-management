<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projectsData = [
            ['name' => 'Project 1', 'description' => 'Test Description', 'owner' => 1],
            ['name' => 'Project 2', 'description' => 'Test Description', 'owner' => 1],
        ];

        foreach ($projectsData as $projectData) {
            Project::create($projectData);
        }
    }
}
