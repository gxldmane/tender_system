<?php

namespace Database\Factories;

use App\Models\Tender;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\File>
 */
class FileFactory extends Factory
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
            'url' => $this->faker->url
        ];
    }
}
