<?php

namespace App\Http\Controllers;

use App\Events\MessageCreated;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class ChatController extends Controller
{
	public function __construct()
	{
		$this->middleware('throttle:10,1')->only('sendMessage');
	}

	/**
	 * Retrieve conversations for the authenticated account.
	 */
	public function index()
	{
		$user = $this->resolveAuthenticatedUser();

		abort_if(is_null($user), 401, 'Unauthenticated');

		$conversations = Conversation::query()
			->where(function ($query) use ($user) {
				$query->where('user_id', $user->id)
					->orWhere('receiver_id', $user->id);
			})
			->latest('updated_at')
			->with([
				'user:id,username,first_name,last_name,email',
				'receiver:id,username,first_name,last_name,email',
				'messages' => fn ($query) => $query->latest('created_at')->take(50)->orderBy('created_at'),
				'messages.sender:id,username,first_name,last_name,email',
			])
			->paginate(10);

		return ConversationResource::collection($conversations);
	}

	/**
	 * Persist a chat message for the active conversation.
	 */
	public function sendMessage(Request $request)
	{
		$validated = $request->validate([
			'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
			'content' => ['required', 'string', 'max:1000', function (string $attribute, mixed $value, callable $fail): void {
				if (trim((string) $value) === '') {
					$fail('Nội dung tin nhắn không được để trống.');
				}
			}],
		]);

		$validated['content'] = trim($validated['content']);

		$user = $this->resolveAuthenticatedUser();

		abort_if(is_null($user), 401, 'Unauthenticated');

		$conversation = Conversation::query()
			->where('id', $validated['conversation_id'])
			->where(function ($query) use ($user) {
				$query->where('user_id', $user->id)
					->orWhere('receiver_id', $user->id);
			})
			->firstOrFail();

		$message = Message::create([
			'conversation_id' => $conversation->id,
			'sender_id' => $user->id,
			'content' => $validated['content'],
		])->load('sender:id,username,first_name,last_name,email');

		// Touch conversation to update its updated_at timestamp
		$conversation->touch();

		try {
			broadcast(new MessageCreated($message))->toOthers();
		} catch (Throwable $exception) {
			Log::error('Failed to broadcast chat message.', [
				'conversation_id' => $conversation->id,
				'message_id' => $message->id,
				'user_id' => $user->id,
				'error' => $exception->getMessage(),
			]);
		}

		return (new MessageResource($message))
			->response()
			->setStatusCode(201);
	}

	/**
	 * Create a new conversation (if needed) and persist the first message.
	 */
	public function createConversation(Request $request)
	{
		$user = $this->resolveAuthenticatedUser();

		abort_if(is_null($user), 401, 'Unauthenticated');

		$validated = $request->validate([
			'receiver_id' => [
				'required',
				'integer',
				'exists:users,id',
				Rule::notIn([$user->id]),
				function (string $attribute, mixed $value, callable $fail): void {
					$receiver = User::find($value);
					if ($receiver && is_null($receiver->email_verified_at)) {
						$fail('Không thể gửi tin nhắn cho người dùng chưa xác thực email.');
					}
				},
			],
			'content' => ['required', 'string', 'max:1000', function (string $attribute, mixed $value, callable $fail): void {
				if (trim((string) $value) === '') {
					$fail('Nội dung tin nhắn không được để trống.');
				}
			}],
		]);

		$receiverId = (int) $validated['receiver_id'];
		$content = trim($validated['content']);

		$conversation = Conversation::query()
			->where(function ($query) use ($user, $receiverId) {
				$query->where('user_id', $user->id)
					->where('receiver_id', $receiverId);
			})
			->orWhere(function ($query) use ($user, $receiverId) {
				$query->where('user_id', $receiverId)
					->where('receiver_id', $user->id);
			})
			->first();

		if (! $conversation) {
			$conversation = Conversation::create([
				'user_id' => $user->id,
				'receiver_id' => $receiverId,
			]);
		}

		$message = Message::create([
			'conversation_id' => $conversation->id,
			'sender_id' => $user->id,
			'content' => $content,
		])->load('sender:id,username,first_name,last_name,email');

		try {
			broadcast(new MessageCreated($message))->toOthers();
		} catch (Throwable $exception) {
			Log::error('Failed to broadcast chat message.', [
				'conversation_id' => $conversation->id,
				'message_id' => $message->id,
				'user_id' => $user->id,
				'error' => $exception->getMessage(),
			]);
		}

		return response()->json([
			'conversation' => new ConversationResource(
				$conversation->load([
					'user:id,username,first_name,last_name,email',
					'receiver:id,username,first_name,last_name,email',
				])
			),
			'message' => new MessageResource($message),
		], 201);
	}

	/**
	 * Search for potential chat participants.
	 */
	public function searchUsers(Request $request)
	{
		$user = $this->resolveAuthenticatedUser();

		abort_if(is_null($user), 401, 'Unauthenticated');

		$validated = $request->validate([
			'q' => ['required', 'string', 'max:255'],
			'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
		]);

		$term = trim($validated['q']);

		if ($term === '') {
			return response()->json(['data' => []]);
		}

		$limit = (int) ($validated['limit'] ?? 10);
		$limit = max(1, min(50, $limit));

		$likeTerm = '%' . str_replace(['%', '_'], ['\%', '\_'], $term) . '%';
		
		$driver = DB::connection()->getDriverName();

		$users = User::query()
			->where('id', '!=', $user->id)
			->where(function ($query) use ($likeTerm, $driver) {
				$query->where('username', 'like', $likeTerm)
					->orWhere('email', 'like', $likeTerm)
					->orWhere('first_name', 'like', $likeTerm)
					->orWhere('last_name', 'like', $likeTerm);
				
				// Handle full name search with driver-specific syntax
				if ($driver === 'mysql') {
					$query->orWhereRaw("TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))) LIKE ?", [$likeTerm]);
				} else {
					// SQLite
					$query->orWhereRaw("TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')) LIKE ?", [$likeTerm]);
				}
			})
			->orderByRaw("CASE WHEN first_name IS NULL OR first_name = '' THEN 1 ELSE 0 END")
			->orderByRaw("CASE WHEN last_name IS NULL OR last_name = '' THEN 1 ELSE 0 END")
			->orderBy('first_name')
			->orderBy('last_name')
			->orderBy('username')
			->limit($limit)
			->get(['id', 'username', 'first_name', 'last_name', 'email']);

		return response()->json([
			'data' => $users->map(fn (User $candidate) => [
				'id' => $candidate->id,
				'username' => $candidate->username,
				'first_name' => $candidate->first_name,
				'last_name' => $candidate->last_name,
				'email' => $candidate->email,
				'name' => trim(($candidate->first_name ?? '') . ' ' . ($candidate->last_name ?? ''))
					?: ($candidate->username ?? $candidate->email ?? 'Người dùng'),
			]),
		]);
	}

	/**
	 * Resolve the authenticated user across configured guards.
	 */
	protected function resolveAuthenticatedUser(): ?Authenticatable
	{
		$defaultGuard = config('auth.defaults.guard') ?: 'web';

		if ($defaultGuard && Auth::guard($defaultGuard)->check()) {
			return Auth::guard($defaultGuard)->user();
		}

		return Auth::user();
	}
}
