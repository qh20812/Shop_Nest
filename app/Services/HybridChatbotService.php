<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Exceptions\ChatbotApiException;
use App\Models\AnalyticsReport;
use App\Models\CartItem;
use App\Models\ChatMessage;
use App\Models\ChatParticipant;
use App\Models\ChatRoom;
use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class HybridChatbotService
{
    private const CACHE_TTL_MINUTES = 5;

    private const ROLE_PROVIDER_PRIORITY = [
        'admin' => ['openai', 'groq'],
        'seller' => ['groq', 'openai'],
        'shipper' => ['groq', 'openai'],
        'customer' => ['groq', 'openai'],
        'default' => ['groq', 'openai'],
    ];

    private const ROLE_SYSTEM_PROMPTS = [
        'admin' => 'Bạn là cố vấn vận hành cho nền tảng thương mại điện tử Shop Nest. Hãy phân tích dữ liệu, ưu tiên insight có thể hành động được, đề xuất bước tiếp theo rõ ràng. Trình bày bằng tiếng Việt, có thể bổ sung thuật ngữ tiếng Anh nếu cần.',
        'seller' => 'Bạn là trợ lý kinh doanh cho nhà bán tại Shop Nest. Hãy đưa ra gợi ý bán hàng, tối ưu tồn kho và chiến lược khuyến mãi dựa trên dữ liệu được cung cấp. Phản hồi bằng tiếng Việt thân thiện.',
        'shipper' => 'Bạn là điều phối viên giao vận tại Shop Nest. Hãy giúp shipper nắm trạng thái đơn hàng, ưu tiên tuyến giao hàng và lưu ý dịch vụ khách hàng. Trình bày bằng tiếng Việt ngắn gọn, rõ ràng.',
        'customer' => 'Bạn là hướng dẫn viên mua sắm cho khách hàng tại Shop Nest. Hãy đưa ra tư vấn cá nhân hóa, gợi ý sản phẩm phù hợp và giải thích quy trình rõ ràng bằng tiếng Việt thân thiện.',
        'default' => 'Bạn là trợ lý hỗ trợ tại Shop Nest. Hãy cung cấp thông tin chính xác, súc tích bằng tiếng Việt.',
    ];

    private const ROLE_MODEL_OVERRIDES = [
        'openai' => [
            'admin' => 'gpt-4o-mini',
            'seller' => 'gpt-4o-mini',
            'shipper' => 'gpt-4o-mini',
            'customer' => 'gpt-4o-mini',
            'default' => 'gpt-4o-mini',
        ],
        'groq' => [
            'admin' => 'llama-3.1-8b-instant',
            'seller' => 'llama-3.1-8b-instant',
            'shipper' => 'llama-3.1-8b-instant',
            'customer' => 'llama-3.1-8b-instant',
            'default' => 'llama-3.1-8b-instant',
        ],
    ];

    public function sendMessage(User $user, string $rawMessage): array
    {
        $message = $this->sanitizeMessage($rawMessage);

        if ($message === '') {
            throw new ChatbotApiException('Tin nhắn không hợp lệ.');
        }

        $role = $this->determineRole($user);
        $context = $this->fetchContextData($user, $role);
        $messages = $this->buildMessages($role, $user, $message, $context);
        $result = $this->callPreferredProviders($role, $messages);
        $chatMessage = $this->storeConversation($user, $role, $message, $context, $result);

        return [
            'reply' => $result['content'],
            'provider' => $result['provider'],
            'role' => $role,
            'message_id' => $chatMessage->getKey(),
            'latency_ms' => $result['latency_ms'] ?? null,
            'usage' => $result['usage'] ?? [],
        ];
    }

    private function sanitizeMessage(string $message): string
    {
        $clean = strip_tags($message);
        $clean = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $clean ?? '');

        return trim((string) $clean);
    }

    private function determineRole(User $user): string
    {
        if ($user->isAdmin()) {
            return 'admin';
        }

        if ($user->isSeller()) {
            return 'seller';
        }

        if ($user->isShipper()) {
            return 'shipper';
        }

        if ($user->isCustomer()) {
            return 'customer';
        }

        return 'default';
    }

    private function fetchContextData(User $user, string $role): array
    {
        $cacheKey = sprintf('chatbot:context:%s:%d', $role, $user->getKey());

        return Cache::remember($cacheKey, now()->addMinutes(self::CACHE_TTL_MINUTES), function () use ($user, $role) {
            return match ($role) {
                'admin' => $this->gatherAdminContext(),
                'seller' => $this->gatherSellerContext($user),
                'shipper' => $this->gatherShipperContext($user),
                'customer' => $this->gatherCustomerContext($user),
                default => $this->gatherDefaultContext($user),
            };
        });
    }

    private function gatherAdminContext(): array
    {
        $locale = App::getLocale();
        $pendingStatuses = [
            OrderStatus::PENDING_CONFIRMATION,
            OrderStatus::PROCESSING,
            OrderStatus::PENDING_ASSIGNMENT,
            OrderStatus::ASSIGNED_TO_SHIPPER,
            OrderStatus::DELIVERING,
        ];

        $now = Carbon::now();
        $ordersLast30Query = Order::query()
            ->where('created_at', '>=', $now->copy()->subDays(30));

        $lowStockVariants = ProductVariant::query()
            ->lowStock()
            ->with(['product.category'])
            ->orderBy('stock_quantity')
            ->take(5)
            ->get();

        $topCategories = Product::query()
            ->select('category_id', DB::raw('COUNT(*) as total_products'))
            ->whereNotNull('category_id')
            ->groupBy('category_id')
            ->orderByDesc('total_products')
            ->with('category')
            ->take(5)
            ->get();

        $recentReports = AnalyticsReport::query()
            ->latest('created_at')
            ->take(5)
            ->get(['title', 'type', 'status', 'created_at']);

        return [
            'summary' => [
                'total_orders' => Order::count(),
                'orders_last_30_days' => (clone $ordersLast30Query)->count(),
                'revenue_last_30_days' => (float) (clone $ordersLast30Query)->sum('total_amount'),
                'pending_orders' => Order::whereIn('status', array_map(fn ($status) => $status->value, $pendingStatuses))->count(),
            ],
            'low_stock_alerts' => $lowStockVariants->map(function (ProductVariant $variant) use ($locale) {
                return [
                    'sku' => $variant->sku,
                    'stock' => (int) $variant->stock_quantity,
                    'product' => $variant->product?->getTranslation('name', $locale),
                    'category' => $variant->product?->category?->getTranslation('name', $locale),
                ];
            })->values()->all(),
            'top_categories' => $topCategories->map(function (Product $product) use ($locale) {
                return [
                    'category' => $product->category?->getTranslation('name', $locale),
                    'total_products' => (int) $product->total_products,
                ];
            })->values()->all(),
            'inventory_movements_7_days' => (function () {
                $row = InventoryLog::query()
                    ->where('created_at', '>=', Carbon::now()->subDays(7))
                    ->selectRaw('SUM(CASE WHEN quantity_change > 0 THEN quantity_change ELSE 0 END) as stock_in')
                    ->selectRaw('SUM(CASE WHEN quantity_change < 0 THEN ABS(quantity_change) ELSE 0 END) as stock_out')
                    ->first();

                return [
                    'stock_in' => (int) ($row->stock_in ?? 0),
                    'stock_out' => (int) ($row->stock_out ?? 0),
                ];
            })(),
            'recent_reports' => $recentReports->map(fn (AnalyticsReport $report) => [
                'title' => $report->title,
                'type' => $report->type,
                'status' => $report->status,
                'generated_on' => optional($report->created_at)->toDateString(),
            ])->values()->all(),
        ];
    }

    private function gatherSellerContext(User $user): array
    {
        $locale = App::getLocale();
        $now = Carbon::now();

        $ordersQuery = Order::query()->whereHas('items.variant.product', function ($query) use ($user) {
            $query->where('seller_id', $user->getKey());
        });

        $ordersLast7DaysQuery = (clone $ordersQuery)
            ->where('created_at', '>=', $now->copy()->subDays(7));

        $topProducts = OrderItem::query()
            ->select('variant_id', DB::raw('SUM(quantity) as total_quantity'))
            ->whereHas('variant.product', function ($query) use ($user) {
                $query->where('seller_id', $user->getKey());
            })
            ->groupBy('variant_id')
            ->orderByDesc('total_quantity')
            ->with(['variant.product.category'])
            ->take(5)
            ->get();

        $recentInventory = InventoryLog::query()
            ->whereHas('variant.product', function ($query) use ($user) {
                $query->where('seller_id', $user->getKey());
            })
            ->latest('created_at')
            ->take(5)
            ->get();

        return [
            'summary' => [
                'active_products' => $user->products()->count(),
                'orders_last_7_days' => (clone $ordersLast7DaysQuery)->count(),
                'revenue_last_7_days' => (float) (clone $ordersLast7DaysQuery)->sum('total_amount'),
                'total_orders' => $ordersQuery->count(),
            ],
            'top_products' => $topProducts->map(function (OrderItem $item) use ($locale) {
                $product = $item->variant?->product;

                return [
                    'sku' => $item->variant?->sku,
                    'product' => $product?->getTranslation('name', $locale),
                    'category' => $product?->category?->getTranslation('name', $locale),
                    'sold_quantity' => (int) $item->total_quantity,
                ];
            })->values()->all(),
            'inventory_updates' => $recentInventory->map(function (InventoryLog $log) use ($locale) {
                return [
                    'sku' => $log->variant?->sku,
                    'product' => $log->variant?->product?->getTranslation('name', $locale),
                    'change' => (int) $log->quantity_change,
                    'reason' => $log->reason,
                    'updated_at' => optional($log->created_at)->toDateTimeString(),
                ];
            })->values()->all(),
        ];
    }

    private function gatherShipperContext(User $user): array
    {
        $now = Carbon::now();
        $assignedOrders = Order::query()
            ->where('shipper_id', $user->getKey());

        $pendingStatuses = [
            OrderStatus::ASSIGNED_TO_SHIPPER,
            OrderStatus::DELIVERING,
        ];

        $recentDelivered = (clone $assignedOrders)
            ->where('status', OrderStatus::DELIVERED)
            ->latest('updated_at')
            ->take(5)
            ->get(['order_id', 'order_number', 'updated_at']);

        return [
            'summary' => [
                'active_deliveries' => (clone $assignedOrders)->whereIn('status', array_map(fn ($status) => $status->value, $pendingStatuses))->count(),
                'completed_last_7_days' => (clone $assignedOrders)->where('status', OrderStatus::DELIVERED)->where('updated_at', '>=', $now->copy()->subDays(7))->count(),
                'total_assigned' => $assignedOrders->count(),
            ],
            'recent_deliveries' => $recentDelivered->map(fn (Order $order) => [
                'order_number' => $order->order_number,
                'delivered_at' => optional($order->updated_at)->toDateTimeString(),
            ])->values()->all(),
        ];
    }

    private function gatherCustomerContext(User $user): array
    {
        $locale = App::getLocale();

        $recentOrders = $user->orders()
            ->latest('created_at')
            ->with(['items.variant.product'])
            ->take(3)
            ->get();

        $cartItems = CartItem::query()
            ->where('user_id', $user->getKey())
            ->with('variant.product')
            ->take(5)
            ->get();

        $favoriteCategoryIds = $recentOrders->flatMap(function (Order $order) {
            return $order->items->map(fn (OrderItem $item) => $item->variant?->product?->category_id)->filter();
        })->unique()->values()->all();

        $recommendations = Product::query()
            ->with(['category', 'brand'])
            ->when($favoriteCategoryIds, function ($query, $categoryIds) {
                $query->whereIn('category_id', $categoryIds);
            })
            ->latest('updated_at')
            ->take(5)
            ->get();

        return [
            'recent_orders' => $recentOrders->map(function (Order $order) use ($locale) {
                return [
                    'order_number' => $order->order_number,
                    'status' => $order->status instanceof OrderStatus ? $order->status->value : (string) $order->status,
                    'total' => (float) $order->total_amount,
                    'placed_at' => optional($order->created_at)->toDateString(),
                    'top_items' => $order->items->take(2)->map(function (OrderItem $item) use ($locale) {
                        return [
                            'sku' => $item->variant?->sku,
                            'product' => $item->variant?->product?->getTranslation('name', $locale),
                            'quantity' => (int) $item->quantity,
                        ];
                    })->values()->all(),
                ];
            })->values()->all(),
            'cart_preview' => $cartItems->map(function (CartItem $item) use ($locale) {
                return [
                    'sku' => $item->variant?->sku,
                    'product' => $item->variant?->product?->getTranslation('name', $locale),
                    'quantity' => (int) $item->quantity,
                    'price' => (float) ($item->variant?->price ?? 0),
                ];
            })->values()->all(),
            'recommendations' => $recommendations->map(function (Product $product) use ($locale) {
                return [
                    'product' => $product->getTranslation('name', $locale),
                    'category' => $product->category?->getTranslation('name', $locale),
                    'brand' => $product->brand?->getTranslation('name', $locale),
                ];
            })->values()->all(),
        ];
    }

    private function gatherDefaultContext(User $user): array
    {
        return [
            'profile' => [
                'username' => $user->username,
                'email_verified' => (bool) $user->email_verified_at,
                'has_orders' => $user->orders()->exists(),
            ],
        ];
    }

    private function buildMessages(string $role, User $user, string $message, array $context): array
    {
        $system = self::ROLE_SYSTEM_PROMPTS[$role] ?? self::ROLE_SYSTEM_PROMPTS['default'];
        $contextJson = $this->truncateForPrompt(json_encode($context, JSON_UNESCAPED_UNICODE));
        $userProfile = json_encode([
            'id' => $user->getKey(),
            'role' => $role,
            'name' => $user->full_name,
        ], JSON_UNESCAPED_UNICODE);

        $userContent = <<<TEXT
Tin nhắn người dùng: {$message}
Thông tin người dùng: {$userProfile}
Dữ liệu liên quan: {$contextJson}
Hãy trả lời ngắn gọn, ưu tiên bước hành động và đề xuất cụ thể.
TEXT;

        return [
            ['role' => 'system', 'content' => $system],
            ['role' => 'user', 'content' => $userContent],
        ];
    }

    private function truncateForPrompt(?string $payload, int $limit = 3500): string
    {
        $payload = $payload ?? '';

        return Str::limit($payload, $limit, '...');
    }

    private function callPreferredProviders(string $role, array $messages): array
    {
        $providers = self::ROLE_PROVIDER_PRIORITY[$role] ?? self::ROLE_PROVIDER_PRIORITY['default'];
        $failures = [];

        foreach ($providers as $provider) {
            try {
                $model = $this->resolveModel($provider, $role);
                $timeout = Config::get("services.{$provider}.timeout", 20);

                return $this->callProvider($provider, $messages, $model, $timeout);
            } catch (Throwable $exception) {
                $failures[$provider] = $exception->getMessage();
                Log::warning('Chatbot provider failed', [
                    'provider' => $provider,
                    'role' => $role,
                    'error' => $exception->getMessage(),
                ]);
            }
        }

        if (Config::get('services.chatbot.fallback_enabled', true)) {
            Log::notice('Chatbot fallback activated', [
                'role' => $role,
                'providers' => $providers,
                'failures' => $failures,
            ]);

            return $this->buildFallbackResponse($role, $messages, $failures);
        }

        throw new ChatbotApiException('Không thể xử lý yêu cầu chatbot vào lúc này.', $failures);
    }

    private function resolveModel(string $provider, string $role): string
    {
        $override = self::ROLE_MODEL_OVERRIDES[$provider][$role] ?? null;
        if ($override) {
            return $override;
        }

        return Config::get("services.{$provider}.default_model", '');
    }

    private function callProvider(string $provider, array $messages, string $model, int $timeout): array
    {
        $apiKey = Config::get("services.{$provider}.api_key");
        $baseUrl = rtrim(Config::get("services.{$provider}.base_url", ''), '/');
        $verifySsl = Config::get("services.{$provider}.verify_ssl", true);

        if (!$apiKey || !$baseUrl) {
            throw new ChatbotApiException(strtoupper($provider) . ' API key hoặc endpoint chưa được cấu hình.');
        }

        $endpoint = $baseUrl . '/chat/completions';
        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => $provider === 'openai' ? 0.6 : 0.7,
            'max_tokens' => 900,
        ];

        $startedAt = microtime(true);

        $response = Http::timeout($timeout)
            ->withOptions(['verify' => $verifySsl])
            ->withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->withToken($apiKey)
            ->post($endpoint, $payload);

        if ($response->failed()) {
            throw new ChatbotApiException(sprintf('%s API error: %s', strtoupper($provider), $response->body()));
        }

        $data = $response->json();
        $content = trim((string) data_get($data, 'choices.0.message.content', ''));

        if ($content === '') {
            throw new ChatbotApiException(sprintf('%s API trả về phản hồi rỗng.', strtoupper($provider)));
        }

        return [
            'provider' => $provider,
            'content' => $content,
            'usage' => data_get($data, 'usage', []),
            'latency_ms' => (int) round((microtime(true) - $startedAt) * 1000),
            'raw' => $data,
        ];
    }

    private function buildFallbackResponse(string $role, array $messages, array $failures): array
    {
        $question = $this->extractUserPrompt($messages);
        $content = $this->fallbackMessageForRole($role, $question);

        return [
            'provider' => 'fallback',
            'content' => $content,
            'usage' => [
                'fallback' => true,
                'failures' => $failures,
            ],
            'latency_ms' => 0,
            'raw' => [
                'failures' => $failures,
                'role' => $role,
                'user_question' => $question,
            ],
        ];
    }

    private function extractUserPrompt(array $messages): string
    {
        for ($index = count($messages) - 1; $index >= 0; $index--) {
            $message = $messages[$index] ?? [];

            if (($message['role'] ?? null) !== 'user') {
                continue;
            }

            $content = (string) ($message['content'] ?? '');

            if ($content === '') {
                continue;
            }

            if (preg_match('/Tin nhắn người dùng:\s*(.+?)\s*Thông tin người dùng:/su', $content, $matches)) {
                return trim($matches[1]);
            }

            return trim($content);
        }

        return '';
    }

    private function fallbackMessageForRole(string $role, string $question): string
    {
        $question = $question !== '' ? Str::limit($question, 180) : '';

        $templates = [
            'admin' => [
                'intro' => 'Xin lỗi, hệ thống AI đang tạm ngưng phản hồi ngay lúc này.',
                'steps' => [
                    'Mở Dashboard > Analytics để xem các chỉ số cập nhật gần nhất.',
                    'Kiểm tra báo cáo tồn kho thấp trong mục Inventory để xử lý kịp thời.',
                    'Nếu cần hỗ trợ khẩn, hãy liên hệ đội vận hành qua Slack #support.',
                ],
            ],
            'seller' => [
                'intro' => 'Hiện tại trợ lý AI bận xử lý yêu cầu khác.',
                'steps' => [
                    'Xem thống kê bán hàng nhanh trong mục Seller Dashboard.',
                    'Kiểm tra tồn kho bằng cách mở Inventory > Stock Movement.',
                    'Liên hệ quản lý kinh doanh nếu cần cập nhật chương trình khuyến mãi.',
                ],
            ],
            'shipper' => [
                'intro' => 'Trợ lý giao vận đang tạm thời không khả dụng.',
                'steps' => [
                    'Kiểm tra danh sách đơn hàng tại Shipper Dashboard.',
                    'Ưu tiên các đơn gần hết SLA giao hàng.',
                    'Liên hệ điều phối viên nếu cần cập nhật tuyến đường.',
                ],
            ],
            'customer' => [
                'intro' => 'Xin lỗi, hiện tại trợ lý mua sắm đang bận.',
                'steps' => [
                    'Thử tìm sản phẩm qua thanh tìm kiếm hoặc bộ lọc danh mục.',
                    'Kiểm tra giỏ hàng để xem các sản phẩm đã lưu.',
                    'Liên hệ bộ phận hỗ trợ khách hàng qua hotline nếu cần.',
                ],
            ],
            'default' => [
                'intro' => 'Xin lỗi, hệ thống AI đang quá tải và chưa thể trả lời ngay.',
                'steps' => [
                    'Thử làm mới trang và gửi lại yêu cầu sau ít phút.',
                    'Tra cứu tài liệu hướng dẫn trong Trung tâm trợ giúp.',
                    'Liên hệ đội hỗ trợ nếu vấn đề vẫn tiếp diễn.',
                ],
            ],
        ];

        $template = $templates[$role] ?? $templates['default'];
        $steps = $template['steps'] ?? [];
        $parts = [$template['intro']];

        if (!empty($steps)) {
            $parts[] = '- ' . implode(PHP_EOL . '- ', $steps);
        }

        $closing = 'Vui lòng thử lại sau vài phút. Cảm ơn bạn đã kiên nhẫn.';

        if ($question !== '') {
            $closing .= PHP_EOL . 'Nội dung bạn vừa hỏi: "' . $question . '"';
        }

        $parts[] = $closing;

        return implode(PHP_EOL . PHP_EOL, $parts);
    }

    private function storeConversation(User $user, string $role, string $message, array $context, array $result): ChatMessage
    {
        $room = ChatRoom::firstOrCreate(
            [
                'room_name' => sprintf('chatbot:%d:%s', $user->getKey(), $role),
            ],
            [
                'type' => 3,
                'is_active' => true,
            ]
        );

        ChatParticipant::firstOrCreate(
            [
                'chat_room_id' => $room->getKey(),
                'user_id' => $user->getKey(),
            ],
            [
                'joined_at' => Carbon::now(),
            ]
        );

        return ChatMessage::create([
            'chat_room_id' => $room->getKey(),
            'sender_id' => $user->getKey(),
            'role_context' => $role,
            'assistant_api' => $result['provider'] ?? null,
            'content' => $message,
            'assistant_content' => $result['content'] ?? null,
            'context_snapshot' => $this->trimContextForStorage($context),
            'assistant_metadata' => $this->buildAssistantMetadata($result),
            'response_latency_ms' => $result['latency_ms'] ?? null,
        ]);
    }

    private function trimContextForStorage(array $context): array
    {
        $maxItems = 5;

        return collect($context)
            ->map(function ($value) use ($maxItems) {
                if (is_array($value)) {
                    return collect($value)->take($maxItems)->map(function ($item) use ($maxItems) {
                        if (is_array($item)) {
                            return collect($item)->map(fn ($field) => $this->truncateForPrompt(is_scalar($field) ? (string) $field : json_encode($field)))->all();
                        }

                        return $this->truncateForPrompt(is_scalar($item) ? (string) $item : json_encode($item));
                    })->all();
                }

                return $this->truncateForPrompt(is_scalar($value) ? (string) $value : json_encode($value));
            })
            ->all();
    }

    private function buildAssistantMetadata(array $result): array
    {
        return [
            'usage' => $result['usage'] ?? [],
            'latency_ms' => $result['latency_ms'] ?? null,
            'model' => $result['raw']['model'] ?? null,
        ];
    }
}
