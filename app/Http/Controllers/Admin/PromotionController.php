<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePromotionRequest;
use App\Http\Requests\Admin\UpdatePromotionRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    /**
     * Display a paginated list of all promotions.
     */
    public function index(): Response
    {
        $promotions = Promotion::select([
                'promotion_id',
                'name',
                'type',
                'value',
                'start_date',
                'end_date',
                'usage_limit',
                'used_count',
                'is_active'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => $promotions
        ]);
    }

    /**
     * Show the form for creating a new promotion.
     */
    public function create(): Response
    {
        $products = Product::select('id', 'name', 'sku', 'price')
            ->orderBy('name')
            ->get();

        $categories = Category::select('id', 'name')
            ->whereNull('parent_id') // Only parent categories for simplicity
            ->orderBy('name')
            ->get();

        $promotionTypes = [
            'percentage' => 'Percentage Discount',
            'fixed_amount' => 'Fixed Amount Discount',
            'free_shipping' => 'Free Shipping',
            'buy_x_get_y' => 'Buy X Get Y'
        ];

        return Inertia::render('Admin/Promotions/Create', [
            'products' => $products,
            'categories' => $categories,
            'promotionTypes' => $promotionTypes
        ]);
    }

    /**
     * Store a newly created promotion in storage.
     */
    public function store(StorePromotionRequest $request): RedirectResponse
    {
        try {
            DB::transaction(function () use ($request) {
                // Create the main promotion record
                $promotion = Promotion::create([
                    'name' => $request->name,
                    'description' => $request->description,
                    'type' => $request->type,
                    'value' => $request->value,
                    'min_order_amount' => $request->minimum_order_value,
                    'max_discount_amount' => $request->max_discount_amount,
                    'start_date' => $request->starts_at,
                    'end_date' => $request->expires_at,
                    'usage_limit' => $request->usage_limit_per_user,
                    'used_count' => 0,
                    'is_active' => $request->boolean('is_active', true)
                ]);

                // Handle product conditions (many-to-many relationship)
                if ($request->filled('product_ids') && is_array($request->product_ids)) {
                    // Check if the pivot table exists
                    if (DB::getSchemaBuilder()->hasTable('promotion_products')) {
                        $promotion->products()->sync($request->product_ids);
                    }
                }

                // Handle category conditions (many-to-many relationship)
                if ($request->filled('category_ids') && is_array($request->category_ids)) {
                    // Check if the pivot table exists
                    if (DB::getSchemaBuilder()->hasTable('promotion_categories')) {
                        $promotion->categories()->sync($request->category_ids);
                    }
                }
            });

            return redirect()->route('admin.promotions.index')
                ->with('success', 'Promotion created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create promotion. Please try again.');
        }
    }

    /**
     * Display the specified promotion.
     */
    public function show(Promotion $promotion): Response
    {
        $promotion->load(['products:id,name,sku', 'categories:id,name']);

        return Inertia::render('Admin/Promotions/Show', [
            'promotion' => $promotion
        ]);
    }

    /**
     * Show the form for editing the specified promotion.
     */
    public function edit(Promotion $promotion): Response
    {
        $promotion->load(['products:id,name,sku', 'categories:id,name']);

        $products = Product::select('id', 'name', 'sku', 'price')
            ->orderBy('name')
            ->get();

        $categories = Category::select('id', 'name')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();

        $promotionTypes = [
            'percentage' => 'Percentage Discount',
            'fixed_amount' => 'Fixed Amount Discount',
            'free_shipping' => 'Free Shipping',
            'buy_x_get_y' => 'Buy X Get Y'
        ];

        return Inertia::render('Admin/Promotions/Edit', [
            'promotion' => $promotion,
            'products' => $products,
            'categories' => $categories,
            'promotionTypes' => $promotionTypes
        ]);
    }

    /**
     * Update the specified promotion in storage.
     */
    public function update(UpdatePromotionRequest $request, Promotion $promotion): RedirectResponse
    {
        try {
            DB::transaction(function () use ($request, $promotion) {
                // Update the main promotion record
                $promotion->update([
                    'name' => $request->name,
                    'description' => $request->description,
                    'type' => $request->type,
                    'value' => $request->value,
                    'min_order_amount' => $request->minimum_order_value,
                    'max_discount_amount' => $request->max_discount_amount,
                    'start_date' => $request->starts_at,
                    'end_date' => $request->expires_at,
                    'usage_limit' => $request->usage_limit_per_user,
                    'is_active' => $request->boolean('is_active', true)
                ]);

                // Handle product conditions - sync will add/remove as needed
                if (DB::getSchemaBuilder()->hasTable('promotion_products')) {
                    if ($request->filled('product_ids') && is_array($request->product_ids)) {
                        $promotion->products()->sync($request->product_ids);
                    } else {
                        $promotion->products()->sync([]); // Remove all if empty
                    }
                }

                // Handle category conditions
                if (DB::getSchemaBuilder()->hasTable('promotion_categories')) {
                    if ($request->filled('category_ids') && is_array($request->category_ids)) {
                        $promotion->categories()->sync($request->category_ids);
                    } else {
                        $promotion->categories()->sync([]); // Remove all if empty
                    }
                }
            });

            return redirect()->route('admin.promotions.index')
                ->with('success', 'Promotion updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update promotion. Please try again.');
        }
    }

    /**
     * Remove the specified promotion from storage.
     */
    public function destroy(Promotion $promotion): RedirectResponse
    {
        try {
            $promotion->delete();
            
            return redirect()->route('admin.promotions.index')
                ->with('success', 'Promotion deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete promotion. Please try again.');
        }
    }
}
