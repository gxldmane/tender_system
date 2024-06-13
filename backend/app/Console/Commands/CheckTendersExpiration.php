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

    public function handle(): void
    {
        $tenders = Tender::where('until_date', '<=', Carbon::now())
            ->whereNotIn('status', ['pending', 'closed'])
            ->get();

        if ($tenders->count() === 0) {
            $this->info('No tenders found to be expired.');
            return;
        }

        foreach ($tenders as $tender) {
            $tender->status = 'pending';
            $tender->save();

            $user = $tender->customer;
            $user->notify(new TenderClosed($tender));
        }

        $this->info('Tenders expiration checked and updated successfully.');
    }
}
