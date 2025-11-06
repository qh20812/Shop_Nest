<?php

namespace Tests\Unit;

use App\Support\Localization;
use PHPUnit\Framework\TestCase;

class LocalizationTest extends TestCase
{
    public function testResolveFieldReturnsPreferredLocaleValue(): void
    {
        $value = ['vi' => 'Xin chào', 'en' => 'Hello'];

        $this->assertSame('Xin chào', Localization::resolveField($value, 'vi'));
        $this->assertSame('Hello', Localization::resolveField($value, 'en'));
    }

    public function testResolveFieldFallsBackToEnglishValue(): void
    {
        $value = ['fr' => 'Bonjour', 'en' => 'Hello'];

        $this->assertSame('Hello', Localization::resolveField($value, 'vi'));
    }

    public function testResolveNumberHandlesLocalizedArrays(): void
    {
        $value = ['vi' => '120000', 'en' => '100000'];

        $this->assertSame(120000.0, Localization::resolveNumber($value, 'vi'));
        $this->assertSame(100000.0, Localization::resolveNumber($value, 'en'));
    }

    public function testResolveNumberParsesNumericString(): void
    {
        $this->assertSame(12345.67, Localization::resolveNumber('12,345.67', 'en'));
        $this->assertSame(1234567.0, Localization::resolveNumber('1.234.567', 'vi'));
    }
}
