import React from 'react'
import { BannerCarousel, QuickActions } from './header/index'

export default function Header() {
  const bannerImages = [
    "https://down-vn.img.susercontent.com/file/sg-11134258-8258f-mg6lcya66n0p6e@resize_w1594_nl.webp",
    "https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mdzzdb1l8q9z77@resize_w1594_nl.webp",
    "https://down-vn.img.susercontent.com/file/sg-11134258-825bd-mg6lpqv7gnwr22@resize_w1594_nl.webp"
  ]

  const quickActions = [
    {
      id: 'flash-sale',
      icon: 'bi-lightning-charge',
      label: 'Flash Sale',
      onClick: () => {
        // Handle flash sale action
        console.log('Flash Sale clicked')
      }
    },
    {
      id: 'loyalty',
      icon: 'bi-heart',
      label: 'Khách hàng thân thiết',
      onClick: () => {
        // Handle loyalty action
        console.log('Loyalty clicked')
      }
    },
    {
      id: 'cart',
      icon: 'bi-bag',
      label: 'Giỏ hàng',
      href: '/cart'
    },
    {
      id: 'chat',
      icon: 'bi-chat-dots',
      label: 'Trò chuyện',
      onClick: () => {
        // Handle chat action
        console.log('Chat clicked')
      }
    },
    {
      id: 'account',
      icon: 'bi-person-circle',
      label: 'Tài khoản',
      href: '/account'
    }
  ]

  return (
    <div className='home-header-container'>
      <header className='home-header'>
        <div className="banner-container">
          <div className="banner-left">
            <BannerCarousel images={bannerImages} />
          </div>
          <div className="banner-right">
            <div className="banner-right-top">
              <img
                src="https://down-vn.img.susercontent.com/file/sg-11134258-824he-mfkmn21e57nyc0@resize_w796_nl.webp"
                alt="Top Banner"
                loading="lazy"
              />
            </div>
            <div className="banner-right-bottom">
              <img
                src="https://down-vn.img.susercontent.com/file/sg-11134258-824h4-mfko8uncdts904@resize_w796_nl.webp"
                alt="Bottom Banner"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <QuickActions actions={quickActions} />
      </header>
    </div>
  )
}
