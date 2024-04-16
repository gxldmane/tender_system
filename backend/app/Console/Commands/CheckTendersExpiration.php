<?php

namespace App\Console\Commands;

use App\Notifications\TenderClosed;
use Illuminate\Console\Command;
use App\Models\Tender;
use Carbon\Carbon;

class CheckTendersExpiration extends Command
{
    protected $signature = 'tenders:check-expiration';

    protected $description = 'Check tenders expiration and update their status';

    public function handle()
    {
        $tenders = Tender::where('until_date', '<', Carbon::now())->get();

        foreach ($tenders as $tender) {
            $tender->status = 'pending';
            $tender->save();

            $user = $tender->customer()->first();
            $user->notify(new TenderClosed($tender));
        }

        $this->info('Tenders expiration checked and updated successfully.');
    }
}
