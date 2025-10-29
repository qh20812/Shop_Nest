<?php

namespace App\DataTransferObjects\Analytics;

class ReportResult implements \JsonSerializable
{
    public function __construct(
        public readonly string $type,
        public readonly array $filters,
        public readonly array $data,
        public readonly ?string $exportPath = null,
        public readonly ?string $exportFormat = null
    ) {}

    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'filters' => $this->filters,
            'data' => $this->data,
            'exportPath' => $this->exportPath,
            'exportFormat' => $this->exportFormat,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
