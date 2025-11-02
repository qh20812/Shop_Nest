<?php

namespace App\DataTransferObjects\Analytics;

class OrderAnalyticsData implements \JsonSerializable
{
    public function __construct(
        public readonly array $statusDistribution,
        public readonly float $averageOrderValue,
        public readonly array $fulfillment,
        public readonly float $disputeRate,
        public readonly array $conversion,
        public readonly array $filters = []
    ) {}

    public function toArray(): array
    {
        return [
            'statusDistribution' => $this->statusDistribution,
            'averageOrderValue' => $this->averageOrderValue,
            'fulfillment' => $this->fulfillment,
            'disputeRate' => $this->disputeRate,
            'conversion' => $this->conversion,
            'filters' => $this->filters,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
