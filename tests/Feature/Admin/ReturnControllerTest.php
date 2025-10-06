<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\ReturnRequest;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReturnControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $customer;
    private ReturnRequest $returnRequest;

    protected function setUp(): void
    {
        parent::setUp();

        // Chạy seeder để tạo roles
        $this->seed(RoleSeeder::class);

        // Tạo user với vai trò Admin
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        // Tạo user với vai trò Customer
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());

        // Tạo một đơn hàng cho customer
        $order = Order::factory()->create(['customer_id' => $this->customer->id]);

        // Tạo một yêu cầu trả hàng mẫu (không dùng factory để tránh conflict)
        $this->returnRequest = ReturnRequest::create([
            'customer_id' => $this->customer->id,
            'order_id' => $order->order_id, // Sử dụng đúng primary key
            'return_number' => 'RTN-TEST-' . time(),
            'reason' => 1,
            'description' => 'Test return request',
            'status' => 1, // Đang chờ xử lý
            'refund_amount' => 100.00,
            'type' => 1, // Refund
        ]);
    }

    /**
     * Test khách (chưa đăng nhập) không thể truy cập trang quản lý yêu cầu trả hàng.
     */
    public function test_khach_hang_chua_dang_nhap_khong_the_truy_cap(): void
    {
        $response = $this->get(route('admin.returns.index'));
        $response->assertRedirect(route('login'));
    }

    /**
     * Test người dùng không phải Admin không thể truy cập.
     */
    public function test_khach_hang_khong_phai_admin_khong_the_truy_cap(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.returns.index'));
        
        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    /**
     * Test Admin có thể xem danh sách yêu cầu trả hàng thành công.
     */
    public function test_admin_co_the_xem_danh_sach_yeu_cau_tra_hang(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.returns.index'));

        $response->assertStatus(200);
    }

    /**
     * Test chức năng lọc yêu cầu trả hàng theo trạng thái.
     */
    public function test_admin_co_the_loc_yeu_cau_tra_hang_theo_trang_thai(): void
    {
        // Tạo thêm return request với status khác
        $order2 = Order::factory()->create(['customer_id' => $this->customer->id]);
        ReturnRequest::create([
            'customer_id' => $this->customer->id,
            'order_id' => $order2->order_id,
            'return_number' => 'RTN-TEST-2-' . time(),
            'reason' => 2,
            'description' => 'Test return request 2',
            'status' => 2, // Đã chấp nhận
            'refund_amount' => 200.00,
            'type' => 1,
        ]);

        // Test lọc theo trạng thái "Đang chờ xử lý" (status = 1)
        $response = $this->actingAs($this->admin)
            ->get(route('admin.returns.index', ['status' => 1]));

        $response->assertStatus(200);

        // Test lọc theo trạng thái "Đã chấp nhận" (status = 2)
        $response = $this->actingAs($this->admin)
            ->get(route('admin.returns.index', ['status' => 2]));

        $response->assertStatus(200);
    }

    /**
     * Test Admin có thể xem chi tiết một yêu cầu trả hàng cụ thể.
     */
    public function test_admin_co_the_xem_chi_tiet_yeu_cau_tra_hang(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.returns.show', $this->returnRequest));

        $response->assertStatus(200);
    }

    /**
     * Test khách không thể xem chi tiết yêu cầu trả hàng.
     */
    public function test_khach_hang_chua_dang_nhap_khong_the_xem_chi_tiet_yeu_cau_tra_hang(): void
    {
        $response = $this->get(route('admin.returns.show', $this->returnRequest));
        $response->assertRedirect(route('login'));
    }

    /**
     * Test Customer không thể xem chi tiết yêu cầu trả hàng trong admin panel.
     */
    public function test_khách_hang_khong_phai_admin_khong_the_xem_chi_tiet_yeu_cau_tra_hang(): void
    {
        $response = $this->actingAs($this->customer)
            ->get(route('admin.returns.show', $this->returnRequest));
        
        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    /**
     * Test Admin có thể cập nhật trạng thái yêu cầu trả hàng thành công.
     */
    public function test_admin_co_the_cap_nhat_trang_thai_yeu_cau_tra_hang_thanh_cong()
    {
        $response = $this->actingAs($this->admin)->put(route('admin.returns.update', $this->returnRequest), [
            'status' => 2,
            'admin_note' => 'Approved by admin'
        ]);
        
        $response->assertRedirect(route('admin.returns.index'));
        $response->assertSessionHas('success', 'Cập nhật yêu cầu trả hàng thành công.');
        
        $this->returnRequest->refresh();
        $this->assertEquals(2, $this->returnRequest->status);
    }

    /**
     * Test cập nhật với tất cả các trạng thái hợp lệ.
     */
    public function test_admin_co_the_cap_nhat_voi_tat_ca_cac_trang_thai_hop_le(): void
    {
        $validStatuses = [1, 2, 3, 4, 5]; // Tất cả trạng thái hợp lệ

        foreach ($validStatuses as $status) {
            $returnRequest = ReturnRequest::create([
                'order_id' => Order::factory()->create(['customer_id' => $this->customer->id])->order_id,
                'customer_id' => $this->customer->id,
                'return_number' => 'RTN-TEST-' . $status . '-' . time(),
                'reason' => 'Test reason',
                'description' => 'Test description',
                'status' => 1,
                'refund_amount' => 100.00,
                'type' => 1,
            ]);

            $response = $this->actingAs($this->admin)
                ->put(route('admin.returns.update', $returnRequest), [
                    'status' => $status,
                    'admin_note' => "Updated to status {$status}"
                ]);

            $response->assertRedirect(route('admin.returns.index'));
            $response->assertSessionHas('success');

            $returnRequest->refresh();
            $this->assertEquals($status, $returnRequest->status);
        }
    }

    /**
     * Test việc cập nhật sẽ thất bại nếu status không hợp lệ.
     */
    public function test_admin_cap_nhat_yeu_cau_tra_hang_that_bai_voi_trang_thai_khong_hop_le(): void
    {
        $updateData = [
            'status' => 99, // Trạng thái không hợp lệ
            'admin_note' => 'Invalid status test'
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.returns.update', $this->returnRequest), $updateData);

        $response->assertSessionHasErrors('status');

        // Kiểm tra trạng thái không thay đổi
        $this->returnRequest->refresh();
        $this->assertEquals(1, $this->returnRequest->status); // Vẫn giữ nguyên trạng thái ban đầu
    }

    /**
     * Test việc cập nhật sẽ thất bại nếu status không hợp lệ.
     */
    public function test_admin_co_the_cap_nhat_yeu_cau_tra_hang_voi_trang_thai_khong_hop_le(): void
    {
        $updateData = [
            'status' => 999, // Trạng thái không hợp lệ
            'admin_note' => 'Test note',
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.returns.update', $this->returnRequest), $updateData);

        $response->assertSessionHasErrors('status');

        // Kiểm tra trạng thái không thay đổi
        $this->returnRequest->refresh();
        $this->assertEquals(1, $this->returnRequest->status); // Vẫn giữ nguyên trạng thái ban đầu
    }

    /**
     * Test việc cập nhật sẽ thất bại nếu thiếu trường required.
     */
    public function test_admin_cap_nhat_yeu_cau_tra_hang_that_bai_khi_thieu_truong_required(): void
    {
        $updateData = [
            // Thiếu trường status bắt buộc
            'admin_note' => 'Missing status field'
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.returns.update', $this->returnRequest), $updateData);

        $response->assertSessionHasErrors('status');
    }

    /**
     * Test việc cập nhật với admin_note quá dài sẽ thất bại.
     */
    public function test_admin_cap_nhat_yeu_cau_tra_hang_that_bai_voi_admin_note_qua_dai(): void
    {
        $updateData = [
            'status' => 2,
            'admin_note' => str_repeat('a', 1001) // Vượt quá 1000 ký tự
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.returns.update', $this->returnRequest), $updateData);

        $response->assertSessionHasErrors('admin_note');
    }

    /**
     * Test việc cập nhật với admin_note quá dài sẽ thất bại.
     */
    public function test_admin_co_the_cap_nhat_yeu_cau_tra_hang_voi_admin_note_qua_dai(): void
    {
        $updateData = [
            'status' => 2,
            'admin_note' => str_repeat('a', 1001), // Quá 1000 ký tự
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.returns.update', $this->returnRequest), $updateData);

        $response->assertSessionHasErrors('admin_note');
    }

        /**
     * Test cập nhật với admin_note null hoặc rỗng vẫn thành công.
     */
    public function test_admin_co_the_cap_nhat_yeu_cau_tra_hang_voi_admin_note_null_hoac_rong(): void
    {
        $updateData = [
            'status' => 3,
            'admin_note' => null // admin_note có thể null
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.returns.update', $this->returnRequest), $updateData);

        $response->assertRedirect(route('admin.returns.index'));
        $response->assertSessionHas('success', 'Cập nhật yêu cầu trả hàng thành công.');

        // Kiểm tra trạng thái đã được cập nhật
        $this->returnRequest->refresh();
        $this->assertEquals(3, $this->returnRequest->status);
    }

    /**
     * Test khách không thể cập nhật yêu cầu trả hàng.
     */
    public function test_khach_chua_dang_nhap_khong_the_cap_nhat_yeu_cau_tra_hang(): void
    {
        $updateData = [
            'status' => 2,
            'admin_note' => 'Guest trying to update'
        ];

        $response = $this->put(route('admin.returns.update', $this->returnRequest), $updateData);
        $response->assertRedirect(route('login'));
    }

    /**
     * Test khách không thể cập nhật yêu cầu trả hàng.
     */
    public function test_khach_hang_khong_the_cap_nhat_yeu_cau_tra_hang(): void
    {
        $updateData = [
            'status' => 2,
            'admin_note' => 'Test note',
        ];

        $response = $this->put(route('admin.returns.update', $this->returnRequest), $updateData);
        $response->assertRedirect(route('login'));
    }

    /**
     * Test Customer không thể cập nhật yêu cầu trả hàng trong admin panel.
     */
    public function test_khach_hang_khong_phai_admin_khong_the_cap_nhat_yeu_cau_tra_hang(): void
    {
        $updateData = [
            'status' => 2,
            'admin_note' => 'Test note',
        ];

        $response = $this->actingAs($this->customer)
            ->put(route('admin.returns.update', $this->returnRequest), $updateData);
        
        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    /**
     * Test pagination hoạt động đúng trên trang danh sách.
     */
    public function test_admin_co_the_xem_danh_sach_yeu_cau_tra_hang_voi_pagination(): void
    {
        // Tạo nhiều return requests để test pagination
        for ($i = 0; $i < 20; $i++) {
            $order = Order::factory()->create(['customer_id' => $this->customer->id]);
            ReturnRequest::create([
                'customer_id' => $this->customer->id,
                'order_id' => $order->order_id,
                'return_number' => 'RTN-TEST-' . $i . '-' . time(),
                'reason' => 1,
                'description' => "Test return request {$i}",
                'status' => 1,
                'refund_amount' => 100.00,
                'type' => 1,
            ]);
        }

        $response = $this->actingAs($this->admin)->get(route('admin.returns.index'));

        $response->assertStatus(200);
    }
}
