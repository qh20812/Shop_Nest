import Insights from '@/components/ui/Insights'
import AppLayout from '@/layouts/app/AppLayout'
import React from 'react'

export default function Index() {
  const sidebarItems=[
    {icon: 'bxs-dashboard', label: 'Bảng điều khiển', href: '/admin/dashboard'},
    {icon: 'bxs-shopping-bag-alt', label: 'Sản phẩm', href: '/admin/products'},
    {icon: 'bxs-user-detail', label: 'Người dùng', href: '/admin/users'},
    {icon: 'bxs-category', label: 'Danh mục', href: '/admin/categories'},
    {icon: 'bxs-truck', label: 'Đơn hàng', href: '/admin/orders'},
    {icon: 'bxs-truck', label: 'Trả hàng', href: '/admin/returns'},
    {icon: 'bxs-cog', label: 'Cài đặt', href: '/admin/settings'},
  ];
  const insightsData = [
    { value: 100, title: "Tổng doanh thu" },
    { value: 200, title: "Tổng đơn hàng" },
    { value: 300, title: "Tổng khách hàng" },
    { value: 400, title: "Tổng sản phẩm" },
  ]
  return (
    <AppLayout sidebarItems={sidebarItems}>
      {insightsData.map((item, index) => (
        <Insights key={index} value={item.value} title={item.title} />
      ))}
    </AppLayout>
  )
}
