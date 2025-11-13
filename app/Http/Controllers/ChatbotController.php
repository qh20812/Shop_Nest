<?php

namespace App\Http\Controllers;

use App\Exceptions\ChatbotApiException;
use App\Services\HybridChatbotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class ChatbotController extends Controller
{
    public function __construct(private readonly HybridChatbotService $chatbotService)
    {
    }

    public function send(Request $request)
    {
        Gate::authorize('chatbot.access', $request->user());

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:500'],
        ]);

        try {
            $result = $this->chatbotService->sendMessage($request->user(), $validated['message']);

            // If this is an Inertia request, return back with flash data
            if ($request->header('X-Inertia')) {
                return back()->with('chatbot_reply', [
                    'reply' => $result['reply'],
                    'provider' => $result['provider'],
                    'role' => $result['role'],
                    'message_id' => $result['message_id'],
                    'latency_ms' => $result['latency_ms'],
                    'usage' => $result['usage'],
                ]);
            }

            // Otherwise, return JSON for API requests
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
            if ($request->header('X-Inertia')) {
                return back()->withErrors(['chatbot' => $exception->getMessage()]);
            }

            return response()->json([
                'message' => $exception->getMessage(),
                'context' => $exception->context(),
            ], 503);
        } catch (Throwable $throwable) {
            report($throwable);

            if ($request->header('X-Inertia')) {
                return back()->withErrors(['chatbot' => 'Đã xảy ra lỗi khi xử lý yêu cầu chatbot.']);
            }

            return response()->json([
                'message' => 'Đã xảy ra lỗi khi xử lý yêu cầu chatbot.',
            ], 500);
        }
    }
}
