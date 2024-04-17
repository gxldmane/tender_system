<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Region;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tender>
 */
class TenderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->sentence(5),
            'start_price' => $this->faker->numberBetween(100, 1000),
            'category_id' => Category::query()->inRandomOrder()->first()->id,
            'region_id' => Region::query()->inRandomOrder()->first()->id,
            'status' => $this->faker->randomElement(['active', 'pending']),
            'customer_id' => User::query()->inRandomOrder()->first()->id,
            'executor_id' => User::query()->inRandomOrder()->first()->id,
            'until_date' => $this->faker->date('Y-m-d', 'now'),
        ];
    }
}
