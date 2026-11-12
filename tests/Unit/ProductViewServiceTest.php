<?php

namespace Tests\Unit;

use App\Models\Product;
use App\Services\Seller\ProductViewService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductViewServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ProductViewService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ProductViewService;
    }

    public function test_prepare_for_view_returns_correct_structure()
    {
        $product = Product::factory()->create();
        $product->variants()->create(['sku' => 'TEST', 'price' => 100, 'stock_quantity' => 50]);

        $result = $this->service->prepareForView($product);

        $this->assertArrayHasKey('variants', $result);
        $this->assertArrayHasKey('images', $result);
        $this->assertArrayHasKey('name_en', $result);
        $this->assertArrayHasKey('description_en', $result);
        $this->assertEquals('TEST', $result['variants'][0]['sku']);
        $this->assertEquals(50, $result['variants'][0]['stock_quantity']);
    }

    public function test_prepare_for_view_loads_relations()
    {
        $product = Product::factory()->create();

        $result = $this->service->prepareForView($product);

        $this->assertArrayHasKey('category', $result);
        $this->assertArrayHasKey('brand', $result);
        $this->assertArrayHasKey('images', $result);
        $this->assertArrayHasKey('variants', $result);
        $this->assertArrayHasKey('reviews', $result);
    }
}
