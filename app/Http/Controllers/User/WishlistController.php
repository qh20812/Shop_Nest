<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['action' => 'login_required', 'redirect' => route('login')], 401);
        }

        $wishlist = $user->defaultWishlist();
        if (!$wishlist) {
            return response()->json(['items' => []]);
        }

        $items = $wishlist->wishlistItems()->with('product')->get();
        $productIds = $items->pluck('product_id')->toArray();

        return response()->json(['items' => $productIds]);
    }

    public function store(Request $request, $productId): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['action' => 'login_required', 'redirect' => route('login')], 401);
        }

        $product = Product::where('product_id', $productId)->first();
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $wishlist = $user->defaultWishlist();
        if (!$wishlist) {
            $wishlist = Wishlist::create(['user_id' => $user->id, 'name' => 'My Wishlist', 'is_default' => true]);
        }

        // prevent duplicates
        $existing = WishlistItem::where('wishlist_id', $wishlist->id)->where('product_id', $product->product_id)->exists();
        if ($existing) {
            return response()->json(['success' => true, 'message' => 'Already in wishlist']);
        }

        $item = WishlistItem::create([
            'wishlist_id' => $wishlist->id,
            'product_id' => $product->product_id,
            'price_when_added' => $product->min_price ?? null,
        ]);

        // increment items_count (basic)
        $wishlist->increment('items_count');

        return response()->json(['success' => true, 'message' => 'Added to wishlist', 'product_id' => $product->product_id]);
    }

    public function destroy(Request $request, $productId): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['action' => 'login_required', 'redirect' => route('login')], 401);
        }

        $wishlist = $user->defaultWishlist();
        if (!$wishlist) {
            return response()->json(['success' => false, 'message' => 'Wishlist not found'], 404);
        }

        $deleted = WishlistItem::where('wishlist_id', $wishlist->id)->where('product_id', $productId)->delete();
        if ($deleted) {
            $wishlist->decrement('items_count');
            return response()->json(['success' => true, 'message' => 'Removed from wishlist']);
        }

        return response()->json(['success' => false, 'message' => 'Item not found in wishlist'], 404);
    }
}
