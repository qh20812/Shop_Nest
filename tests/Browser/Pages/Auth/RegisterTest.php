<?php

namespace Tests\Browser\Pages\Auth;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Hash;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class RegisterTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles for proper registration flow
        $this->seed(RoleSeeder::class);
    }

    /**
     * Test registration page can be displayed.
     */
    public function testRegistrationPageCanBeDisplayed(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->assertSee('Đăng ký')
                    ->assertPresent('input[placeholder="Email"]')
                    ->assertPresent('input[placeholder="Mật khẩu"]')
                    ->assertPresent('input[placeholder="Xác nhận mật khẩu"]')
                    ->assertPresent('button[type="submit"]');
        });
    }

    /**
     * Test user can register successfully.
     */
    public function testUserCanRegister(): void
    {
        $this->browse(function (Browser $browser) {
            $email = 'testuser@example.com';
            $password = 'Password123!';

            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', $email)
                    ->type('input[placeholder="Mật khẩu"]', $password)
                    ->type('input[placeholder="Xác nhận mật khẩu"]', $password)
                    ->press('button[type="submit"]')
                    ->waitForLocation('/email/verify', 10)
                    ->assertPathIs('/email/verify');

            // Check that user was created in database
            $this->assertDatabaseHas('users', [
                'email' => $email,
                'is_active' => true,
                'provider' => 'manual',
            ]);

            // Verify user has customer role
            $user = User::where('email', $email)->first();
            $customerRole = Role::where('name->en', 'Customer')->first();
            $this->assertTrue($user->roles()->where('role_id', $customerRole->id)->exists());

            // Verify username was generated
            $this->assertStringStartsWith('user_', $user->username);

            // Verify password was hashed
            $this->assertTrue(Hash::check($password, $user->password));

            // Verify null fields
            $this->assertNull($user->first_name);
            $this->assertNull($user->last_name);
            $this->assertNull($user->phone_number);
            $this->assertNull($user->avatar);
        });
    }

    /**
     * Test email is required.
     */
    public function testEmailIsRequired(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Mật khẩu"]', 'Password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password123!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test email must be valid.
     */
    public function testEmailMustBeValid(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'invalid-email')
                    ->type('input[placeholder="Mật khẩu"]', 'Password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password123!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test email must be unique.
     */
    public function testEmailMustBeUnique(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'existing@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'Password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password123!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 1); // Only the existing user
        });
    }

    /**
     * Test password is required.
     */
    public function testPasswordIsRequired(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'test@example.com')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test password must be at least 8 characters.
     */
    public function testPasswordMustBeAtLeast8Characters(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'test@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'Pass1!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Pass1!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test password must contain uppercase letter.
     */
    public function testPasswordMustContainUppercase(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'test@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'password123!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test password must contain lowercase letter.
     */
    public function testPasswordMustContainLowercase(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'test@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'PASSWORD123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'PASSWORD123!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test password must contain number.
     */
    public function testPasswordMustContainNumber(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'test@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'Password!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test password must contain special character.
     */
    public function testPasswordMustContainSpecialCharacter(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'test@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'Password123')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password123')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test password confirmation must match.
     */
    public function testPasswordConfirmationMustMatch(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'test@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'Password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'DifferentPassword123!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test multiple users get unique usernames.
     */
    public function testMultipleUsersGetUniqueUsernames(): void
    {
        $this->browse(function (Browser $browser1, Browser $browser2) {
            // Register first user
            $browser1->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'user1@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'Password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password123!')
                    ->press('button[type="submit"]')
                    ->waitForLocation('/email/verify', 10);

            // Register second user
            $browser2->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'user2@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'Password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password123!')
                    ->press('button[type="submit"]')
                    ->waitForLocation('/email/verify', 10);

            $user1 = User::where('email', 'user1@example.com')->first();
            $user2 = User::where('email', 'user2@example.com')->first();

            $this->assertNotEquals($user1->username, $user2->username);
            $this->assertStringStartsWith('user_', $user1->username);
            $this->assertStringStartsWith('user_', $user2->username);
        });
    }

    /**
     * Test authenticated user cannot access registration page.
     */
    public function testAuthenticatedUserCannotAccessRegistrationPage(): void
    {
        $user = User::factory()->create();

        $this->browse(function (Browser $browser) use ($user) {
            $browser->loginAs($user)
                    ->visit('/register')
                    ->assertPathIs('/');
        });
    }

    /**
     * Test registration cannot proceed without customer role.
     */
    public function testRegistrationCannotProceedWithoutCustomerRole(): void
    {
        // Delete customer role
        Role::query()->delete();

        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'test@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'Password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password123!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }

    /**
     * Test form clears on successful registration.
     */
    public function testFormRedirectsOnSuccess(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', 'success@example.com')
                    ->type('input[placeholder="Mật khẩu"]', 'Password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password123!')
                    ->press('button[type="submit"]')
                    ->waitForLocation('/email/verify', 10)
                    ->assertSee('verify'); // Should see email verification page
        });
    }

    /**
     * Test registration with long email (edge case).
     */
    public function testRegistrationWithLongEmail(): void
    {
        $longEmail = str_repeat('a', 256) . '@example.com';

        $this->browse(function (Browser $browser) use ($longEmail) {
            $browser->visit('/register')
                    ->pause(1000)
                    ->type('input[placeholder="Email"]', $longEmail)
                    ->type('input[placeholder="Mật khẩu"]', 'Password123!')
                    ->type('input[placeholder="Xác nhận mật khẩu"]', 'Password123!')
                    ->press('button[type="submit"]')
                    ->pause(1000)
                    ->assertPathIs('/register');

            $this->assertDatabaseCount('users', 0);
        });
    }
}