import React from 'react'
import { BannerCarousel } from './header/index'

export default function Header() {
  const bannerImages = [
    "https://dummyimage.com/1920x650/000/fff",
    "https://dummyimage.com/1920x650/333333/fff",
    "https://dummyimage.com/1920x650/666266/ffffff"
  ]

  return (
    <div className='home-header-container'>
      <header className='home-header'>
        <div className="banner-container">
          <div className="banner-left">
            <BannerCarousel images={bannerImages} />
          </div>
        </div>
      </header>
    </div>
  )
}
