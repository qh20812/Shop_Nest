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
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Services\ContextGatherers\AdminContextGatherer;
use App\Services\ContextGatherers\ContextGathererInterface;
use App\Services\ContextGatherers\CustomerContextGatherer;
use App\Services\ContextGatherers\DefaultContextGatherer;
use App\Services\ContextGatherers\SellerContextGatherer;
use App\Services\ContextGatherers\ShipperContextGatherer;

class HybridChatbotService
{
    private const CACHE_TTL_MINUTES = 5;

    private array $contextGatherers;

    public function __construct()
    {
        $this->contextGatherers = [
            'admin' => new AdminContextGatherer(),
            'seller' => new SellerContextGatherer(),
            'shipper' => new ShipperContextGatherer(),
            'customer' => new CustomerContextGatherer(),
            'default' => new DefaultContextGatherer(),
        ];
    }

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

        $validator = Validator::make(['message' => $message], [
            'message' => 'required|string|min:1|max:1000',
        ]);

        if ($validator->fails()) {
            throw new ChatbotApiException('Tin nhắn không hợp lệ: ' . $validator->errors()->first());
        }

        if (RateLimiter::tooManyAttempts('chatbot:' . $user->getKey(), 10)) {
            throw new ChatbotApiException('Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau.');
        }

        RateLimiter::hit('chatbot:' . $user->getKey(), 60); // 10 per minute

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
            $gatherer = $this->contextGatherers[$role] ?? $this->contextGatherers['default'];

            return $gatherer->gather($user);
        });
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
        $maxItems = 3; // Reduced from 5

        return collect($context)
            ->map(function ($value) use ($maxItems) {
                if (is_array($value)) {
                    return collect($value)->take($maxItems)->map(function ($item) {
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
