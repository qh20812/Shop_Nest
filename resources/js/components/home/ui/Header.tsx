import React, { useState } from 'react'

export default function Header() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    "https://down-vn.img.susercontent.com/file/sg-11134258-824iz-mfjuzif470uk2d@resize_w1594_nl.webp",
    "https://down-vn.img.susercontent.com/file/vn-50009109-ee5cf4e9e3e4476088de8f5ce2f2ab7c@resize_w1594_nl.webp",
    "https://down-vn.img.susercontent.com/file/vn-50009109-d9c8c01ba1dc7e2c7c1a2fa1c7e5d0f9@resize_w1594_nl.webp"
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <div className='home-header-container'>
      <header className='home-header'>
        <div className="banner-container">
          <div className="banner-left">
            <div className="banner-carousel">
              <div className="carousel-slides">
                {bannerImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Banner ${index + 1}`}
                    className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  />
                ))}
              </div>
              <button className="carousel-nav carousel-nav-prev" onClick={prevSlide} aria-label="Previous">
                <i className="bi bi-chevron-left"></i>
              </button>
              <button className="carousel-nav carousel-nav-next" onClick={nextSlide} aria-label="Next">
                <i className="bi bi-chevron-right"></i>
              </button>
              <div className="carousel-dots">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="banner-right">
            <div className="banner-right-top">
              <img src="https://down-vn.img.susercontent.com/file/sg-11134258-824he-mfkmn21e57nyc0@resize_w796_nl.webp" alt="Top Banner" />
            </div>
            <div className="banner-right-bottom">
              <img src="https://down-vn.img.susercontent.com/file/sg-11134258-824h4-mfko8uncdts904@resize_w796_nl.webp" alt="Bottom Banner" />
            </div>
          </div>
        </div>
        <div className="quick-action">
          <button className="quick-action-btn">
            <i className='bi bi-lightning-charge quick-action-icon icon-flash'></i>
            <span>Flash Sale</span>
          </button>
          <button className="quick-action-btn">
            <i className='bi bi-heart quick-action-icon icon-heart'></i>
            <span>Khách hàng thân thiết</span>
          </button>
          <button className="quick-action-btn">
            <i className='bi bi-bag quick-action-icon icon-bag'></i>
            <span>Giỏ hàng</span>
          </button>
          <button className="quick-action-btn">
            <i className='bi bi-chat-dots quick-action-icon icon-chat'></i>
            <span>Trò chuyện</span>
          </button>
          <button className="quick-action-btn">
            <i className='bi bi-person-circle quick-action-icon icon-person'></i>
            <span>Tài khoản</span>
          </button>
        </div>
      </header>
    </div>
  )
}
