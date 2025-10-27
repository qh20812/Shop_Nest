<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\UserAddress;

class AddressController extends Controller
{
    // 1. Danh sách địa chỉ
    public function index()
    {
        $addresses = Auth::user()->addresses()
            ->orderByDesc('is_default')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('User/Dashboard/Addresses/Index', [
            'addresses' => $addresses,
        ]);
    }

    // 2. Form tạo địa chỉ mới
    public function create()
    {
        return Inertia::render('User/Dashboard/Addresses/Create');
    }

    // 3. Lưu địa chỉ mới
    public function store(Request $request)
    {
        $rules = [
            'recipient_name' => 'required|string|max:100',// Tên người nhận
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:15',// Số điện thoại
            'address_line' => 'required|string|max:255',// Địa chỉ chi tiết
            'province_id' => 'required|exists:administrative_divisions,id',// ID tỉnh
            'district_id' => 'required|exists:administrative_divisions,id',// ID quận
            'ward_id' => 'required|exists:administrative_divisions,id',// ID phường
            'postal_code' => 'nullable|string|max:10',// Mã bưu chính
            'is_default' => 'boolean',// Địa chỉ mặc định
        ];
        $validated = $request->validate($rules);

        if ($request->is_default) {
            Auth::user()->addresses()->update(['is_default' => false]);
        }

        Auth::user()->addresses()->create([
            'recipient_name' => $validated['recipient_name'],// Tên người nhận
            'phone' => $validated['phone'],// Số điện thoại
            'address_line' => $validated['address_line'],// Địa chỉ chi tiết
            'province_id' => $validated['province_id'],// ID tỉnh
            'district_id' => $validated['district_id'],// ID quận
            'ward_id' => $validated['ward_id'],// ID phường
            'postal_code' => $validated['postal_code'] ?? null,
            'is_default' => $validated['is_default'] ?? false,
        ]);

        return redirect()->route('dashboard.addresses.index')// Quay lại danh sách địa chỉ
            ->with('success', 'Address created successfully.');// Thông báo thành công
    }

    // 4. Xem chi tiết địa chỉ
    public function show(UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to address.');// Kiểm tra quyền truy cập
        }

        return Inertia::render('User/Dashboard/Addresses/Show', [
            'address' => $address,
        ]);// Hiển thị chi tiết địa chỉ
    }

    // 5. Form chỉnh sửa địa chỉ
    public function edit(UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
abort(403);// Kiểm tra quyền truy cập
        }

        return Inertia::render('User/Dashboard/Addresses/Edit', [
            'address' => $address,
        ]);// Hiển thị form chỉnh sửa địa chỉ
    }

    // 6. Cập nhật địa chỉ
    public function update(Request $request, UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }// Kiểm tra quyền truy cập

        $rules = [
            'recipient_name' => 'required|string|max:100',// Tên người nhận
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:15',// Số điện thoại
            'address_line' => 'required|string|max:255',// Địa chỉ chi tiết
            'province_id' => 'required|exists:administrative_divisions,id',// ID tỉnh
            'district_id' => 'required|exists:administrative_divisions,id',// ID quận
            'ward_id' => 'required|exists:administrative_divisions,id',// ID phường
            'postal_code' => 'nullable|string|max:10',// Mã bưu chính
            'is_default' => 'boolean',// Địa chỉ mặc định
        ];
        $validated = $request->validate($rules);

        if ($request->is_default && !$address->is_default) {
            Auth::user()->addresses()->update(['is_default' => false]);
        }// Nếu đặt làm mặc định, bỏ chọn các địa chỉ khác

        $address->update([
            'recipient_name' => $validated['recipient_name'],// Tên người nhận
            'phone' => $validated['phone'],// Số điện thoại
            'address_line' => $validated['address_line'],// Địa chỉ chi tiết
            'province_id' => $validated['province_id'],// ID tỉnh
            'district_id' => $validated['district_id'],// ID quận
            'ward_id' => $validated['ward_id'],// ID phường
            'postal_code' => $validated['postal_code'] ?? null,// Mã bưu chính
            'is_default' => $validated['is_default'] ?? false,// Địa chỉ mặc định
        ]);

        return redirect()->route('dashboard.addresses.index')// Quay lại danh sách địa chỉ
            ->with('success', 'Address updated successfully.');// Thông báo thành công
    }

    // 7. Xóa địa chỉ
    public function destroy(UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }// Kiểm tra quyền truy cập

        if ($address->is_default) {
            $otherAddresses = Auth::user()->addresses()
                ->where('id', '!=', $address->id)
                ->get();// Lấy các địa chỉ khác của người dùng

            if ($otherAddresses->count() > 0) {
                $otherAddresses->first()->update(['is_default' => true]);
            }// Nếu có địa chỉ khác, đặt địa chỉ đầu tiên làm mặc định
        }

        $address->delete();// Xóa địa chỉ

        return redirect()->route('dashboard.addresses.index')// Quay lại danh sách địa chỉ
->with('success', 'Address deleted successfully.');// Thông báo thành công
    }

    // 8. Đặt làm địa chỉ mặc định
    public function setDefault(UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }// Kiểm tra quyền truy cập

        Auth::user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);// Đặt địa chỉ hiện tại làm mặc định

        return redirect()->back()
            ->with('success', 'Default address updated successfully.');
    }// Đặt địa chỉ làm mặc định
}