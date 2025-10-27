<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * Quyền xem danh sách sản phẩm (index).
     */
    public function viewAny(User $user): bool
    {
        // Chỉ cần người dùng đã đăng nhập và route được bảo vệ cho Seller
        return true;
    }

    /**
     * Quyền xem chi tiết một sản phẩm (show, edit).
     */
    public function view(User $user, Product $product): bool
    {
        return $user->id === $product->seller_id;
    }

    /**
     * Quyền tạo sản phẩm mới (create, store).
     */
    public function create(User $user): bool
    {
        // Chỉ cần người dùng đã đăng nhập và route được bảo vệ cho Seller
        return true;
    }

    /**
     * Quyền cập nhật sản phẩm (update).
     */
    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->seller_id;
    }

    /**
     * Quyền xóa sản phẩm (destroy).
     */
    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->seller_id;
    }

    /**
     * Quyền khôi phục sản phẩm đã xóa mềm (restore).
     */
    public function restore(User $user, Product $product): bool
    {
        return $user->id === $product->seller_id;
    }
}

