<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class OrderController extends Controller
{
    /**
     * Display a paginated list of all orders with filtering capabilities.
     */
    public function index(Request $request): Response
    {
        $query = Order::with(['customer:id,first_name,last_name,email'])
            ->select([
                'order_id', 
                'customer_id', 
                'order_number', 
                'total_amount', 
                'status', 
                'payment_status', 
                'created_at'
            ]);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('first_name', 'like', "%{$search}%")
                                   ->orWhere('last_name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        // Calculate summary statistics for ALL orders (not just current page)
        $pendingCount = Order::where('status', 'pending_confirmation')->count();
        $completedCount = Order::whereIn('status', ['completed', 'delivered'])->count();
        $cancelledCount = Order::whereIn('status', ['cancelled', 'returned'])->count();
        $totalCount = Order::count();

        // Get filter options for the frontend
        $statusOptions = [
            'pending_confirmation' => 'Pending Confirmation',
            'processing' => 'Processing', 
            'pending_assignment' => 'Pending Assignment',
            'assigned_to_shipper' => 'Assigned to Shipper',
            'delivering' => 'Delivering',
            'delivered' => 'Delivered',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'returned' => 'Returned'
        ];

        $paymentStatusOptions = [
            'unpaid' => 'Unpaid',
            'paid' => 'Paid',
            'failed' => 'Failed',
            'refunded' => 'Refunded'
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status', 'from_date', 'to_date', 'search']),
            'statusOptions' => $statusOptions,
            'paymentStatusOptions' => $paymentStatusOptions,
            'orderSummary' => [
                'totalCount' => $totalCount,
                'pendingCount' => $pendingCount,
                'completedCount' => $completedCount,
                'cancelledCount' => $cancelledCount,
            ],
            'currency' => 'VND',
            'exchangeRates' => [
                'VND' => 25000,
                'USD' => 1,
                'EUR' => 0.85,
                'GBP' => 0.73,
                'JPY' => 110
            ]
        ]);
    }

    /**
     * Display detailed view of a single order with all related data.
     */
    public function show(Order $order): Response
    {
        $order->load([
            'customer:id,first_name,last_name,email,phone_number',
            'shippingAddress:id,address_line_1,address_line_2,city,state,postal_code,country',
            'items.variant.product:id,name,image_url',
            'items.variant:id,product_id,sku,price,attributes',
            'promotions:promotion_id,name,type,value'
        ]);

        // Get available shippers for assignment
        $availableShippers = User::whereHas('roles', function ($query) {
            $query->where('name', 'Shipper');
        })->where('is_active', true)
          ->select('id', 'first_name', 'last_name', 'email')
          ->get();

        // Calculate order totals
        $orderSummary = [
            'subtotal' => $order->sub_total,
            'shipping_fee' => $order->shipping_fee,
            'discount_amount' => $order->discount_amount,
            'total_amount' => $order->total_amount,
            'paid_amount' => $this->calculatePaidAmount($order),
            'refunded_amount' => $this->calculateRefundedAmount($order)
        ];

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'availableShippers' => $availableShippers,
            'orderSummary' => $orderSummary
        ]);
    }

    /**
     * Assign a shipper to an order for last-mile delivery.
     */
    public function assignShipper(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'shipper_id' => [
                'required',
                'exists:users,id',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->whereHas('roles', function ($roleQuery) {
                        $roleQuery->where('name', 'Shipper');
                    })->where('is_active', true);
                })
            ]
        ]);

        try {
            DB::transaction(function () use ($request, $order) {
                // Update order with shipper assignment
                $order->update([
                    'shipper_id' => $request->shipper_id,
                    'status' => 'assigned_to_shipper' // Set to assigned when assigned to shipper
                ]);

                // Create shipment journey record if the table exists
                if (DB::getSchemaBuilder()->hasTable('shipment_journeys')) {
                    DB::table('shipment_journeys')->insert([
                        'order_id' => $order->order_id,
                        'shipper_id' => $request->shipper_id,
                        'journey_type' => 'last_mile',
                        'status' => 'assigned',
                        'assigned_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            });

            return redirect()->back()->with('success', 'Shipper assigned successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to assign shipper. Please try again.');
        }
    }

    /**
     * Process a refund for an order.
     */
    public function createRefund(Request $request, Order $order): RedirectResponse
    {
        $paidAmount = $this->calculatePaidAmount($order);
        $refundedAmount = $this->calculateRefundedAmount($order);
        $availableForRefund = $paidAmount - $refundedAmount;

        $request->validate([
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                "max:{$availableForRefund}"
            ],
            'reason' => 'required|string|max:500'
        ]);

        try {
            DB::transaction(function () use ($request, $order, $availableForRefund) {
                // Create transaction record if the table exists
                if (DB::getSchemaBuilder()->hasTable('transactions')) {
                    DB::table('transactions')->insert([
                        'order_id' => $order->order_id,
                        'type' => 'refund',
                        'amount' => $request->amount,
                        'reason' => $request->reason,
                        'status' => 'completed',
                        'processed_by' => Auth::id(),
                        'processed_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }

                // Update order status based on refund amount
                $newRefundedAmount = $this->calculateRefundedAmount($order) + $request->amount;
                $paidAmount = $this->calculatePaidAmount($order);
                
                if ($newRefundedAmount >= $paidAmount) {
                    $order->update(['payment_status' => 'refunded']);
                } else {
                    // For partially refunded, we might need to add a new constant or use existing one
                    $order->update(['payment_status' => 'refunded']);
                }
            });

            return redirect()->back()->with('success', 'Refund processed successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to process refund. Please try again.');
        }
    }

    /**
     * Calculate the total paid amount for an order.
     */
    private function calculatePaidAmount(Order $order): float
    {
        if (!DB::getSchemaBuilder()->hasTable('transactions')) {
            return $order->total_amount; // Fallback if transactions table doesn't exist
        }

        return DB::table('transactions')
            ->where('order_id', $order->order_id)
            ->where('type', 'payment')
            ->where('status', 'completed')
            ->sum('amount') ?? 0;
    }

    /**
     * Calculate the total refunded amount for an order.
     */
    private function calculateRefundedAmount(Order $order): float
    {
        if (!DB::getSchemaBuilder()->hasTable('transactions')) {
            return 0; // Fallback if transactions table doesn't exist
        }

        return DB::table('transactions')
            ->where('order_id', $order->order_id)
            ->where('type', 'refund')
            ->where('status', 'completed')
            ->sum('amount') ?? 0;
    }
}
