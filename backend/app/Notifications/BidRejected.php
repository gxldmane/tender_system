<?php

namespace App\Notifications;

use App\Models\Bid;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BidRejected extends Notification
{
    use Queueable;

    protected $bid;

    public function __construct(Bid $bid)
    {
        $this->bid = $bid;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'bid_id' => $this->bid->id,
            'message' => "Ваша заявка на тендер {$this->bid->tender->name} была отклонена",
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'bid_rejected';
    }
}
