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
        // Follow-up dạng "cái thứ 2", "mẫu đó": ưu tiên đúng sản phẩm đã gợi ý
        // trước đó thay vì tìm lại theo từ khóa.
        $followUpProductIds = collect($context['follow_up_product_ids'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->take(self::LIMIT)
            ->values()
            ->all();

        if ($followUpProductIds !== []) {
            return $this->productsByIds($followUpProductIds);
        }

        $categoryIds = $this->matchCategoryIds($message);
        $brandIds = $this->matchBrandIds($message);
        [$priceMin, $priceMax] = $this->parsePriceRange($message);

        if (! $this->looksLikeProductIntent($message, $categoryIds, $brandIds, $priceMin, $priceMax)) {
            return [];
        }

        $keywords = $this->stripCoveredKeywords(
            $this->extractKeywords($message),
            $categoryIds,
            $brandIds
        );

        $contextProductIds = collect($context['recommendations'] ?? [])
            ->pluck('id')
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->take(self::LIMIT)
            ->all();

        if (! $categoryIds && ! $brandIds && $priceMin === null && $priceMax === null && $keywords === [] && $contextProductIds) {
            $products = $this->baseQuery()
                ->whereIn('product_id', $contextProductIds)
                ->orderByDesc('reviews_avg_rating')
                ->orderByDesc('created_at')
                ->take(self::LIMIT)
                ->get();
        } else {
            $products = $this->searchProducts($categoryIds, $brandIds, $priceMin, $priceMax, $keywords);

            // Từ khóa không khớp sản phẩm nào nhưng vẫn có danh mục/thương hiệu làm
            // điểm neo chủ đề: bỏ từ khóa thay vì trả về sản phẩm không liên quan.
            if ($products->isEmpty() && $keywords !== [] && ($categoryIds || $brandIds)) {
                $products = $this->searchProducts($categoryIds, $brandIds, $priceMin, $priceMax, []);
            }
        }

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
            ->whereHas('variants', fn (Builder $query) => $query->where('available_quantity', '>', 0))
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
     * @param  array<int, string>  $keywords
     * @return Collection<int, Product>
     */
    private function searchProducts(
        array $categoryIds,
        array $brandIds,
        ?int $priceMin,
        ?int $priceMax,
        array $keywords
    ): Collection {
        if ($keywords === []) {
            return $this->filteredQuery($categoryIds, $brandIds, $priceMin, $priceMax)
                ->orderByDesc('reviews_avg_rating')
                ->orderByDesc('created_at')
                ->take(self::LIMIT)
                ->get();
        }

        $productIds = $this->rankProductIdsByKeywords($categoryIds, $brandIds, $priceMin, $priceMax, $keywords);

        if ($productIds === []) {
            return collect();
        }

        $positions = array_flip($productIds);

        return $this->filteredQuery($categoryIds, $brandIds, $priceMin, $priceMax)
            ->whereIn('product_id', $productIds)
            ->get()
            ->sortBy(fn (Product $product) => $positions[$product->product_id] ?? PHP_INT_MAX)
            ->values();
    }

    /**
     * Trả lại đúng các sản phẩm đã gợi ý trước đó (dùng cho câu hỏi tiếp nối),
     * vẫn áp dụng bộ lọc hiển thị cơ bản để loại sản phẩm đã ngừng bán/hết hàng.
     *
     * @param  array<int, int>  $productIds
     * @return array<int, array<string, mixed>>
     */
    private function productsByIds(array $productIds): array
    {
        $positions = array_flip($productIds);

        return $this->filteredQuery([], [], null, null)
            ->whereIn('product_id', $productIds)
            ->get()
            ->sortBy(fn (Product $product) => $positions[$product->product_id] ?? PHP_INT_MAX)
            ->map(fn (Product $product) => $this->toCard($product))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @param  array<int, int>  $categoryIds
     * @param  array<int, int>  $brandIds
     */
    private function filteredQuery(array $categoryIds, array $brandIds, ?int $priceMin, ?int $priceMax): Builder
    {
        $query = $this->baseQuery();
        $this->applyCommonFilters($query, $categoryIds, $brandIds, $priceMin, $priceMax);

        return $query;
    }

    /**
     * @param  array<int, int>  $categoryIds
     * @param  array<int, int>  $brandIds
     */
    private function applyCommonFilters(
        Builder $query,
        array $categoryIds,
        array $brandIds,
        ?int $priceMin,
        ?int $priceMax
    ): void {
        if ($categoryIds) {
            $query->whereIn('category_id', $categoryIds);
        }

        if ($brandIds) {
            $query->whereIn('brand_id', $brandIds);
        }

        if ($priceMin !== null || $priceMax !== null) {
            $this->applyPriceFilter($query, $priceMin, $priceMax);
        }
    }

    /**
     * Chấm điểm từ khóa theo ranh giới từ (token) trong PHP. SQL chỉ dùng LIKE để
     * thu hẹp ứng viên (bao gồm cả khớp một phần), sau đó so khớp chính xác để
     * tránh các trường hợp như "ai" khớp "Air" hay "thể" khớp "thể thao".
     *
     * @param  array<int, int>  $categoryIds
     * @param  array<int, int>  $brandIds
     * @param  array<int, string>  $keywords
     * @return array<int, int>
     */
    private function rankProductIdsByKeywords(
        array $categoryIds,
        array $brandIds,
        ?int $priceMin,
        ?int $priceMax,
        array $keywords
    ): array {
        $keywordTokens = [];

        foreach ($keywords as $keyword) {
            $tokens = $this->tokenize($keyword);

            if ($tokens !== []) {
                $keywordTokens[] = $tokens[0];
            }
        }

        $keywordTokens = array_values(array_unique($keywordTokens));

        if ($keywordTokens === []) {
            return [];
        }

        $required = $this->requiredKeywordHits(count($keywordTokens));

        $candidates = Product::query()
            ->select(['product_id', 'name', 'description', 'created_at'])
            ->where('is_active', true)
            ->where('status', 'published')
            ->whereHas('shop', fn (Builder $query) => $query->where('status', 'active'))
            ->whereHas('variants', fn (Builder $query) => $query->where('available_quantity', '>', 0));

        $this->applyCommonFilters($candidates, $categoryIds, $brandIds, $priceMin, $priceMax);
        $this->applyKeywordPrefilter($candidates, $keywords);

        $candidates = $candidates
            ->withAvg(['reviews' => fn ($query) => $query->where('is_approved', true)], 'rating')
            ->get();

        $nameHits = [];
        $keywordHits = [];
        $eligible = [];

        foreach ($candidates as $product) {
            [$nameHitCount, $keywordHitCount] = $this->scoreProductKeywords($product, $keywordTokens);

            if ($keywordHitCount < $required || $nameHitCount < 1) {
                continue;
            }

            $eligible[] = $product;
            $nameHits[$product->product_id] = $nameHitCount;
            $keywordHits[$product->product_id] = $keywordHitCount;
        }

        if ($eligible === []) {
            return [];
        }

        usort($eligible, function (Product $a, Product $b) use ($nameHits, $keywordHits) {
            return ($nameHits[$b->product_id] <=> $nameHits[$a->product_id])
                ?: ($keywordHits[$b->product_id] <=> $keywordHits[$a->product_id])
                ?: ((float) ($b->reviews_avg_rating ?? 0) <=> (float) ($a->reviews_avg_rating ?? 0))
                ?: (($b->created_at?->getTimestamp() ?? 0) <=> ($a->created_at?->getTimestamp() ?? 0));
        });

        return array_map(
            fn (Product $product) => (int) $product->product_id,
            array_slice($eligible, 0, self::LIMIT)
        );
    }

    /**
     * @param  array<int, string>  $keywords
     */
    private function applyKeywordPrefilter(Builder $query, array $keywords): void
    {
        $query->where(function (Builder $subQuery) use ($keywords) {
            foreach ($keywords as $keyword) {
                // SQLite không lowercase được ký tự có dấu, nên thêm biến thể viết
                // hoa chữ đầu ("Áo") để tìm đúng sản phẩm trên cả SQLite và MySQL.
                $patterns = array_unique([
                    '%'.mb_strtolower($keyword).'%',
                    '%'.mb_strtoupper(mb_substr($keyword, 0, 1)).mb_substr($keyword, 1).'%',
                ]);

                foreach ($patterns as $like) {
                    foreach (['name', 'description'] as $column) {
                        foreach (['vi', 'en'] as $locale) {
                            $subQuery->orWhereRaw(
                                "LOWER(JSON_EXTRACT({$column}, ?)) LIKE ?",
                                ['$."'.$locale.'"', $like]
                            );
                        }
                    }
                }
            }
        });
    }

    /**
     * @param  array<int, string>  $keywordTokens
     * @return array{0: int, 1: int} [số token khớp trong tên, số token khớp trong tên hoặc mô tả]
     */
    private function scoreProductKeywords(Product $product, array $keywordTokens): array
    {
        $nameTokens = $this->productTokenSet($product, 'name');
        $allTokens = $nameTokens + $this->productTokenSet($product, 'description');

        $nameHits = 0;
        $keywordHits = 0;

        foreach ($keywordTokens as $token) {
            if (isset($nameTokens[$token])) {
                $nameHits++;
                $keywordHits++;
            } elseif (isset($allTokens[$token])) {
                $keywordHits++;
            }
        }

        return [$nameHits, $keywordHits];
    }

    /**
     * @return array<string, true>
     */
    private function productTokenSet(Product $product, string $column): array
    {
        $tokens = [];

        foreach (['vi', 'en'] as $locale) {
            $value = $product->getTranslation($column, $locale);

            if (! is_string($value) || $value === '') {
                continue;
            }

            foreach ($this->tokenize($value) as $token) {
                $tokens[$token] = true;
            }
        }

        return $tokens;
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
        if ($categoryIds || $brandIds || $priceMin !== null || $priceMax !== null) {
            return true;
        }

        $tokens = $this->tokenize($message);

        $intentPhrases = [
            ['san', 'pham'], ['tim'], ['goi', 'y'], ['mua'], ['gia'], ['duoi'], ['tren'],
            ['re'], ['tu', 'van'], ['loai'], ['chon'], ['muon', 'mua'], ['can', 'mua'],
            ['shop', 'co'], ['co', 'ban'], ['xem'], ['tham', 'khao'], ['dat'],
            // English quick replies / queries.
            ['product', 'advice'], ['product'], ['recommend'], ['suggest'], ['find'],
            ['buy'], ['price'], ['under'], ['over'], ['cheap'],
        ];

        // "bán" (sell) chỉ được nhận khi người dùng gõ đúng dấu, tránh nhầm "bạn"
        // (đại từ) thành ý định mua sắm.
        $hasIntent = $this->containsAnyPhrase($tokens, $intentPhrases)
            || $this->containsAnyPhrase($this->tokenize($message, false), [['bán']]);

        if (! $hasIntent) {
            return false;
        }

        $nonProductPhrases = [
            ['don', 'hang'], ['doi', 'tra'], ['giao', 'hang'], ['thanh', 'toan'],
            ['tai', 'khoan'], ['hoa', 'don'], ['van', 'chuyen'], ['bao', 'hanh'],
            ['ma', 'giam', 'gia'], ['khuyen', 'mai'],
        ];

        return ! $this->containsAnyPhrase($tokens, $nonProductPhrases);
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
     * Chỉ khớp khi toàn bộ tên danh mục/thương hiệu xuất hiện như một dãy token
     * liền nhau trong tin nhắn. Tránh việc "loại" khớp danh mục "Loa" hay
     * "mình muốn" khớp thương hiệu "H&M".
     *
     * @param  Collection<int, Category|Brand>  $items
     * @return array<int, int>
     */
    private function matchTranslations(string $message, Collection $items, string $idKey): array
    {
        $messageTokens = $this->tokenize($message);

        return $items
            ->filter(function ($item) use ($messageTokens) {
                foreach (['vi', 'en'] as $locale) {
                    $name = $item->getTranslation('name', $locale);

                    if (! $name) {
                        continue;
                    }

                    $nameTokens = $this->tokenize($name);

                    if ($nameTokens === []) {
                        continue;
                    }

                    // Tên chứa token 1 ký tự (vd "H&M" nếu không gộp "&") quá dễ
                    // khớp nhầm, bỏ qua thay vì lọc sai sản phẩm.
                    if (collect($nameTokens)->contains(fn (string $token) => mb_strlen($token) < 2)) {
                        continue;
                    }

                    if ($this->containsPhrase($messageTokens, $nameTokens)) {
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

        // Viết tắt kiểu "1tr5" (1,5 triệu), "2tr25" (2,25 triệu).
        $normalized = preg_replace('/(\d+)\s*(tr|triệu|trieu)\s*(\d)(?![\d])/u', '$1.$3$2', $normalized) ?? $normalized;

        $unit = 'k|nghìn|ngan|ngàn|triệu|trieu|tr';

        // "m" chỉ được hiểu là triệu khi đi kèm cụm giá rõ ràng, tránh "cáp 2m".
        $priceUnit = $unit.'|m';

        // Khoảng giá: "từ 500k đến 1 triệu", "500k - 700k", "1-2tr".
        if (preg_match(
            '/(?:từ|tu|khoảng|khoang)?\s*([0-9][0-9.,]*)\s*('.$unit.')?\s*(đến|den|tới|toi|->|–|—|-|~)\s*([0-9][0-9.,]*)\s*('.$unit.')?/u',
            $normalized,
            $matches
        )) {
            $delimiter = $matches[3];
            $firstUnit = $matches[2] ?? '';
            $secondUnit = $matches[5] ?? '';
            $usesSymbolDelimiter = ! in_array($delimiter, ['đến', 'den', 'tới', 'toi'], true);

            if (! ($usesSymbolDelimiter && $firstUnit === '' && $secondUnit === '')) {
                $first = $this->toVnd($matches[1], $firstUnit !== '' ? $firstUnit : $secondUnit);
                $second = $this->toVnd($matches[4], $secondUnit !== '' ? $secondUnit : $firstUnit);

                if ($first !== null && $second !== null) {
                    return $first <= $second ? [$first, $second] : [$second, $first];
                }
            }
        }

        $min = null;
        $max = null;

        if (preg_match('/(?:dưới|duoi|tối đa|toi da|không quá|khong qua|<=?|tầm|tam|khoảng|khoang)\s*([0-9][0-9.,]*)(?:\s*('.$priceUnit.')\b)?/u', $normalized, $matches)) {
            $max = $this->toVnd($matches[1], $matches[2] ?? '');
        }

        if (preg_match('/(?:trên|tren|tối thiểu|toi thieu|>=?|ít nhất|it nhat|từ|tu)\s*([0-9][0-9.,]*)(?:\s*('.$priceUnit.')\b)?/u', $normalized, $matches)) {
            $min = $this->toVnd($matches[1], $matches[2] ?? '');
        }

        if ($min === null && $max === null && preg_match('/(?:đến|den|tới|toi)\s*([0-9][0-9.,]*)(?:\s*('.$priceUnit.')\b)?/u', $normalized, $matches)) {
            $max = $this->toVnd($matches[1], $matches[2] ?? '');
        }

        // Một con số kèm đơn vị tiền tệ, không có "dưới/trên": hiểu là ngân sách tối đa.
        if ($min === null && $max === null && preg_match('/([0-9][0-9.,]*)\s*('.$unit.'|m)\b/u', $normalized, $matches)) {
            $candidateUnit = $this->normalize($matches[2] ?? '');

            // "m" chỉ là triệu khi câu nói rõ về giá/tiền ("giá 2m"), còn "cáp 2m"
            // là đơn vị mét nên bỏ qua.
            if ($candidateUnit !== 'm' || array_intersect(['gia', 'tien'], $this->tokenize($normalized)) !== []) {
                $max = $this->toVnd($matches[1], $matches[2] ?? '');
            }
        }

        return [$min, $max];
    }

    private function toVnd(string $number, string $unit): ?int
    {
        $value = $this->parseNumber($number);
        $unit = $this->normalize($unit);

        if (in_array($unit, ['k', 'nghin', 'ngan'], true)) {
            $value *= 1000;
        } elseif (in_array($unit, ['trieu', 'tr', 'm'], true)) {
            $value *= 1000000;
        } elseif ($unit === '' && $value < 1000) {
            // Số không đơn vị quá nhỏ (vd "dưới 2"): không phải giá, bỏ qua.
            return null;
        }

        return $value > 0 ? (int) round($value) : null;
    }

    /**
     * Đọc số có phân cách nghìn/thập phân: "1.500.000", "1,500,000",
     * "1.5", "1,5", "1.500".
     */
    private function parseNumber(string $number): float
    {
        $number = str_replace(' ', '', $number);

        $dotCount = substr_count($number, '.');
        $commaCount = substr_count($number, ',');

        if ($dotCount > 1 || $commaCount > 1) {
            $number = str_replace(['.', ','], '', $number);
        } elseif ($dotCount === 1 && $commaCount === 1) {
            if (strrpos($number, '.') > strrpos($number, ',')) {
                $number = str_replace(',', '', $number);
            } else {
                $number = str_replace('.', '', $number);
                $number = str_replace(',', '.', $number);
            }
        } elseif ($dotCount === 1 || $commaCount === 1) {
            $separator = $dotCount === 1 ? '.' : ',';
            $fractionLength = strlen($number) - (int) strrpos($number, $separator) - 1;

            // "1.500" / "1,500" là phân cách nghìn; "1.5" / "1,5" là thập phân.
            $number = $fractionLength === 3
                ? str_replace($separator, '', $number)
                : str_replace($separator, '.', $number);
        }

        return (float) $number;
    }

    /**
     * @return array<int, string>
     */
    private function extractKeywords(string $message): array
    {
        $withoutPrice = preg_replace(
            '/\d+(?:[.,]\d+)?\s*(?:k|nghìn|ngan|ngàn|triệu|trieu|tr|m)\b'
            .'|\d+(?:[.,]\d+)?\s*(?:tr|triệu|trieu)\s*\d+'
            .'|\d+(?:[.,]\d+)?\s*(?:đ|vnd|vnđ|đồng|dong)\b/ui',
            ' ',
            $message
        ) ?? $message;
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
            // Bổ ngữ giới tính/đối tượng/kích cỡ: không dùng để tính độ phủ vì
            // tên sản phẩm thường không chứa các từ này (vd "giày chạy bộ nam").
            'nam', 'nữ', 'nu', 'unisex', 'be', 'bé', 'tre', 'trẻ', 'em',
            'nguoi', 'người', 'lon', 'lớn', 'size', 'cỡ', 'mau', 'mẫu',
            'kieu', 'kiểu', 'hang', 'hãng', 'hieu', 'hiệu', 'nen', 'nên',
            'duoc', 'được', 'chinh', 'chính',
            // Động từ mua sắm: thể hiện ý định nhưng không phải thuộc tính sản phẩm.
            'xem', 'tham', 'khao', 'khảo', 'dat', 'đặt', 're', 'rẻ',
            // Liên từ dùng cho khoảng giá: "từ 1 triệu đến 2 triệu".
            'từ', 'đến', 'tới', 'trở', 'lên', 'xuống', 'giữa',
            // Từ đệm/ý định tiếng Anh (quick reply hiển thị tiếng Anh ở locale en).
            'product', 'products', 'advice', 'recommend', 'suggest', 'find', 'buy',
            'price', 'under', 'over', 'cheap', 'please', 'show', 'me', 'want',
            'need', 'looking', 'the', 'for', 'my', 'can', 'you', 'help', 'like',
            'what', 'which', 'some', 'any',
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

    private function requiredKeywordHits(int $keywordCount): int
    {
        if ($keywordCount <= 1) {
            return $keywordCount;
        }

        return max(2, (int) ceil($keywordCount * 0.6));
    }

    /**
     * Bỏ các token đã được danh mục/thương hiệu đã khớp giải thích, để phần còn lại
     * dùng lọc sâu hơn trong phạm vi đó (vd "giày" đã khớp "Giày dép" thì chỉ còn
     * "chạy", "bộ").
     *
     * @param  array<int, string>  $keywords
     * @param  array<int, int>  $categoryIds
     * @param  array<int, int>  $brandIds
     * @return array<int, string>
     */
    private function stripCoveredKeywords(array $keywords, array $categoryIds, array $brandIds): array
    {
        if ($keywords === [] || (! $categoryIds && ! $brandIds)) {
            return $keywords;
        }

        $covered = collect();

        if ($categoryIds && $this->categories) {
            $covered = $covered->merge(
                $this->categories
                    ->whereIn('category_id', $categoryIds)
                    ->flatMap(fn (Category $category) => $this->nameTokens($category))
            );
        }

        if ($brandIds && $this->brands) {
            $covered = $covered->merge(
                $this->brands
                    ->whereIn('brand_id', $brandIds)
                    ->flatMap(fn (Brand $brand) => $this->nameTokens($brand))
            );
        }

        $covered = $covered->filter()->unique()->values()->all();

        if ($covered === []) {
            return $keywords;
        }

        return array_values(array_filter(
            $keywords,
            fn (string $keyword) => ! in_array($this->tokenize($keyword)[0] ?? '', $covered, true)
        ));
    }

    /**
     * @return array<int, string>
     */
    private function nameTokens(Category|Brand $item): array
    {
        $tokens = [];

        foreach (['vi', 'en'] as $locale) {
            $name = $item->getTranslation('name', $locale);

            if (! $name) {
                continue;
            }

            foreach ($this->tokenize($name) as $token) {
                $tokens[$token] = true;
            }
        }

        return array_keys($tokens);
    }

    /**
     * Tách văn bản thành token theo ranh giới từ. Mặc định bỏ dấu để so khớp
     * không phân biệt dấu ("giay" khớp "giày"); truyền $ascii = false khi cần
     * phân biệt các từ như "bán" và "bạn".
     *
     * @return array<int, string>
     */
    private function tokenize(string $text, bool $ascii = true): array
    {
        $text = mb_strtolower($text);
        $text = str_replace(['&', '+', "'", '’'], '', $text);

        if ($ascii) {
            $text = Str::ascii($text);
        }

        $parts = preg_split('/[^\p{L}\p{N}]+/u', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return array_values($parts);
    }

    /**
     * @param  array<int, string>  $tokens
     * @param  array<int, string>  $phrase
     */
    private function containsPhrase(array $tokens, array $phrase): bool
    {
        $length = count($phrase);

        if ($length === 0 || $length > count($tokens)) {
            return false;
        }

        $limit = count($tokens) - $length;

        for ($index = 0; $index <= $limit; $index++) {
            if (array_slice($tokens, $index, $length) === $phrase) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  array<int, string>  $tokens
     * @param  array<int, array<int, string>>  $phrases
     */
    private function containsAnyPhrase(array $tokens, array $phrases): bool
    {
        foreach ($phrases as $phrase) {
            if ($this->containsPhrase($tokens, $phrase)) {
                return true;
            }
        }

        return false;
    }

    private function applyPriceFilter(Builder $query, ?int $min, ?int $max): void
    {
        $query->whereHas('variants', function (Builder $variants) use ($min, $max) {
            $variants->where('available_quantity', '>', 0);

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
            if ((int) $variant->available_quantity <= 0) {
                continue;
            }

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

        $totalStock = (int) $product->variants->sum('available_quantity');
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
