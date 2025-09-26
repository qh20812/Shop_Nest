<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReturnRequest extends Model
{
    use HasFactory;

    /**
     * Các hằng số định nghĩa trạng thái của yêu cầu trả hàng.
     */

    const STATUS_PENDING = 1; // Đang chờ xử lý
    const STATUS_APPROVED = 2; // Đã chấp nhận
    const STATUS_REJECTED = 3; // Đã từ chối
    const STATUS_REFUNDED = 4; // Đã hoàn tiền
    const STATUS_EXCHANGED = 5; // Đã đổi hàng

    /**
     * Chỉ định rõ tên bảng mà model này sử dụng.
     *
     * @var string
     */
    protected $table = 'returns';

    protected $primaryKey = 'return_id';
    public $timestamps = true;

    protected $fillable = [
        'order_id',
        'customer_id',
        'return_number',
        'reason',
        'description',
        'status',
        'refund_amount',
        'type',
        'admin_note', // sửa thành admin_note để khớp với controller
        'processed_at',
        'refunded_at'
    ];

    /**
     * Lấy các sản phẩm liên quan đến yêu cầu trả hàng.
     */
    public function items(): HasMany
    {
        return $this->hasMany(ReturnItem::class, 'return_id');
    }

    /**
     * Lấy thông tin đơn hàng liên quan đến yêu cầu trả hàng.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /**
     * Lấy thông tin khách hàng liên quan đến yêu cầu trả hàng.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'return_id';
    }
}
