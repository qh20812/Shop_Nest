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
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        if (Product::query()->exists()) {
            $this->command?->info('Products already seeded, skipping.');

            return;
        }

        $catalog = require database_path('seeders/data/demo_catalog.php');
        $shops = Shop::query()
            ->whereIn('slug', collect($catalog)->pluck('shop')->unique())
            ->get()
            ->keyBy('slug');

        $categories = Category::query()
            ->whereNotNull('parent_category_id')
            ->get()
            ->keyBy(fn (Category $category) => $category->getTranslation('name', 'en'));

        $brands = Brand::query()
            ->get()
            ->keyBy(fn (Brand $brand) => $brand->getTranslation('name', 'en') ?: $brand->name);

        $attributes = Attribute::query()
            ->with('values')
            ->get()
            ->keyBy('name');

        $attributeNames = Attribute::query()->pluck('name', 'attribute_id');

        if ($shops->isEmpty() || $categories->isEmpty() || $brands->isEmpty()) {
            $this->command?->error('Thiếu shop/category/brand. Hãy chạy các seeder trước.');

            return;
        }

        foreach ($catalog as $item) {
            $shop = $shops->get($item['shop']);
            $category = $categories->get($item['category']);
            $brand = $brands->get($item['brand']);

            if (! $shop || ! $category || ! $brand) {
                $this->command?->warn('Bỏ qua sản phẩm thiếu dữ liệu: '.$item['slug']);

                continue;
            }

            $description = $this->buildDescription($item);
            $imagePath = '/images/products/'.$item['slug'].'.jpg';

            if (! is_file(public_path('images/products/'.$item['slug'].'.jpg'))) {
                $imagePath = '/image/default-product.png';
            }

            $product = Product::create([
                'shop_id' => $shop->id,
                'seller_id' => $shop->owner_id,
                'category_id' => $category->category_id,
                'brand_id' => $brand->brand_id,
                'name' => $item['name'],
                'description' => $description,
                'status' => $item['status'] ?? 'published',
                'is_active' => true,
                'meta_title' => $item['name']['vi'].' chính hãng | ShopNest',
                'meta_slug' => Str::slug($item['slug']),
                'meta_description' => Str::limit($description['vi'], 155),
            ]);

            $image = ProductImage::create([
                'product_id' => $product->product_id,
                'image_url' => $imagePath,
                'alt_text' => $item['name']['vi'],
                'is_primary' => true,
                'display_order' => 0,
            ]);

            $variants = $this->buildVariantOptions($item, $attributes);

            foreach ($variants as $index => $variantData) {
                $values = $variantData['values'];
                $ids = $values->pluck('attribute_value_id')->sort()->values();
                $increment = $variantData['increment'];
                $price = (float) $item['price'] + $increment;
                $salePrice = isset($item['sale']) ? (float) $item['sale'] + $increment : null;

                $variant = ProductVariant::create([
                    'product_id' => $product->product_id,
                    'variant_name' => $values->isEmpty() ? 'Tiêu chuẩn' : $values->pluck('value')->implode(' / '),
                    'option_values' => $values->map(fn ($value) => [
                        'attribute_id' => $value->attribute_id,
                        'attribute_value_id' => $value->attribute_value_id,
                        'attribute_name' => $attributeNames[$value->attribute_id] ?? '',
                        'value' => $value->value,
                    ])->values()->all(),
                    'option_signature' => $ids->isEmpty() ? 'default' : $ids->implode('-'),
                    'sku' => strtoupper(Str::slug($item['slug'], '-')).'-'.($index + 1),
                    'price' => $price,
                    'discount_price' => $salePrice,
                    'stock_quantity' => random_int(15, 80),
                    'image_id' => $image->image_id,
                    'is_primary' => $index === 0,
                ]);

                if ($ids->isNotEmpty()) {
                    $variant->attributeValues()->attach($ids->all());
                }
            }
        }

        $this->updateCategoryImages();
    }

    /**
     * @return array<int, array{values: Collection<int, AttributeValue>, increment: int}>
     */
    private function buildVariantOptions(array $item, Collection $attributes): array
    {
        $type = $item['variant'] ?? 'default';
        $colors = $attributes->get('Màu sắc')?->values ?? collect();
        $sizes = $attributes->get('Kích thước')?->values ?? collect();
        $shoeSizes = $attributes->get('Kích cỡ giày')?->values ?? collect();
        $storages = $attributes->get('Dung lượng')?->values ?? collect();

        return match ($type) {
            'phone' => $this->combinations(
                $colors->filter(fn ($value) => in_array($value->value, ['Titanium', 'Đen Titan', 'Xanh Titan'], true))->take(2),
                $storages->filter(fn ($value) => in_array($value->value, ['256GB', '512GB'], true)),
                ['512GB' => 2000000]
            ),
            'tablet' => $this->combinations(
                collect(),
                $storages->filter(fn ($value) => in_array($value->value, ['128GB', '256GB'], true)),
                ['256GB' => 2000000]
            ),
            'laptop' => $this->combinations(
                collect(),
                $storages->filter(fn ($value) => in_array($value->value, ['256GB', '512GB'], true)),
                ['512GB' => 3000000]
            ),
            'audio' => $this->combinations($colors->take(2), collect(), []),
            'fashion' => $this->combinations(
                collect(),
                $sizes->filter(fn ($value) => in_array($value->value, ['S', 'M', 'L', 'XL'], true)),
                []
            ),
            'shoes' => $this->combinations(collect(), $shoeSizes, []),
            default => [['values' => collect(), 'increment' => 0]],
        };
    }

    /**
     * @param  array<string, int>  $increments
     * @return array<int, array{values: Collection<int, AttributeValue>, increment: int}>
     */
    private function combinations(Collection $first, Collection $second, array $increments): array
    {
        if ($first->isEmpty() && $second->isEmpty()) {
            return [['values' => collect(), 'increment' => 0]];
        }

        $firstGroup = $first->isEmpty() ? collect([null]) : $first;
        $secondGroup = $second->isEmpty() ? collect([null]) : $second;
        $combinations = [];

        foreach ($firstGroup as $left) {
            foreach ($secondGroup as $right) {
                $values = collect([$left, $right])->filter()->values();

                if ($values->isEmpty()) {
                    continue;
                }

                $increment = 0;

                foreach ($values as $value) {
                    $increment += $increments[$value->value] ?? 0;
                }

                $combinations[] = ['values' => $values, 'increment' => $increment];
            }
        }

        return $combinations;
    }

    /**
     * @return array{vi: string, en: string}
     */
    private function buildDescription(array $item): array
    {
        $name = $item['name']['vi'];
        $brand = $item['brand'];
        $category = $item['category'];

        $vi = match (true) {
            in_array($category, ['Mobile Phones', 'Tablets', 'Laptops', 'Headphones', 'Speakers', 'Smart Watches'], true) => "{$name} chính hãng {$brand}, thiết kế hiện đại, hiệu năng ổn định và bảo hành minh bạch. Sản phẩm phù hợp cho học tập, làm việc và giải trí hằng ngày.",
            in_array($category, ['Skincare', 'Makeup', 'Perfume', 'Supplements'], true) => "{$name} từ thương hiệu {$brand}, công thức lành tính và dễ sử dụng. Sản phẩm giúp chăm sóc bản thân mỗi ngày và phù hợp với nhiều loại da.",
            in_array($category, ['Literature', 'Economics', 'Notebooks', 'Pens'], true) => "{$name} đến từ {$brand}, nội dung chất lượng và trình bày chỉn chu. Lựa chọn phù hợp cho học tập, làm việc và thư giãn.",
            in_array($category, ["Men's Clothing", "Men's Pants", "Women's Clothing", "Women's Dresses", 'Shoes', 'Accessories', 'Sportswear'], true) => "{$name} của {$brand}, chất liệu thoải mái, form dáng dễ mặc và bền đẹp theo thời gian. Sản phẩm phù hợp đi làm, dạo phố và vận động.",
            default => "{$name} chính hãng từ {$brand}, thiết kế tiện dụng và chất lượng ổn định. Sản phẩm phù hợp cho nhu cầu sử dụng hằng ngày của gia đình.",
        };

        return [
            'vi' => $vi,
            'en' => "{$name} by {$brand}. Authentic product with reliable quality, suitable for everyday use.",
        ];
    }

    private function updateCategoryImages(): void
    {
        $categories = Category::query()->get();

        foreach ($categories as $category) {
            $product = Product::query()
                ->where('category_id', $category->category_id)
                ->with('images')
                ->first();

            if ($product?->images->first()) {
                $category->update(['image_url' => $product->images->first()->image_url]);
            }
        }

        $parents = Category::query()->whereNull('parent_category_id')->get();

        foreach ($parents as $parent) {
            $child = Category::query()
                ->where('parent_category_id', $parent->category_id)
                ->whereNotNull('image_url')
                ->where('image_url', '!=', '/image/default-product.png')
                ->first();

            if ($child) {
                $parent->update(['image_url' => $child->image_url]);
            }
        }
    }
}
