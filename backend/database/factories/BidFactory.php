<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Tender;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bid>
 */
class BidFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tender_id' => Tender::query()->inRandomOrder()->first()->id,
            'company_id' => Company::query()->inRandomOrder()->first()->id,
            'user_id' => User::query()->inRandomOrder()->first()->id,
            'price' => $this->faker->randomElement([1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]),
            'status' => $this->faker->randomElement(['pending', 'accepted', 'rejected']),
        ];

    }
}
