<?php

namespace App\DataTransferObjects\Analytics;

class AnalyticsKpiData implements \JsonSerializable
{
    public function __construct(
        public readonly float $totalRevenue,
        public readonly int $pendingOrders,
        public readonly array $userGrowth,
        public readonly float $systemHealth
    ) {}

    public function toArray(): array
    {
        return [
            'totalRevenue' => $this->totalRevenue,
            'pendingOrders' => $this->pendingOrders,
            'userGrowth' => $this->userGrowth,
            'systemHealth' => $this->systemHealth,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
