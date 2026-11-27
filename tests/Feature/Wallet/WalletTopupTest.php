<?php

namespace Tests\Feature\Wallet;

use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTopup;
use App\Models\WalletTransaction;
use App\Notifications\WalletTopupNotification;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class WalletTopupTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private User $admin;

    private User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        config([
            'wallet.vietqr.bank_bin' => '970407',
            'wallet.vietqr.account_no' => '23712299999999',
            'wallet.vietqr.account_name' => 'HUYNH NGOC QUI',
            'wallet.vietqr.template' => 'compact2',
        ]);

        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        Wallet::create([
            'user_id' => $this->user->id,
            'balance' => 0,
            'total_earned' => 0,
            'total_spent' => 0,
            'currency' => 'VND',
            'status' => 'active',
        ]);
    }

    public function test_user_can_create_topup_with_qr_and_code(): void
    {
        Notification::fake();

        $response = $this->actingAs($this->user)->postJson(route('wallet.topups.store'), [
            'amount' => 100000,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('topup.amount_declared', 100000);

        $topup = WalletTopup::where('user_id', $this->user->id)->firstOrFail();

        $this->assertMatchesRegularExpression('/^[A-Z]{6}$/', $topup->code);
        $this->assertSame(WalletTopup::STATUS_PENDING, $topup->status);
        $this->assertTrue($topup->expires_at->between(now()->addHours(23), now()->addHours(25)));

        $qrUrl = $response->json('topup.qr_url');
        $this->assertStringContainsString('970407-23712299999999', $qrUrl);
        $this->assertStringContainsString('addInfo='.$topup->code, $qrUrl);
        $this->assertStringContainsString('amount=100000', $qrUrl);
    }

    public function test_user_can_only_have_one_active_topup(): void
    {
        $this->actingAs($this->user)->postJson(route('wallet.topups.store'), ['amount' => 100000])
            ->assertStatus(201);

        $this->actingAs($this->user)->postJson(route('wallet.topups.store'), ['amount' => 200000])
            ->assertStatus(422)
            ->assertJsonPath('message', 'You already have a wallet top-up waiting for review.');
    }

    public function test_topup_amount_limits_are_validated(): void
    {
        $this->actingAs($this->user)->postJson(route('wallet.topups.store'), ['amount' => 5000])
            ->assertStatus(422)
            ->assertJsonValidationErrors('amount');

        $this->actingAs($this->user)->postJson(route('wallet.topups.store'), ['amount' => 60000000])
            ->assertStatus(422)
            ->assertJsonValidationErrors('amount');
    }

    public function test_expired_pending_topup_does_not_block_a_new_request(): void
    {
        $old = $this->createTopup();
        WalletTopup::whereKey($old->topup_id)->update(['expires_at' => now()->subMinute()]);

        $this->actingAs($this->user)
            ->postJson(route('wallet.topups.store'), ['amount' => 200000])
            ->assertStatus(201);

        $this->assertSame(WalletTopup::STATUS_EXPIRED, $old->fresh()->status);
        $this->assertSame(2, WalletTopup::where('user_id', $this->user->id)->count());
    }

    public function test_marking_transferred_notifies_admin(): void
    {
        Notification::fake();

        $topup = $this->createTopup();

        $this->actingAs($this->user)
            ->postJson(route('wallet.topups.transferred', $topup))
            ->assertOk()
            ->assertJsonPath('topup.status', WalletTopup::STATUS_TRANSFERRED);

        Notification::assertSentTo($this->admin, WalletTopupNotification::class);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->admin->id,
            'title' => 'Wallet top-up awaiting review',
        ]);
    }

    public function test_expire_command_marks_pending_topups_expired(): void
    {
        $topup = $this->createTopup();
        WalletTopup::whereKey($topup->topup_id)->update(['expires_at' => now()->subMinute()]);

        $this->artisan('wallet-topups:expire')->assertSuccessful();

        $this->assertSame(WalletTopup::STATUS_EXPIRED, $topup->fresh()->status);
    }

    public function test_admin_approves_with_actual_received_amount(): void
    {
        Notification::fake();

        $topup = $this->createTopup(100000);

        $this->actingAs($this->user)->postJson(route('wallet.topups.transferred', $topup))->assertOk();

        $this->actingAs($this->admin)
            ->postJson(route('admin.wallet-topups.approve', $topup), ['amount_received' => 120000])
            ->assertOk()
            ->assertJsonPath('success', true);

        $topup->refresh();
        $this->assertSame(WalletTopup::STATUS_APPROVED, $topup->status);
        $this->assertSame(120000.0, (float) $topup->amount_received);
        $this->assertSame(120000.0, (float) $topup->wallet->fresh()->balance);
        $this->assertSame(20000, (int) $topup->metadata['difference']);

        $this->assertDatabaseHas('wallet_transactions', [
            'wallet_id' => $topup->wallet_id,
            'type' => WalletTransaction::TYPE_TOP_UP,
            'reference_type' => 'wallet_topup',
            'reference_id' => $topup->topup_id,
        ]);

        Notification::assertSentTo($this->user, WalletTopupNotification::class);
    }

    public function test_admin_can_approve_transferred_topup_after_expiry(): void
    {
        $topup = $this->createTopup();

        $this->actingAs($this->user)->postJson(route('wallet.topups.transferred', $topup))->assertOk();
        WalletTopup::whereKey($topup->topup_id)->update(['expires_at' => now()->subHour()]);

        $this->actingAs($this->admin)
            ->postJson(route('admin.wallet-topups.approve', $topup), ['amount_received' => 100000])
            ->assertOk();

        $this->assertSame(WalletTopup::STATUS_APPROVED, $topup->fresh()->status);
    }

    public function test_admin_rejects_topup_with_reason(): void
    {
        Notification::fake();

        $topup = $this->createTopup();

        $this->actingAs($this->admin)
            ->postJson(route('admin.wallet-topups.reject', $topup), ['reason' => 'No matching bank transfer'])
            ->assertOk();

        $topup->refresh();
        $this->assertSame(WalletTopup::STATUS_REJECTED, $topup->status);
        $this->assertSame('No matching bank transfer', $topup->reject_reason);
        $this->assertSame(0.0, (float) $topup->wallet->fresh()->balance);

        Notification::assertSentTo($this->user, WalletTopupNotification::class);
    }

    public function test_user_can_cancel_pending_topup_and_other_users_cannot_access_it(): void
    {
        $topup = $this->createTopup();

        $this->actingAs($this->otherUser)
            ->getJson(route('wallet.topups.show', $topup))
            ->assertStatus(403);

        $this->actingAs($this->otherUser)
            ->postJson(route('wallet.topups.transferred', $topup))
            ->assertStatus(403);

        $this->actingAs($this->user)
            ->postJson(route('wallet.topups.cancel', $topup))
            ->assertOk()
            ->assertJsonPath('topup.status', WalletTopup::STATUS_EXPIRED);
    }

    public function test_customer_cannot_access_admin_topup_queue(): void
    {
        $this->actingAs($this->user)
            ->getJson(route('admin.wallet-topups.index'))
            ->assertRedirect(route('home'));
    }

    private function createTopup(float $amount = 100000): WalletTopup
    {
        $this->actingAs($this->user)
            ->postJson(route('wallet.topups.store'), ['amount' => $amount])
            ->assertStatus(201);

        return WalletTopup::where('user_id', $this->user->id)->latest('topup_id')->firstOrFail();
    }
}
