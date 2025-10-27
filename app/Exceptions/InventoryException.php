<?php

namespace App\Exceptions;

use RuntimeException;

class InventoryException extends RuntimeException
{
    public static function negativeStock(): self
    {
        return new self(__('Stock cannot be negative.'));
    }

    public static function invalidBulkPayload(): self
    {
        return new self(__('Invalid bulk inventory payload provided.'));
    }
}
