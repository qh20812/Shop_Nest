<?php

namespace Tests\Feature\Errors;

use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ErrorPageTest extends TestCase
{
    public function test_missing_route_renders_the_custom_404_page(): void
    {
        $response = $this->get('/khong-ton-tai-'.uniqid());

        $response->assertNotFound();
        $response->assertSee('Không tìm thấy trang');
        $response->assertSee('error-panel', false);
        $response->assertSee('Về trang chủ');
    }

    #[DataProvider('errorPages')]
    public function test_error_view_is_self_contained(int $status, string $title, string $message): void
    {
        $html = view("errors.{$status}")->render();

        $this->assertStringContainsString((string) $status, $html);
        $this->assertStringContainsString($title, $html);
        $this->assertStringContainsString($message, $html);
        $this->assertStringContainsString('Về trang chủ', $html);
        $this->assertStringContainsString('prefers-color-scheme: dark', $html);
        $this->assertStringContainsString('/fonts/be-vietnam-pro/', $html);
        $this->assertStringNotContainsString('@vite', $html);
    }

    public static function errorPages(): array
    {
        return [
            '419' => [419, 'Phiên làm việc đã hết hạn', 'Trang đã hết hiệu lực.'],
            '429' => [429, 'Quá nhiều yêu cầu', 'Bạn thao tác quá nhanh.'],
            '500' => [500, 'Máy chủ gặp sự cố', 'ShopNest đang xử lý lỗi này.'],
            '503' => [503, 'Tạm thời bảo trì', 'ShopNest đang bảo trì ngắn.'],
        ];
    }
}
