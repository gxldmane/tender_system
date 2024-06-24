<?php

namespace App\Services;

use App\Http\Requests\Auth\AuthLoginRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;

class AuthService
{

    public function register(array $data): array
    {
        $user = User::query()->create($data);

        if ($user->role == 'customer') {
            $token = $user->createToken('customer', ['customer'])->plainTextToken;
        } else {
            $token = $user->createToken('executor', ['executor'])->plainTextToken;
        }

        Auth::login($user);

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function login(AuthLoginRequest $request): User|Authenticatable|null
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return Auth::user();
        }

        return null;
    }

}
