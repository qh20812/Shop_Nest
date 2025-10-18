<?php

namespace App\Enums;

enum InventoryLogReason: string
{
    case SALE = 'sale';
    case RETURN = 'return';
    case RESTOCK = 'restock';
    case ADJUSTMENT = 'adjustment';
}