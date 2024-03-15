<?php

namespace App\Policies;

use App\Models\Tender;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TenderPolicy
{
    public function viewAny(User $user) {
        return true;
    }

    public function view(User $user) {
        return true;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, Tender $tender)
    {
        return $tender->customer_id === $user->id
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function delete(User $user, Tender $tender)
    {
        return $tender->customer_id === $user->id
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
