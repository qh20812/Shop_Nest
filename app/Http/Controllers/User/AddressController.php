<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Enums\AdministrativeDivisionLevel;
use App\Models\AdministrativeDivision;
use App\Models\Country;
use App\Models\UserAddress;

class AddressController extends Controller
{
    // 1. Danh sách địa chỉ
    public function index()
    {
        $addresses = Auth::user()->addresses()
            ->with(['province', 'ward', 'country'])
            ->orderByDesc('is_default')
            ->orderBy('created_at')
            ->get()
            ->map(function ($address) {
                return [
                    'id' => $address->id,
                    'name' => $address->full_name,
                    'phone' => $address->phone_number,
                    'address' => $address->street_address,
                    'ward' => $address->ward->name['vi'] ?? '',
                    'district' => '', // Không còn quận/huyện
                    'province' => $address->province->name['vi'] ?? '',
                    'country' => $address->country->name['vi'] ?? 'Việt Nam',
                    'is_default' => $address->is_default,
                ];
            });

        return Inertia::render('Customer/Address/Index', [
            'addresses' => $addresses,
        ]);
    }

    // 2. Form tạo địa chỉ mới
    public function create()
    {
        // Lấy country Việt Nam
        $vietnam = Country::where('iso_code_2', 'VN')->first();
        
        // Lấy danh sách tỉnh/thành phố
        $provinces = AdministrativeDivision::where('country_id', $vietnam->id)
            ->where('level', AdministrativeDivisionLevel::PROVINCE)
            ->orderBy('name->vi')
            ->get(['id', 'name', 'code'])
            ->map(function ($province) {
                return [
                    'id' => $province->id,
                    'name' => $province->name['vi'] ?? $province->name,
                    'code' => $province->code,
                ];
            });

        return Inertia::render('Customer/Address/Create', [
            'provinces' => $provinces,
        ]);
    }

    // 3. Lưu địa chỉ mới
    public function store(Request $request)
    {
        $vietnam = Country::where('iso_code_2', 'VN')->first();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:15',
            'address' => 'required|string|max:255',
            'province_id' => 'required|exists:administrative_divisions,id',
            'ward_id' => 'required|exists:administrative_divisions,id',
            'country' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ]);

        // Nếu đặt làm mặc định, bỏ chọn các địa chỉ khác
        if ($validated['is_default'] ?? false) {
            Auth::user()->addresses()->update(['is_default' => false]);
        }

        // Nếu đây là địa chỉ đầu tiên, tự động đặt làm mặc định
        $isFirstAddress = Auth::user()->addresses()->count() === 0;

        Auth::user()->addresses()->create([
            'country_id' => $vietnam->id,
            'full_name' => $validated['name'],
            'phone_number' => $validated['phone'],
            'street_address' => $validated['address'],
            'province_id' => $validated['province_id'],
            'district_id' => null, // Không còn quận/huyện
            'ward_id' => $validated['ward_id'],
            'postal_code' => null,
            'is_default' => ($validated['is_default'] ?? false) || $isFirstAddress,
        ]);

        return redirect()->route('user.addresses.index')
            ->with('success', 'Thêm địa chỉ mới thành công.');
    }

    // 4. Xem chi tiết địa chỉ
    public function show(UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền truy cập địa chỉ này.');
        }

        $address->load(['province', 'ward', 'country']);

        $addressData = [
            'id' => $address->id,
            'name' => $address->full_name,
            'phone' => $address->phone_number,
            'address' => $address->street_address,
            'ward' => $address->ward->name['vi'] ?? '',
            'district' => '', // Không còn quận/huyện
            'province' => $address->province->name['vi'] ?? '',
            'country' => $address->country->name['vi'] ?? 'Việt Nam',
            'is_default' => $address->is_default,
        ];

        return Inertia::render('Customer/Address/Show', [
            'address' => $addressData,
        ]);
    }

    // 5. Form chỉnh sửa địa chỉ
    public function edit(UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền truy cập địa chỉ này.');
        }

        $vietnam = Country::where('iso_code_2', 'VN')->first();

        // Lấy danh sách tỉnh/thành phố
        $provinces = AdministrativeDivision::where('country_id', $vietnam->id)
            ->where('level', AdministrativeDivisionLevel::PROVINCE)
            ->orderBy('name->vi')
            ->get(['id', 'name', 'code'])
            ->map(function ($province) {
                return [
                    'id' => $province->id,
                    'name' => $province->name['vi'] ?? $province->name,
                    'code' => $province->code,
                ];
            });

        // Lấy danh sách xã/phường thuộc tỉnh đã chọn
        $wards = [];
        if ($address->province_id) {
            $wards = AdministrativeDivision::where('parent_id', $address->province_id)
                ->where('level', AdministrativeDivisionLevel::WARD)
                ->orderBy('name->vi')
                ->get(['id', 'name', 'code'])
                ->map(function ($ward) {
                    return [
                        'id' => $ward->id,
                        'name' => $ward->name['vi'] ?? $ward->name,
                        'code' => $ward->code,
                    ];
                });
        }

        $addressData = [
            'id' => $address->id,
            'name' => $address->full_name,
            'phone' => $address->phone_number,
            'address' => $address->street_address,
            'province_id' => $address->province_id,
            'ward_id' => $address->ward_id,
            'country' => $address->country->name['vi'] ?? 'Việt Nam',
            'is_default' => $address->is_default,
        ];

        return Inertia::render('Customer/Address/Edit', [
            'address' => $addressData,
            'provinces' => $provinces,
            'districts' => [], // Không còn quận/huyện
            'wards' => $wards,
        ]);
    }

    // 6. Cập nhật địa chỉ
    public function update(Request $request, UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền truy cập địa chỉ này.');
        }

        $vietnam = Country::where('iso_code_2', 'VN')->first();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:15',
            'address' => 'required|string|max:255',
            'province_id' => 'required|exists:administrative_divisions,id',
            'ward_id' => 'required|exists:administrative_divisions,id',
            'country' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ]);

        // Nếu đặt làm mặc định, bỏ chọn các địa chỉ khác
        if ($validated['is_default'] ?? false) {
            Auth::user()->addresses()
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update([
            'country_id' => $vietnam->id,
            'full_name' => $validated['name'],
            'phone_number' => $validated['phone'],
            'street_address' => $validated['address'],
            'province_id' => $validated['province_id'],
            'district_id' => null, // Không còn quận/huyện
            'ward_id' => $validated['ward_id'],
            'postal_code' => null,
            'is_default' => $validated['is_default'] ?? false,
        ]);

        return redirect()->route('user.addresses.index')
            ->with('success', 'Cập nhật địa chỉ thành công.');
    }

    // 7. Xóa địa chỉ
    public function destroy(UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền truy cập địa chỉ này.');
        }

        // Nếu xóa địa chỉ mặc định, tự động đặt địa chỉ khác làm mặc định
        if ($address->is_default) {
            $nextAddress = Auth::user()->addresses()
                ->where('id', '!=', $address->id)
                ->orderBy('created_at')
                ->first();

            if ($nextAddress) {
                $nextAddress->update(['is_default' => true]);
            }
        }

        $address->delete();

        return redirect()->route('user.addresses.index')
            ->with('success', 'Xóa địa chỉ thành công.');
    }

    // 8. Đặt làm địa chỉ mặc định
    public function setDefault(UserAddress $address)
    {
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền truy cập địa chỉ này.');
        }

        // Bỏ chọn tất cả địa chỉ mặc định
        Auth::user()->addresses()->update(['is_default' => false]);
        
        // Đặt địa chỉ hiện tại làm mặc định
        $address->update(['is_default' => true]);

        return redirect()->back()
            ->with('success', 'Đã đặt làm địa chỉ mặc định.');
    }

    // 9. API: Lấy danh sách quốc gia (giới hạn theo DB hiện có)
    public function countries()
    {
        $countries = Country::orderBy('name->vi')
            ->get(['id', 'name', 'iso_code_2']);

        return response()->json(
            $countries->map(function ($country) {
                return [
                    'id' => $country->id,
                    'name' => $country->name['vi'] ?? $country->name,
                    'code' => $country->iso_code_2,
                ];
            })
        );
    }

    // 10. API: Lấy danh sách tỉnh/thành phố theo quốc gia
    public function provinces($countryId)
    {
        $provinces = AdministrativeDivision::where('country_id', $countryId)
            ->where('level', AdministrativeDivisionLevel::PROVINCE)
            ->orderBy('name->vi')
            ->get(['id', 'name', 'code']);

        return response()->json(
            $provinces->map(function ($province) {
                return [
                    'id' => $province->id,
                    'name' => $province->name['vi'] ?? $province->name,
                    'code' => $province->code,
                ];
            })
        );
    }

    // 11. API: Lấy danh sách xã/phường theo tỉnh
    public function wards($provinceId)
    {
        $wards = AdministrativeDivision::where('parent_id', $provinceId)
            ->where('level', AdministrativeDivisionLevel::WARD)
            ->orderBy('name->vi')
            ->get(['id', 'name', 'code']);

        return response()->json(
            $wards->map(function ($ward) {
                return [
                    'id' => $ward->id,
                    'name' => $ward->name['vi'] ?? $ward->name,
                    'code' => $ward->code,
                ];
            })
        );
    }
}
