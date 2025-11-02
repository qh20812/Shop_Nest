<?php

namespace App\DataTransferObjects\Analytics;

class RevenueAnalyticsData implements \JsonSerializable
{
    public function __construct(
        public readonly array $timeSeries,
        public readonly array $byCategory,
        public readonly array $bySeller,
        public readonly array $topProducts,
        public readonly array $filters = []
    ) {}

    public function toArray(): array
    {
        return [
            'timeSeries' => $this->timeSeries,
            'byCategory' => $this->byCategory,
            'bySeller' => $this->bySeller,
            'topProducts' => $this->topProducts,
            'filters' => $this->filters,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
