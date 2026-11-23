<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Shop;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        if (Product::query()->exists()) {
            $this->command?->info('Products already seeded, skipping.');

            return;
        }

        $shops = Shop::where('status', 'active')->get();

        if ($shops->isEmpty()) {
            $shops = Shop::all();
        }

        $categories = Category::whereNotNull('parent_category_id')->get();
        $brands = Brand::all();
        $attributes = Attribute::with('values')->get();

        if ($shops->isEmpty() || $categories->isEmpty() || $brands->isEmpty()) {
            $this->command?->info('Vui lòng chạy các seeder cho Shop, Category, Brand, Attribute trước.');

            return;
        }

        $testShop = Shop::where('slug', 'test-shop-pro')->first();
        $colorAttribute = $attributes->firstWhere('name', 'Màu sắc');
        $sizeAttribute = $attributes->firstWhere('name', 'Kích thước');
        $attributeNames = $attributes->pluck('name', 'attribute_id');

        $colorValues = $colorAttribute?->values ?? collect();
        $sizeValues = $sizeAttribute?->values ?? collect();

        if ($colorValues->isEmpty() && $sizeValues->isEmpty()) {
            $this->command?->info('Chưa có attribute values (Màu sắc/Kích thước) để tạo biến thể.');

            return;
        }

        for ($i = 0; $i < 100; $i++) {
            $shop = ($testShop && $i < 25) ? $testShop : $shops->random();

            $status = match (true) {
                $i < 60 => 'published',
                $i < 80 => 'pending_approval',
                default => 'draft',
            };

            $product = Product::factory()->create([
                'shop_id' => $shop->id,
                'seller_id' => $shop->owner_id,
                'category_id' => $categories->random()->category_id,
                'brand_id' => $brands->random()->brand_id,
                'status' => $status,
            ]);

            // 3-5 ảnh cho mỗi sản phẩm, ảnh đầu tiên là ảnh chính.
            $images = ProductImage::factory(rand(3, 5))->create([
                'product_id' => $product->product_id,
            ]);
            $primaryImage = $images->first();
            $primaryImage->update(['is_primary' => true, 'display_order' => 0]);

            $combinations = $this->buildCombinations($colorValues, $sizeValues, $attributes);

            foreach ($combinations as $index => $combination) {
                /** @var Collection<int, AttributeValue> $combination */
                $ids = $combination->pluck('attribute_value_id')->sort()->values();
                $signature = $ids->implode('-');

                $variant = ProductVariant::factory()->create([
                    'product_id' => $product->product_id,
                    'variant_name' => $combination->pluck('value')->implode(' / '),
                    'option_values' => $combination->map(fn ($value) => [
                        'attribute_id' => $value->attribute_id,
                        'attribute_value_id' => $value->attribute_value_id,
                        'attribute_name' => $attributeNames[$value->attribute_id] ?? '',
                        'value' => $value->value,
                    ])->values()->all(),
                    'option_signature' => $signature,
                    'image_id' => $primaryImage->image_id,
                    'is_primary' => $index === 0,
                    // Đảm bảo luôn có ít nhất một biến thể còn hàng để UI có thể mua.
                    'stock_quantity' => $index === 0 ? rand(10, 100) : rand(0, 100),
                ]);

                $variant->attributeValues()->attach($ids->all());
            }
        }
    }

    /**
     * Tạo các tổ hợp màu sắc x kích thước. Luôn ưu tiên Màu sắc/Kích thước
     * để tránh trường hợp sản phẩm không có biến thể nào.
     *
     * @param  Collection<int, AttributeValue>  $colorValues
     * @param  Collection<int, AttributeValue>  $sizeValues
     * @param  Collection<int, Attribute>  $attributes
     * @return array<int, Collection<int, AttributeValue>>
     */
    private function buildCombinations(Collection $colorValues, Collection $sizeValues, Collection $attributes): array
    {
        if ($colorValues->isEmpty() && $sizeValues->isEmpty()) {
            return $attributes
                ->flatMap(fn (Attribute $attribute) => $attribute->values)
                ->take(3)
                ->map(fn ($value) => collect([$value]))
                ->values()
                ->all();
        }

        $colors = $colorValues->isNotEmpty()
            ? $colorValues->shuffle()->take(rand(1, 3))
            : collect([null]);

        $sizes = $sizeValues->isNotEmpty()
            ? $sizeValues->shuffle()->take(rand(1, 3))
            : collect([null]);

        $combinations = [];

        foreach ($colors as $color) {
            foreach ($sizes as $size) {
                $values = collect([$color, $size])->filter()->values();

                if ($values->isNotEmpty()) {
                    $combinations[] = $values;
                }
            }
        }

        return $combinations;
    }
}
