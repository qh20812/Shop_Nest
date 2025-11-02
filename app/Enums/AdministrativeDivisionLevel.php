<?php

namespace App\Enums;

enum AdministrativeDivisionLevel: int
{
    case PROVINCE = 1;
    case DISTRICT = 2;
    case WARD = 3;
    public function label(): string{
        return match($this){
            self::PROVINCE=>'Province',
            self::DISTRICT=>'District',
            self::WARD=>'Ward',
        };
    }
    public function labelVi():string{
        return match($this){
            self::PROVINCE=>'Tỉnh/Thành phố',
            self::DISTRICT=>'Quận/Huyện',
            self::WARD=>'Phường/Xã',
        };
    }
}
