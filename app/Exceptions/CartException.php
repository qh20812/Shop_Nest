<?php

namespace App\Exceptions;

use App\Models\ProductVariant;
use RuntimeException;

class CartException extends RuntimeException
{
    public static function insufficientStock(ProductVariant $variant, int $requestedQuantity): self
    {
        return new self('Insufficient stock available for the selected product.');
    }

    public static function promotionInactive(string $code): self
    {
        return new self('This promotion code is inactive or expired.');
    }

    public static function promotionUsageLimitReached(string $code): self
    {
        return new self('This promotion code has reached its usage limit.');
    }

    public static function promotionPerCustomerLimitReached(string $code): self
    {
        return new self('You have already used this promotion code the maximum number of times allowed.');
    }

    public static function promotionBudgetExceeded(string $code): self
    {
        return new self('This promotion code is no longer available.');
    }

    public static function promotionMinimumNotMet(string $code): self
    {
        return new self('The cart total does not meet the minimum required for this promotion.');
    }

    public static function promotionNotFound(string $code): self
    {
        return new self('The promotion code you entered is not valid.');
    }
}
