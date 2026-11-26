<?php

namespace App\Http\Controllers;

use App\Exceptions\ChatbotApiException;
use App\Services\HybridChatbotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Throwable;

class ChatbotController extends Controller
{
    public function __construct(private readonly HybridChatbotService $chatbotService) {}

    public function send(Request $request)
    {
        Gate::authorize('chatbot.access', $request->user());

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:500'],
        ]);

        try {
            $result = $this->chatbotService->sendMessage($request->user(), $validated['message']);

            return response()->json([
                'data' => [
                    'reply' => $result['reply'],
                    'provider' => $result['provider'],
                    'role' => $result['role'],
                    'message_id' => $result['message_id'],
                    'latency_ms' => $result['latency_ms'],
                    'usage' => $result['usage'],
                    'products' => $result['products'] ?? [],
                ],
            ]);
        } catch (ChatbotApiException $exception) {
            // Chi tiết lỗi provider chỉ ghi log phía server, không trả ra client.
            Log::warning('Chatbot request failed', [
                'message' => $exception->getMessage(),
                'context' => $exception->context(),
            ]);

            return response()->json([
                'message' => $exception->getMessage(),
            ], 503);
        } catch (Throwable $throwable) {
            report($throwable);

            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xử lý yêu cầu chatbot.',
            ], 500);
        }
    }

    /**
     * Lịch sử hội thoại chatbot của người dùng hiện tại (phục hồi khi đổi thiết bị).
     */
    public function history(Request $request)
    {
        Gate::authorize('chatbot.access', $request->user());

        $turns = $this->chatbotService->history(
            $request->user(),
            max(1, $request->integer('limit', 20))
        );

        return response()->json([
            'data' => [
                'turns' => $turns,
            ],
        ]);
    }

    /**
     * Xoá lịch sử hội thoại chatbot của người dùng hiện tại.
     */
    public function destroyHistory(Request $request)
    {
        Gate::authorize('chatbot.access', $request->user());

        return response()->json([
            'data' => [
                'deleted' => $this->chatbotService->clearHistory($request->user()),
            ],
        ]);
    }
}
