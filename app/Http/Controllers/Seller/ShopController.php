<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Shop;

class ShopController extends Controller
{
    // Hiển thị form cập nhật thông tin gian hàng
    public function edit()
    {
        $sellerId = Auth::id();
        $shop = Shop::where('owner_id', $sellerId)->firstOrFail();

        return Inertia::render('Seller/Shop/Edit', [
            'shop' => $shop
        ]);
    }

    // Lưu thông tin cập nhật của gian hàng
    public function update(Request $request)
    {
        $sellerId = Auth::id();
        $shop = Shop::where('owner_id', $sellerId)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'banner' => 'nullable|image|max:2048',
            'logo' => 'nullable|image|max:1024',
        ]);

        // Xử lý upload banner nếu có
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('shop_banners', 'public');
            $shop->banner = $bannerPath;
        }

        // Xử lý upload logo nếu có
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('shop_logos', 'public');
            $shop->logo = $logoPath;
        }

        $shop->name = $validated['name'];
        $shop->description = array_key_exists('description', $validated) ? $validated['description'] : null;
        $shop->save();

        return redirect()->back()->with('success', 'Cập nhật thông tin gian hàng thành công!');
    }
}
