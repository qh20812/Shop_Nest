<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReturnRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ReturnController extends Controller
{
    /**
     * Hiển thị danh sách tất cả các yêu cầu trả hàng, cho phép lọc theo trạng thái.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['status']);

        $returns = ReturnRequest::query()
            ->with(['order.customer', 'customer']) // Eager load thông tin đơn hàng và khách hàng
            ->when($request->filled('status'), function ($query) use ($request) {
                // Lọc theo trạng thái yêu cầu trả hàng
                $query->where('status', $request->input('status'));
            })
            ->latest() // Sắp xếp theo thời gian tạo mới nhất
            ->paginate(15)
            ->withQueryString(); // Giữ lại các tham số filter khi chuyển trang

        return Inertia::render('Admin/Returns/Index', [
            'returns' => $returns,
            'filters' => $filters,
            // Có thể gửi thêm danh sách các trạng thái để frontend hiển thị bộ lọc
            'statuses' => [
                1 => 'Đang chờ xử lý',
                2 => 'Đã chấp nhận',
                3 => 'Đã từ chối',
                4 => 'Đã hoàn tiền',
                5 => 'Đã đổi hàng',
            ],
        ]);
    }

    /**
     * Xem chi tiết một yêu cầu trả hàng.
     * Bao gồm lý do, sản phẩm yêu cầu trả, thông tin đơn hàng, và lịch sử trao đổi (nếu có).
     */
    public function show(ReturnRequest $returnRequest)
    {
        // Tải chi tiết yêu cầu trả hàng cùng các mối quan hệ cần thiết
        $returnRequest->load([
            'order.customer',
            'order.items.product', // Tải sản phẩm liên quan đến từng item trong đơn hàng
            'customer',
            // 'messages.sender' // Nếu có hệ thống tin nhắn cho yêu cầu trả hàng, tương tự Dispute
        ]);

        return Inertia::render('Admin/Returns/Show', [
            'returnRequest' => $returnRequest,
        ]);
    }

    /**
     * Cập nhật trạng thái của yêu cầu trả hàng.
     * Đây là hành động chính của Admin, ví dụ: chuyển từ "Đang chờ xử lý" sang "Chấp nhận" hoặc "Từ chối".
     */
    public function update(Request $request, ReturnRequest $returnRequest)
    {
        $validated = $request->validate([
            'status' => ['required', 'integer', Rule::in([1, 2, 3, 4, 5])], // Các trạng thái hợp lệ
            'admin_note' => ['nullable', 'string', 'max:1000'], // Ghi chú của admin
        ]);

        $returnRequest->update(['status' => $validated['status']]);

        // TODO: Nếu có hệ thống tin nhắn cho ReturnRequest, thêm ghi chú của admin vào đây
        // if (!empty($validated['admin_note'])) {
        //     $returnRequest->messages()->create([
        //         'sender_id' => Auth::id(), // Admin hiện tại
        //         'content' => $validated['admin_note'],
        //         'is_admin_message' => true, // Đánh dấu là tin nhắn từ admin
        //     ]);
        // }

        return redirect()->route('admin.returns.index')->with('success', 'Cập nhật yêu cầu trả hàng thành công.');
    }
}

