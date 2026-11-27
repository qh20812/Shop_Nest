<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Hiển thị danh sách người dùng với bộ lọc và tìm kiếm.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'role', 'status']);
        $totalUsers = User::count();

        $users = User::query()
            ->with('roles') // Eager load roles để tránh N+1 query
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                });
            })
            ->when($request->input('role'), function ($query, $role) {
                // Lọc theo vai trò (role) - query JSON column based on current locale
                $query->whereHas('roles', fn ($q) => $q->where('name->'.app()->getLocale(), $role));
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                // Lọc theo trạng thái (active/inactive)
                $query->where('is_active', $request->boolean('status'));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString(); // Giữ lại các tham số filter khi chuyển trang

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => Role::all()->map->name, // Map over collection to get translated role names for current locale
            'totalUsers' => $totalUsers,
            'filters' => $filters,
        ]);
    }

    /**
     * Hiển thị form chỉnh sửa thông tin người dùng.
     */
    public function edit(User $user)
    {
        // Tải thông tin roles của user và tất cả roles có trong hệ thống
        $user->load('roles');
        $roles = Role::all();

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Cập nhật thông tin người dùng.
     */
    public function update(Request $request, User $user)
    {
        $isSelf = $user->id === Auth::id();

        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ];

        // Tự sửa mình chỉ được đổi thông tin cá nhân, không được đổi quyền truy cập.
        if (! $isSelf) {
            $rules['is_active'] = 'required|boolean';
            $rules['role_id'] = 'required|integer|exists:roles,id';
        }

        $validated = $request->validate($rules);

        if ($isSelf) {
            $currentRoleId = $user->roles()->value('roles.id');

            if ($request->filled('role_id') && (int) $request->input('role_id') !== (int) $currentRoleId) {
                abort(403, 'Bạn không thể thay đổi vai trò của chính mình.');
            }

            if ($request->filled('is_active') && $request->boolean('is_active') !== $user->is_active) {
                abort(403, 'Bạn không thể thay đổi trạng thái của chính mình.');
            }
        }

        $attributes = [
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
        ];

        if (! $isSelf) {
            $attributes['is_active'] = $validated['is_active'];
        }

        $user->update($attributes);

        if (! $isSelf) {
            $user->roles()->sync([$validated['role_id']]);
        }

        return redirect()->route('admin.users.index')->with('success', 'Cập nhật người dùng thành công.');
    }

    /**
     * Toggle user status (activate/deactivate).
     */
    public function destroy(User $user)
    {
        // Ngăn admin tự thay đổi trạng thái chính mình
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Bạn không thể thay đổi trạng thái tài khoản của chính mình.');
        }

        // Toggle user status
        $newStatus = ! $user->is_active;
        $user->update(['is_active' => $newStatus]);

        $message = $newStatus
            ? 'Kích hoạt người dùng thành công.'
            : 'Vô hiệu hoá người dùng thành công.';

        return redirect()->route('admin.users.index')->with('success', $message);
    }
}
