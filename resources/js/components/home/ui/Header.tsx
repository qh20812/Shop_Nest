import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../lib/i18n';

function Header() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();
  
  // Dữ liệu carousel (có thể thay bằng ảnh thật)
  const carouselImages = [
    {
      id: 1,
      src: 'https://down-vn.img.susercontent.com/file/sg-11134258-824gi-mfcbg2vsem8b45@resize_w1594_nl.webp',
      alt: 'Sale 50% toàn bộ sản phẩm',
      fallback: 'https://down-vn.img.susercontent.com/file/sg-11134258-824gi-mfcbg2vsem8b45@resize_w1594_nl.webp'
    },
    {
      id: 2,
      src: 'https://down-vn.img.susercontent.com/file/sg-11134258-824i5-mfdww715xednbf@resize_w1594_nl.webp',
      alt: 'Khuyến mãi mùa hè',
      fallback: 'https://cf.shopee.vn/file/sg-11134258-7rdvo-mcbsynano63k01_xxhdpi'
    },
    {
      id: 3,
      src: 'https://down-vn.img.susercontent.com/file/sg-11134258-824i6-mfcbg3aobpxo63@resize_w1594_nl.webp',
      alt: 'Siêu sale cuối tuần',
      fallback: 'https://cf.shopee.vn/file/sg-11134258-7rdxj-mccxgmnes7tlf5_xxhdpi'
    }
  ];

  // Dữ liệu sale sắp tới
  const upcomingSales = [
    {
      id: 1,
      src: 'https://down-vn.img.susercontent.com/file/sg-11134258-824gb-mfdqh0i2cl57d6@resize_w796_nl.webp',
      alt: 'Flash Sale 12h',
      fallback: 'https://cf.shopee.vn/file/sg-11134258-7rdvj-mcg0m0mv44zb37_xhdpi'
    },
    {
      id: 2,
      src: 'https://down-vn.img.susercontent.com/file/sg-11134258-824hw-mfdsyxaqknwv53@resize_w796_nl.webp',
      alt: 'Sale cuối tháng',
      fallback: 'https://cf.shopee.vn/file/sg-11134258-7rdxa-mcg0shzxks785a_xhdpi'
    }
  ];

  // Auto carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Phần trên - Carousel và Sale sắp tới */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Bên trái - Carousel (3/4 width) */}
          <div className="lg:col-span-3">
            <div className="relative h-80 overflow-hidden shadow-lg">
              {carouselImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                   
                  />
                </div>
              ))}
              
              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bên phải - Sale sắp tới (1/4 width) */}
          <div className="lg:col-span-1 h-80 flex flex-col space-y-2">
            {upcomingSales.map((sale) => (
              <div key={sale.id} className="flex-1 overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
                <img
                  src={sale.src}
                  alt={sale.alt}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  
                />
              </div>
            ))}
          </div>
        </div>

        {/* Phần dưới - 3 buttons ngang */}
        <div className="grid grid-cols-3 gap-4">
          {/* Mã giảm giá */}
          <div className="flex items-center justify-center bg-gradient-to-r  rounded-xl p-4 transition cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center group-hover:scale-110 transition overflow-hidden">
                <img
                  src="https://down-vn.img.susercontent.com/file/24b194a695ea59d384768b7b471d563f@resize_w640_nl.webp"
                  alt={t('voucherIcon')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">{t('voucherTitle')}</h3>
                <p className="text-sm text-gray-600">{t('voucherDesc')}</p>
              </div>
            </div>
          </div>

          {/* Deal hot giờ vàng */}
          <div className="flex items-center justify-center bg-gradient-to-r  rounded-xl p-4 transition cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center group-hover:scale-110 transition overflow-hidden">
                <img
                  src="https://down-vn.img.susercontent.com/file/6cb7e633f8b63757463b676bd19a50e4@resize_w640_nl.webp"
                  alt={t('flashSaleIcon')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">{t('flashSaleTitle')}</h3>
                <p className="text-sm text-gray-600">{t('flashSaleDesc')}</p>
              </div>
            </div>
          </div>

          {/* Khách hàng thân thiết */}
          <div className="flex items-center justify-center bg-gradient-to-r  rounded-xl p-4 transition cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center group-hover:scale-110 transition overflow-hidden">
                <img
                  src="https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d@resize_w640_nl.webp"
                  alt={t('vipIcon')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">{t('vipTitle')}</h3>
                <p className="text-sm text-gray-600">{t('vipDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;