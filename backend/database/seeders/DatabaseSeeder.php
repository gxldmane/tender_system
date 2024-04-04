<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Bid;
use App\Models\Category;
use App\Models\Company;
use App\Models\File;
use App\Models\Region;
use App\Models\Tender;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Company::factory(20)->create();
        User::factory(5)->create();
        Category::factory(10)->create();
        Region::factory(25)->create();
        Tender::factory(80)->create();
        File::factory(25)->create();
        Bid::factory(130)->create();
    }
}
