<?php

namespace App\DataTransferObjects\Analytics;

class UserAnalyticsData implements \JsonSerializable
{
    public function __construct(
        public readonly array $growthSeries,
        public readonly array $segments,
        public readonly array $retention,
        public readonly array $activeUsers,
        public readonly array $filters = []
    ) {}

    public function toArray(): array
    {
        return [
            'growthSeries' => $this->growthSeries,
            'segments' => $this->segments,
            'retention' => $this->retention,
            'activeUsers' => $this->activeUsers,
            'filters' => $this->filters,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
