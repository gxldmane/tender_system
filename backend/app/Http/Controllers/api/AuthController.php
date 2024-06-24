<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthLoginRequest;
use App\Http\Requests\Auth\AuthRegisterRequest;
use App\Http\Resources\api\User\UserResource;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public AuthService $service;

    public function __construct(AuthService $service)
    {
        $this->service = $service;
    }

    public function register(AuthRegisterRequest $request)
    {
        $data = $request->validated();

        $data = $this->service->register($data);

        return response()->json([
            'message' => 'Registration successful',
            'data' => [
                'user' => new UserResource($data['user']),
                'token' => $data['token']
            ],
        ]);

    }

    public function login(AuthLoginRequest $request)
    {
        $user = $this->service->login($request);

        if ($user) {
            return response()->json([
                'message' => 'Login successful',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $user->createToken($user->role, [$user->role])->plainTextToken
                ],
            ]);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}
