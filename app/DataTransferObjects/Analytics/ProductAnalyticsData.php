<?php

namespace App\DataTransferObjects\Analytics;

class ProductAnalyticsData implements \JsonSerializable
{
    public function __construct(
        public readonly array $topProducts,
        public readonly array $categoryPerformance,
        public readonly array $inventoryTurnover,
        public readonly array $lowStock,
        public readonly array $filters = []
    ) {}

    public function toArray(): array
    {
        return [
            'topProducts' => $this->topProducts,
            'categoryPerformance' => $this->categoryPerformance,
            'inventoryTurnover' => $this->inventoryTurnover,
            'lowStock' => $this->lowStock,
            'filters' => $this->filters,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
