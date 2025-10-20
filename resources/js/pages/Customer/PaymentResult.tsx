//@ts-nocheck

import { Head, Link } from '@inertiajs/react';

export default function PaymentResult({ provider, status, message }) {
  return (
    
      <div className="mx-auto max-w-xl p-6 text-center">
        <Head title="Payment Result" />
        <h1 className="mb-2 text-2xl font-semibold">Payment Result</h1>
        <div className={`inline-block rounded px-3 py-1 ${
          status === 'succeeded' ? 'bg-green-100 text-green-700'
          : status === 'canceled' ? 'bg-yellow-100 text-yellow-700'
          : 'bg-red-100 text-red-700'
        }`}>{status}</div>
        <p className="mt-3 text-gray-700">Gate: <b>{provider.toUpperCase()}</b></p>
        {message && <p className="mt-1 text-gray-600">{message}</p>}
        <div className="mt-6"><Link href="/products" className="underline">Continue to Shopping...</Link></div>
      </div>
    
  );
}