import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import React from 'react'

export default function BrandIndex() {
  return (
    <AppLayout>
      <Head title='Quản lý thương hiệu' />
      <div className="p-6">
        <h1>Quản lý thương hiệu</h1>
      </div>
    </AppLayout>
  )
}
