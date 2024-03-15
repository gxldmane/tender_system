<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use App\Models\Bid;
use App\Models\Tender;
use App\Policies\BidPolicy;
use App\Policies\TenderPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Tender::class => TenderPolicy::class,

    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
