<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ChatbotProductRecommender
{
    private const LIMIT = 3;

    /** @var Collection<int, Category>|null */
    private ?Collection $categories = null;

    /** @var Collection<int, Brand>|null */
    private ?Collection $brands = null;

    /**
     * Gợi ý sản phẩm từ DB cho khách hàng. Không dùng dữ liệu hard-code.
     *
     * @param  array<string, mixed>  $context
     * @return array<int, array<string, mixed>>
     */
    public function recommend(User $user, string $message, array $context = []): array
    {
        $categoryIds = $this->matchCategoryIds($message);
        $brandIds = $this->matchBrandIds($message);
        [$priceMin, $priceMax] = $this->parsePriceRange($message);

        if (! $this->looksLikeProductIntent($message, $categoryIds, $brandIds, $priceMin, $priceMax)) {
            return [];
        }

        $keywords = ($categoryIds || $brandIds) ? [] : $this->extractKeywords($message);
        $contextProductIds = collect($context['recommendations'] ?? [])
            ->pluck('id')
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->take(self::LIMIT)
            ->all();

        $query = $this->baseQuery();

        if ($categoryIds) {
            $query->whereIn('category_id', $categoryIds);
        }

        if ($brandIds) {
            $query->whereIn('brand_id', $brandIds);
        }

        if ($priceMin !== null || $priceMax !== null) {
            $this->applyPriceFilter($query, $priceMin, $priceMax);
        }

        if ($keywords) {
            $this->applyKeywordFilter($query, $keywords);
        }

        if (! $categoryIds && ! $brandIds && $priceMin === null && $priceMax === null && ! $keywords && $contextProductIds) {
            $query->whereIn('product_id', $contextProductIds);
        }

        $products = $query
            ->orderByDesc('reviews_avg_rating')
            ->orderByDesc('created_at')
            ->take(self::LIMIT)
            ->get();

        return $products
            ->map(fn (Product $product) => $this->toCard($product))
            ->filter()
            ->values()
            ->all();
    }

    private function baseQuery(): Builder
    {
        return Product::query()
            ->where('is_active', true)
            ->where('status', 'published')
            ->whereHas('shop', fn (Builder $query) => $query->where('status', 'active'))
            ->whereHas('variants', fn (Builder $query) => $query->where('stock_quantity', '>', 0))
            ->with([
                'images' => fn ($query) => $query->orderByDesc('is_primary')->orderBy('display_order'),
                'variants',
                'shop',
            ])
            ->withAvg(['reviews' => fn ($query) => $query->where('is_approved', true)], 'rating')
            ->withCount(['reviews' => fn ($query) => $query->where('is_approved', true)]);
    }

    /**
     * @param  array<int, int>  $categoryIds
     * @param  array<int, int>  $brandIds
     */
    private function looksLikeProductIntent(
        string $message,
        array $categoryIds,
        array $brandIds,
        ?int $priceMin,
        ?int $priceMax
    ): bool {
        $normalized = $this->normalize($message);

        if ($categoryIds || $brandIds || $priceMin !== null || $priceMax !== null) {
            return true;
        }

        $intentKeywords = [
            'san pham', 'tim', 'goi y', 'mua', 'gia', 'duoi', 'tren', 're',
            'tu van', 'loai', 'chon', 'ban', 'muon mua', 'can mua', 'shop co',
        ];

        $hasIntent = collect($intentKeywords)->contains(fn (string $keyword) => str_contains($normalized, $keyword));

        if (! $hasIntent) {
            return false;
        }

        $nonProductKeywords = [
            'don hang', 'doi tra', 'giao hang', 'thanh toan', 'tai khoan',
            'hoa don', 'van chuyen', 'bao hanh', 'ma giam gia', 'khuyen mai',
        ];

        return ! collect($nonProductKeywords)->contains(fn (string $keyword) => str_contains($normalized, $keyword));
    }

    private function matchCategoryIds(string $message): array
    {
        $this->categories ??= Category::query()
            ->where('is_active', true)
            ->get(['category_id', 'name']);

        return $this->matchTranslations($message, $this->categories, 'category_id');
    }

    private function matchBrandIds(string $message): array
    {
        $this->brands ??= Brand::query()
            ->where('is_active', true)
            ->get(['brand_id', 'name']);

        return $this->matchTranslations($message, $this->brands, 'brand_id');
    }

    /**
     * @param  Collection<int, Category|Brand>  $items
     * @return array<int, int>
     */
    private function matchTranslations(string $message, Collection $items, string $idKey): array
    {
        $normalizedMessage = $this->normalize($message);

        return $items
            ->filter(function ($item) use ($normalizedMessage) {
                foreach (['vi', 'en'] as $locale) {
                    $name = $item->getTranslation('name', $locale);

                    if ($name && str_contains($normalizedMessage, $this->normalize($name))) {
                        return true;
                    }
                }

                return false;
            })
            ->pluck($idKey)
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    /**
     * @return array{0: int|null, 1: int|null} [min, max]
     */
    private function parsePriceRange(string $message): array
    {
        $normalized = mb_strtolower($message);

        $min = null;
        $max = null;

        if (preg_match('/(?:dưới|duoi|tối đa|toi da|không quá|khong qua|<=?|tầm|tam|khoảng|khoang)\s*([0-9][0-9.,]*)\s*(k|nghìn|ngan|ngàn|triệu|trieu|tr|m)?/u', $normalized, $matches)) {
            $max = $this->toVnd($matches[1], $matches[2] ?? '');
        }

        if (preg_match('/(?:trên|tren|tối thiểu|toi thieu|>=?|ít nhất|it nhat)\s*([0-9][0-9.,]*)\s*(k|nghìn|ngan|ngàn|triệu|trieu|tr|m)?/u', $normalized, $matches)) {
            $min = $this->toVnd($matches[1], $matches[2] ?? '');
        }

        if ($min === null && $max === null && preg_match('/([0-9][0-9.,]*)\s*(k|nghìn|ngan|ngàn|triệu|trieu|tr|m)\b/u', $normalized, $matches)) {
            $max = $this->toVnd($matches[1], $matches[2] ?? '');
        }

        return [$min, $max];
    }

    private function toVnd(string $number, string $unit): int
    {
        $clean = str_replace([' ', '.'], '', $number);
        $clean = str_replace(',', '.', $clean);
        $value = (float) $clean;
        $unit = $this->normalize($unit);

        if (in_array($unit, ['k', 'nghin', 'ngan'], true)) {
            $value *= 1000;
        } elseif (in_array($unit, ['trieu', 'tr', 'm'], true)) {
            $value *= 1000000;
        }

        return $value > 0 ? (int) round($value) : 0;
    }

    /**
     * @return array<int, string>
     */
    private function extractKeywords(string $message): array
    {
        $withoutPrice = preg_replace('/\d+(?:[.,]\d+)?\s*(?:k|nghìn|ngan|ngàn|triệu|trieu|tr|m)\b/u', ' ', $message) ?? $message;
        $tokens = preg_split('/[^\p{L}\p{N}]+/u', mb_strtolower($withoutPrice), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        $stopwords = [
            'toi', 'tôi', 'minh', 'mình', 'ban', 'bạn', 'cho', 'giup', 'giúp',
            'goi', 'gợi', 'y', 'ý', 'tim', 'tìm', 'san', 'sản', 'pham', 'phẩm',
            'mua', 'can', 'cần', 'muon', 'muốn', 'co', 'có', 'khong', 'không',
            'loai', 'loại', 'nao', 'nào', 'tot', 'tốt', 'nhat', 'nhất',
            'gia', 'giá', 'duoi', 'dưới', 'tren', 'trên', 'tam', 'tầm',
            'khoang', 'khoảng', 'va', 'và', 'voi', 'với', 'cua', 'của',
            'mot', 'một', 'cac', 'các', 'nhung', 'những', 'hay', 'hãy',
            'gum', 'giùm', 'shop', 'oi', 'ơi', 'nao', 'nào', 'gi', 'gì',
            'ban', 'bán', 'chon', 'chọn', 'tu', 'van', 'vấn', 'loai', 'loại',
        ];

        return collect($tokens)
            ->reject(fn (string $token) => in_array($token, $stopwords, true)
                || mb_strlen($token) < 2
                || (is_numeric($token) && mb_strlen($token) < 3))
            ->unique()
            ->take(5)
            ->values()
            ->all();
    }

    private function applyKeywordFilter(Builder $query, array $keywords): void
    {
        $query->where(function (Builder $subQuery) use ($keywords) {
            foreach ($keywords as $keyword) {
                $like = '%'.mb_strtolower($keyword).'%';

                foreach (['name', 'description'] as $column) {
                    foreach (['vi', 'en'] as $locale) {
                        $subQuery->orWhereRaw(
                            "LOWER(JSON_EXTRACT({$column}, ?)) LIKE ?",
                            ['$."'.$locale.'"', $like]
                        );
                    }
                }
            }
        });
    }

    private function applyPriceFilter(Builder $query, ?int $min, ?int $max): void
    {
        $query->whereHas('variants', function (Builder $variants) use ($min, $max) {
            if ($min !== null) {
                $variants->where(function (Builder $price) use ($min) {
                    $price->where('discount_price', '>=', $min)
                        ->orWhere(function (Builder $regular) use ($min) {
                            $regular->whereNull('discount_price')->where('price', '>=', $min);
                        });
                });
            }

            if ($max !== null) {
                $variants->where(function (Builder $price) use ($max) {
                    $price->where('discount_price', '<=', $max)
                        ->orWhere(function (Builder $regular) use ($max) {
                            $regular->whereNull('discount_price')->where('price', '<=', $max);
                        });
                });
            }
        });
    }

    /**
     * @return array<string, mixed>|null
     */
    private function toCard(Product $product): ?array
    {
        $price = null;
        $compareAt = null;

        foreach ($product->variants as $variant) {
            $regular = (float) $variant->price;
            $discount = $variant->discount_price !== null ? (float) $variant->discount_price : null;
            $effective = $discount !== null && $discount < $regular ? $discount : $regular;

            if ($price === null || $effective < $price) {
                $price = $effective;
                $compareAt = $effective < $regular ? $regular : null;
            }
        }

        if ($price === null) {
            return null;
        }

        $imageUrl = $product->images->first()?->image_url;

        if ($imageUrl && ! Str::startsWith($imageUrl, ['http://', 'https://', '/'])) {
            $imageUrl = Storage::url($imageUrl);
        }

        $totalStock = (int) $product->variants->sum('stock_quantity');
        $badges = [];

        if ($compareAt !== null) {
            $badges[] = 'sale';
        }

        if ($product->created_at?->gt(now()->subDays(14))) {
            $badges[] = 'new';
        }

        if ($totalStock <= 10) {
            $badges[] = 'low-stock';
        }

        return [
            'id' => (int) $product->product_id,
            'name' => $product->getTranslation('name', app()->getLocale()),
            'image' => $imageUrl,
            'price' => $price,
            'compare_at' => $compareAt,
            'rating' => $product->reviews_avg_rating !== null ? round((float) $product->reviews_avg_rating, 1) : null,
            'review_count' => (int) ($product->reviews_count ?? 0),
            'shop_name' => $product->shop?->name,
            'url' => '/product/'.$product->product_id,
            'badges' => $badges,
            'stock' => $totalStock > 10 ? 'in' : ($totalStock > 0 ? 'low' : 'out'),
        ];
    }

    private function normalize(string $text): string
    {
        return Str::of($text)
            ->lower()
            ->ascii()
            ->replaceMatches('/[^a-z0-9\s]/', ' ')
            ->squish()
            ->toString();
    }
}
