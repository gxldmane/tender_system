<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthLoginRequest;
use App\Http\Requests\Auth\AuthRegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(AuthRegisterRequest $request) {
        $data = $request->validated();

        $user = User::query()->create($data);

        if ($user->role=='customer') {
            $token = $user->createToken('customer', ['customer'])->plainTextToken;
        } else {
            $token = $user->createToken('executor', ['executor'])->plainTextToken;
        }

        return response()->json([
            'data' => $user,
            'token' => $token
        ]);
    }

    public function login(AuthLoginRequest $request) {
        $data = $request->validated();
    }
}
