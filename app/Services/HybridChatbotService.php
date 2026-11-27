<?php

namespace App\Services;

use App\Exceptions\ChatbotApiException;
use App\Models\ChatMessage;
use App\Models\ChatParticipant;
use App\Models\ChatRoom;
use App\Models\User;
use App\Services\ContextGatherers\AdminContextGatherer;
use App\Services\ContextGatherers\CustomerContextGatherer;
use App\Services\ContextGatherers\DefaultContextGatherer;
use App\Services\ContextGatherers\SellerContextGatherer;
use App\Services\ContextGatherers\ShipperContextGatherer;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Throwable;

class HybridChatbotService
{
    private const CACHE_TTL_MINUTES = 5;

    private const HISTORY_TURNS = 6;

    private const HISTORY_TURN_CHARS = 600;

    private const HISTORY_LIMIT = 20;

    private const HISTORY_LIMIT_MAX = 50;

    private array $contextGatherers;

    public function __construct(private readonly ChatbotProductRecommender $productRecommender)
    {
        $this->contextGatherers = [
            'admin' => new AdminContextGatherer,
            'seller' => new SellerContextGatherer,
            'shipper' => new ShipperContextGatherer,
            'customer' => new CustomerContextGatherer,
            'default' => new DefaultContextGatherer,
        ];
    }

    private const ROLE_PROVIDER_PRIORITY = [
        'admin' => ['groq', 'openai'],
        'seller' => ['groq', 'openai'],
        'shipper' => ['groq', 'openai'],
        'customer' => ['groq', 'openai'],
        'default' => ['groq', 'openai'],
    ];

    private const ROLE_SYSTEM_PROMPTS = [
        'admin' => 'Bạn là cố vấn vận hành cho nền tảng thương mại điện tử Shop Nest. Hãy phân tích dữ liệu, ưu tiên insight có thể hành động được, đề xuất bước tiếp theo rõ ràng.Trả lời đúng theo bối cảnh chẳng hạn như người dùng chào thì phải chào lại bằng ngữ điệu thân thiện lịch sự.Tuy nhiên không phải câu hỏi nào cũng trả lời, chẳng hạn như người dùng hỏi 1 câu hỏi không liên quan đến hệ thống e-commerce như "Hôm nay thời tiết như thế nào?" thì hãy trả lời "Xin lỗi, tôi chỉ có thể hỗ trợ các câu hỏi liên quan đến nền tảng thương mại điện tử Shop Nest.". Trả lời bằng ngôn ngữ của người dùng (mặc định tiếng Việt), có thể bổ sung thuật ngữ tiếng Anh nếu cần.',
        'seller' => 'Bạn là trợ lý kinh doanh cho nhà bán tại Shop Nest. Hãy đưa ra gợi ý bán hàng, tối ưu tồn kho và chiến lược khuyến mãi dựa trên dữ liệu được cung cấp. Trả lời bằng ngôn ngữ của người dùng (mặc định tiếng Việt), thân thiện.',
        'shipper' => 'Bạn là điều phối viên giao vận tại Shop Nest. Hãy giúp shipper nắm trạng thái đơn hàng, ưu tiên tuyến giao hàng và lưu ý dịch vụ khách hàng. Trả lời bằng ngôn ngữ của người dùng (mặc định tiếng Việt), ngắn gọn, rõ ràng.',
        'customer' => 'Bạn là hướng dẫn viên mua sắm cho khách hàng tại Shop Nest. Hãy đưa ra tư vấn cá nhân hóa, gợi ý sản phẩm phù hợp và giải thích quy trình rõ ràng, thân thiện bằng ngôn ngữ của người dùng (mặc định tiếng Việt).',
        'default' => 'Bạn là trợ lý hỗ trợ tại Shop Nest. Hãy cung cấp thông tin chính xác, súc tích bằng ngôn ngữ của người dùng (mặc định tiếng Việt).',
    ];

    public function sendMessage(User $user, string $rawMessage): array
    {
        $message = $this->sanitizeMessage($rawMessage);

        $validator = Validator::make(['message' => $message], [
            'message' => 'required|string|min:1|max:1000',
        ]);

        if ($validator->fails()) {
            throw new ChatbotApiException('Tin nhắn không hợp lệ: '.$validator->errors()->first());
        }

        if ($message === '') {
            throw new ChatbotApiException('Tin nhắn không hợp lệ.');
        }

        $role = $this->determineRole($user);

        // Greeting thuần: trả lời local ngay, không gọi context gatherer/AI.
        // Không áp rate limit vì không gọi provider bên ngoài.
        if ($this->isPureGreeting($message)) {
            $result = $this->buildLocalGreeting($role, $user);
            $chatMessage = $this->storeConversation($user, $role, $message, [], $result);

            return $this->buildResponsePayload($role, $chatMessage, $result);
        }

        if (RateLimiter::tooManyAttempts('chatbot:'.$user->getKey(), 10)) {
            throw new ChatbotApiException('Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau.');
        }

        RateLimiter::hit('chatbot:'.$user->getKey(), 60); // 10 per minute

        $context = $this->fetchContextData($user, $role);

        $followUpProductIds = $this->followUpProductIds($user, $role, $message);

        if ($followUpProductIds !== []) {
            $context['follow_up_product_ids'] = $followUpProductIds;
        }

        $products = $this->canReceiveProductCards($user)
            ? $this->productRecommender->recommend($user, $message, $context)
            : [];

        $history = $this->recentTurns($user, $role);
        $messages = $this->buildMessages($role, $user, $message, $context, $products, $history);
        $result = $this->callPreferredProviders($role, $messages);
        $result['products'] = $products;
        $chatMessage = $this->storeConversation($user, $role, $message, $context, $result);

        return $this->buildResponsePayload($role, $chatMessage, $result);
    }

    /**
     * Lịch sử hội thoại chatbot của chính người dùng, cũ nhất trước.
     *
     * @return array<int, array<string, mixed>>
     */
    public function history(User $user, int $limit = self::HISTORY_LIMIT): array
    {
        $roomId = $this->findRoomId($user, $this->determineRole($user));

        if ($roomId === null) {
            return [];
        }

        $limit = max(1, min($limit, self::HISTORY_LIMIT_MAX));

        return ChatMessage::query()
            ->where('chat_room_id', $roomId)
            ->whereNotNull('assistant_content')
            ->orderByDesc('chat_message_id')
            ->limit($limit)
            ->get(['chat_message_id', 'content', 'assistant_content', 'assistant_metadata', 'created_at'])
            ->reverse()
            ->map(fn (ChatMessage $chatMessage): array => [
                'id' => (int) $chatMessage->chat_message_id,
                'user_content' => (string) $chatMessage->content,
                'assistant_content' => (string) $chatMessage->assistant_content,
                'products' => $chatMessage->assistant_metadata['products'] ?? [],
                'created_at' => $chatMessage->created_at?->toIso8601String(),
            ])
            ->values()
            ->all();
    }

    /**
     * Xoá toàn bộ lượt trò chuyện chatbot của người dùng, giữ lại room/participant.
     */
    public function clearHistory(User $user): int
    {
        $roomId = $this->findRoomId($user, $this->determineRole($user));

        if ($roomId === null) {
            return 0;
        }

        return ChatMessage::query()->where('chat_room_id', $roomId)->delete();
    }

    private function buildResponsePayload(string $role, ChatMessage $chatMessage, array $result): array
    {
        return [
            'reply' => $result['content'],
            'provider' => $result['provider'],
            'role' => $role,
            'message_id' => $chatMessage->getKey(),
            'latency_ms' => $result['latency_ms'] ?? null,
            'usage' => $result['usage'] ?? [],
            'products' => $result['products'] ?? [],
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
        $user->loadMissing('roles');
        $roleNames = $user->roles
            ->map(fn ($role) => $role->getTranslation('name', 'en'))
            ->all();

        return match (true) {
            in_array('Admin', $roleNames, true) => 'admin',
            in_array('Seller', $roleNames, true) => 'seller',
            in_array('Shipper', $roleNames, true) => 'shipper',
            in_array('Customer', $roleNames, true) => 'customer',
            default => 'default',
        };
    }

    private function fetchContextData(User $user, string $role): array
    {
        $cacheKey = sprintf('chatbot:context:%s:%d', $role, $user->getKey());

        try {
            return Cache::remember($cacheKey, now()->addMinutes(self::CACHE_TTL_MINUTES), function () use ($user, $role) {
                $gatherer = $this->contextGatherers[$role] ?? $this->contextGatherers['default'];

                return $gatherer->gather($user);
            });
        } catch (Throwable $exception) {
            // Context chỉ là dữ liệu phụ; lỗi truy vấn không được làm hỏng cả câu trả lời.
            Log::warning('Chatbot context gathering failed', [
                'role' => $role,
                'user_id' => $user->getKey(),
                'error' => $exception->getMessage(),
            ]);

            return [];
        }
    }

    private function canReceiveProductCards(User $user): bool
    {
        $user->loadMissing('roles');

        return $user->roles->contains(
            fn ($role) => $role->getTranslation('name', 'en') === 'Customer'
        );
    }

    /**
     * Xác định các sản phẩm được nhắc tới ở câu hỏi tiếp nối dựa trên thẻ sản phẩm
     * của lượt trả lời gần nhất.
     *
     * @return array<int, int>
     */
    private function followUpProductIds(User $user, string $role, string $message): array
    {
        $reference = $this->followUpReference($message);

        if ($reference === null) {
            return [];
        }

        $roomId = $this->findRoomId($user, $role);

        if ($roomId === null) {
            return [];
        }

        $lastWithProducts = ChatMessage::query()
            ->where('chat_room_id', $roomId)
            ->whereNotNull('assistant_content')
            ->orderByDesc('chat_message_id')
            ->limit(10)
            ->get(['chat_message_id', 'assistant_metadata'])
            ->first(fn (ChatMessage $chatMessage) => ! empty($chatMessage->assistant_metadata['products'] ?? []));

        $products = collect($lastWithProducts?->assistant_metadata['products'] ?? [])
            ->map(fn ($product) => (int) ($product['id'] ?? 0))
            ->filter()
            ->unique()
            ->values();

        if ($products->isEmpty()) {
            return [];
        }

        if ($reference === 'all') {
            return $products->take(3)->all();
        }

        if ($reference === 'last') {
            return [(int) $products->last()];
        }

        return $products->has($reference - 1) ? [(int) $products[$reference - 1]] : [];
    }

    /**
     * @return int|string|null Số thứ tự (1-based), 'all', 'last' hoặc null nếu không phải follow-up.
     */
    private function followUpReference(string $message): int|string|null
    {
        $normalized = mb_strtolower($message);

        if (preg_match('/(?:cái|mẫu|sản phẩm|chiếc|món|đôi)\s+(?:thứ|số)\s*(\d+)/u', $normalized, $matches)) {
            return max(1, (int) $matches[1]);
        }

        if (preg_match('/(?:đầu tiên|thứ nhất)/u', $normalized)) {
            return 1;
        }

        if (preg_match('/cuối cùng/u', $normalized)) {
            return 'last';
        }

        if (preg_match('/(?:cái đó|mẫu đó|sản phẩm đó|chiếc đó|món đó|cái này|mẫu này|sản phẩm này|chiếc này|món này)/u', $normalized)) {
            return 'all';
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $context
     * @param  array<int, array<string, mixed>>  $products
     * @param  array<int, array{role: string, content: string}>  $history
     * @return array<int, array{role: string, content: string}>
     */
    private function buildMessages(string $role, User $user, string $message, array $context, array $products = [], array $history = []): array
    {
        $system = self::ROLE_SYSTEM_PROMPTS[$role] ?? self::ROLE_SYSTEM_PROMPTS['default'];
        $contextJson = $this->truncateForPrompt(json_encode($context, JSON_UNESCAPED_UNICODE));
        $userProfile = json_encode([
            'id' => $user->getKey(),
            'role' => $role,
            'name' => $user->full_name,
        ], JSON_UNESCAPED_UNICODE);

        $productCandidates = $products !== []
            ? $this->truncateForPrompt(json_encode($products, JSON_UNESCAPED_UNICODE))
            : 'Không có sản phẩm ứng viên phù hợp.';

        $userContent = <<<TEXT
Tin nhắn người dùng: {$message}
Thông tin người dùng: {$userProfile}
Dữ liệu liên quan: {$contextJson}
Danh sách sản phẩm ứng viên (chỉ được tư vấn trong danh sách này, không bịa thêm sản phẩm/giá): {$productCandidates}
Hãy trả lời phù hợp với tin nhắn, sử dụng dữ liệu và lịch sử hội thoại nếu cần.
TEXT;

        return [
            ['role' => 'system', 'content' => $system],
            ...$history,
            ['role' => 'user', 'content' => $userContent],
        ];
    }

    private function truncateForPrompt(?string $payload, int $limit = 3500): string
    {
        $payload = $payload ?? '';

        return Str::limit($payload, $limit, '...');
    }

    private function isPureGreeting(string $message): bool
    {
        $normalized = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $message) ?? $message;
        $normalized = preg_replace('/\s+/u', ' ', trim($normalized)) ?? '';
        $normalized = mb_strtolower($normalized);

        $greetings = [
            'hi', 'hi there', 'hello', 'hey', 'alo',
            'chao', 'xin chao', 'chao ban', 'chao shop', 'chao shopnest',
            'hi shop', 'hello shop', 'hi shopnest', 'hello shopnest',
            'shop oi', 'shopnest',
            'chào', 'xin chào', 'chào bạn', 'chào shop', 'chào shopnest', 'shop ơi',
        ];

        return in_array($normalized, $greetings, true);
    }

    private function buildLocalGreeting(string $role, User $user): array
    {
        $name = $user->full_name;
        $templates = [
            'admin' => "Xin chào {$name}! Mình có thể hỗ trợ phân tích doanh thu, tồn kho, đơn hàng hoặc vận hành. Bạn muốn xem chỉ số nào?",
            'seller' => "Xin chào {$name}! Mình có thể hỗ trợ về đơn hàng, tồn kho, sản phẩm và khuyến mãi. Bạn cần tư vấn gì?",
            'shipper' => "Xin chào {$name}! Mình có thể giúp kiểm tra đơn giao, tuyến đường và trạng thái vận chuyển. Bạn cần hỗ trợ gì?",
            'customer' => "Xin chào {$name}! Mình có thể gợi ý sản phẩm, kiểm tra đơn hàng hoặc giải đáp về Shop Nest. Bạn đang tìm gì hôm nay?",
            'default' => "Xin chào {$name}! Mình có thể giúp gì cho bạn hôm nay?",
        ];

        return [
            'provider' => 'local',
            'content' => $templates[$role] ?? $templates['default'],
            'usage' => ['local' => true],
            'latency_ms' => 0,
            'products' => [],
            'raw' => ['local' => true, 'role' => $role],
        ];
    }

    private function callPreferredProviders(string $role, array $messages): array
    {
        $providers = self::ROLE_PROVIDER_PRIORITY[$role] ?? self::ROLE_PROVIDER_PRIORITY['default'];
        $failures = [];
        $deadline = microtime(true) + max(1, (int) Config::get('services.chatbot.total_timeout', 25));

        foreach ($providers as $provider) {
            $remaining = (int) floor($deadline - microtime(true));

            if ($remaining < 1) {
                $failures[$provider] = 'Bỏ qua do hết thời gian chờ.';

                continue;
            }

            try {
                $model = $this->resolveModel($provider, $role);
                $timeout = min((int) Config::get("services.{$provider}.timeout", 20), $remaining);

                return $this->callProvider($provider, $messages, $model, max(1, $timeout));
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
        $roleModel = Config::get("services.{$provider}.role_models.{$role}");

        if (is_string($roleModel) && $roleModel !== '') {
            return $roleModel;
        }

        return (string) Config::get("services.{$provider}.default_model", '');
    }

    private function callProvider(string $provider, array $messages, string $model, int $timeout): array
    {
        $apiKey = Config::get("services.{$provider}.api_key");
        $baseUrl = rtrim(Config::get("services.{$provider}.base_url", ''), '/');
        $verifySsl = Config::get("services.{$provider}.verify_ssl", true);

        if (! $apiKey || ! $baseUrl) {
            throw new ChatbotApiException(strtoupper($provider).' API key hoặc endpoint chưa được cấu hình.');
        }

        $endpoint = $baseUrl.'/chat/completions';
        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => $provider === 'openai' ? 0.6 : 0.7,
            'max_tokens' => 900,
        ];

        $startedAt = microtime(true);

        $response = Http::timeout($timeout)
            ->connectTimeout(min(5, max(1, $timeout)))
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

        if (! empty($steps)) {
            $parts[] = '- '.implode(PHP_EOL.'- ', $steps);
        }

        $closing = 'Vui lòng thử lại sau vài phút. Cảm ơn bạn đã kiên nhẫn.';

        if ($question !== '') {
            $closing .= PHP_EOL.'Nội dung bạn vừa hỏi: "'.$question.'"';
        }

        $parts[] = $closing;

        return implode(PHP_EOL.PHP_EOL, $parts);
    }

    private function storeConversation(User $user, string $role, string $message, array $context, array $result): ChatMessage
    {
        return ChatMessage::create([
            'chat_room_id' => $this->ensureRoomId($user, $role),
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

    private function roomName(User $user, string $role): string
    {
        return sprintf('chatbot:%d:%s', $user->getKey(), $role);
    }

    private function findRoomId(User $user, string $role): ?int
    {
        $roomId = ChatRoom::query()
            ->where('room_name', $this->roomName($user, $role))
            ->value('chat_room_id');

        return $roomId !== null ? (int) $roomId : null;
    }

    private function ensureRoomId(User $user, string $role): int
    {
        $cacheKey = sprintf('chatbot:room:%d:%s', $user->getKey(), $role);
        $cachedId = Cache::get($cacheKey);

        if ($cachedId !== null) {
            if (ChatRoom::query()->whereKey($cachedId)->exists()) {
                return (int) $cachedId;
            }

            // Room bị xoá (vd dọn dữ liệu) nhưng cache vẫn còn: xoá cache để tạo lại.
            Cache::forget($cacheKey);
        }

        return (int) Cache::remember(
            $cacheKey,
            now()->addDay(),
            function () use ($user, $role): int {
                $room = ChatRoom::firstOrCreate(
                    [
                        'room_name' => $this->roomName($user, $role),
                    ],
                    [
                        'type' => 3, // 3 = chatbot room (1 user-user, 2 user-seller)
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

                return (int) $room->getKey();
            }
        );
    }

    /**
     * Vài lượt gần nhất để model giữ mạch hội thoại.
     *
     * @return array<int, array{role: string, content: string}>
     */
    private function recentTurns(User $user, string $role, int $limit = self::HISTORY_TURNS): array
    {
        $roomId = $this->findRoomId($user, $role);

        if ($roomId === null) {
            return [];
        }

        $turns = ChatMessage::query()
            ->where('chat_room_id', $roomId)
            ->whereNotNull('assistant_content')
            ->orderByDesc('chat_message_id')
            ->limit($limit)
            ->get(['content', 'assistant_content'])
            ->reverse();

        $history = [];

        foreach ($turns as $turn) {
            $history[] = [
                'role' => 'user',
                'content' => Str::limit((string) $turn->content, self::HISTORY_TURN_CHARS),
            ];
            $history[] = [
                'role' => 'assistant',
                'content' => Str::limit((string) $turn->assistant_content, self::HISTORY_TURN_CHARS),
            ];
        }

        return $history;
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
            'products' => collect($result['products'] ?? [])
                ->map(fn ($product) => [
                    'id' => $product['id'] ?? null,
                    'name' => $product['name'] ?? null,
                    'image' => $product['image'] ?? null,
                    'price' => $product['price'] ?? null,
                    'compare_at' => $product['compare_at'] ?? null,
                    'rating' => $product['rating'] ?? null,
                    'review_count' => $product['review_count'] ?? 0,
                    'shop_name' => $product['shop_name'] ?? null,
                    'url' => $product['url'] ?? null,
                    'badges' => $product['badges'] ?? [],
                    'stock' => $product['stock'] ?? 'in',
                ])
                ->values()
                ->all(),
        ];
    }
}
