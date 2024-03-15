<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthLoginRequest;
use App\Http\Requests\Auth\AuthRegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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

        Auth::login($user);

        return response()->json([
            'message' => 'Registration successful',
            'data' => $user,
            'token' => $token
        ]);

    }

    public function login(AuthLoginRequest $request) {

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            return response()->json([
                'message' => 'Login successful',
                'token' => $user->createToken($user->role, [$user->role])->plainTextToken
            ]);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}
