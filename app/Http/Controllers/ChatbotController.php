<?php

namespace App\Http\Controllers;

use App\Exceptions\ChatbotApiException;
use App\Services\HybridChatbotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Throwable;

class ChatbotController extends Controller
{
    public function __construct(private readonly HybridChatbotService $chatbotService)
    {
    }

    public function send(Request $request): JsonResponse
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
                ],
            ]);
        } catch (ChatbotApiException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
                'context' => $exception->context(),
            ], 503);
        } catch (Throwable $throwable) {
            report($throwable);

            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xử lý yêu cầu chatbot.',
            ], 500);
        }
    }
}
