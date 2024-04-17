<?php

namespace App\Notifications;

use App\Models\Tender;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TenderClosed extends Notification
{
    use Queueable;

    protected $tender;

    public function __construct(Tender $tender)
    {
        $this->tender = $tender;
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
            'tender_id' => $this->tender->id,
            'message' => "Подача заявок на тендер {$this->tender->name} окончена. Выберите исполнителя.",
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'tender_closed';
    }
}
