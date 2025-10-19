<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentReturnController extends Controller
{
    public function handle(Request $req, string $provider)
    {
        $gateway = PaymentService::make($provider);
        $result = $gateway->handleReturn($req->all());

        $orderId = $req->query('order_id')
            ?? $req->input('orderId')
            ?? $req->input('vnp_TxnRef');

        if ($orderId && $order = Order::find($orderId)) {
            $payment = $order->payment;
            $payment->update([
                'status' => $result['status'],
                'transaction_id' => $result['transaction_id'] ?? $payment->transaction_id,
                'raw_payload' => $req->all()
            ]);
            $order->update(
                ['status' => $result['status'] === 'succeded' ? 'paid' : (
                    $result['status'] === 'canceled' ? 'canceled' : 'failed'
                )]
            );
            session()->forget('cart');
        }

        return Inertia::render('PaymentResult', [
            'provider' => $provider,
            'status' => $result['status'],
            'message' => $result['message'] ?? '',
        ]);
    }
}