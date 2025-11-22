import React from 'react'
import { usePage } from '@inertiajs/react'
import Sidebar from '@/Components/customer/ui/Sidebar'
import '@/../css/customer-style/customer-layout.css'
import '@/../css/customer-style/customer-sidebar.css'
import Navbar from '@/Components/home/ui/Navbar'
import Footer from '@/Components/home/ui/Footer'

interface User {
  id: number
  username: string
  name?: string | null
  first_name?: string | null
  last_name?: string | null
  email: string
  avatar?: string | null
  avatar_url?: string | null
}

interface CustomerLayoutProps {
  children: React.ReactNode
}

function CustomerLayout({ children }: CustomerLayoutProps) {
  const { props } = usePage<{ auth: { user: User } }>()
  const user = props.auth?.user || null

  return (
    <div className="customer-layout-wrapper">
      <Navbar />
      <div className="customer-layout-root">
        <div className="customer-layout-container">
          <div className="customer-layout-grid">
            <Sidebar user={user} />
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CustomerLayout
