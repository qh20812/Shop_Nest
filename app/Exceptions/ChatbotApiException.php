<?php

namespace App\Exceptions;

use RuntimeException;

class ChatbotApiException extends RuntimeException
{
    /**
     * @param  string  $message
     * @param  array|null  $context
     */
    public function __construct(string $message, protected ?array $context = null, int $code = 0)
    {
        parent::__construct($message, $code);
    }

    public function context(): ?array
    {
        return $this->context;
    }
}
