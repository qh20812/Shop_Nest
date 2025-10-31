<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Customer/Profile/Index', [
            'user' => $this->presentUser($user),
        ]);
    }

    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Customer/Profile/Edit', [
            'user' => $this->presentUser($user),
        ]);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $data = $request->validated();

        $data['gender'] = $data['gender'] ?? null;
        $data['date_of_birth'] = $data['date_of_birth'] ?? null;
        $data['phone_number'] = $data['phone_number'] ?? null;

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');

            if ($user->avatar && !filter_var($user->avatar, FILTER_VALIDATE_URL) && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
        }

        $user->fill(Arr::except($data, ['avatar']));

        if ($avatarPath !== null) {
            $user->avatar = $avatarPath;
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('user.profile.edit')->with('success', 'Thông tin cá nhân đã được cập nhật thành công.');
    }

    private function presentUser(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'gender' => $user->gender,
            'date_of_birth' => $user->date_of_birth?->toDateString(),
            'avatar' => $user->avatar,
            'avatar_url' => $user->avatar_url,
        ];
    }
}
