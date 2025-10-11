import React from 'react'
import Navbar from '@/components/home/ui/Navbar';
import '@/../css/Home.css';
import Footer from '@/components/home/ui/Footer';

export default function Cart() {
  return (
    <>
        <Navbar />
        <div className="cart-container">
          {/* cart-tile là một card chứa tiêu đề của trang giỏ hàng */}
          <div className="cart-tile">
            <h1>Shopping Cart</h1>
          </div>
          <div className="cart-column-title">
            <ul>
              <li><input type="checkbox" name="all-cart" id="all-cart" className='cart-checkbox'/></li>
              <li><span>Sản phẩm</span></li>
              <li>Đơn giá</li>
              <li>Số lượng</li>
              <li>Thành tiền</li>
              <li>Hành động</li>
            </ul>
          </div>
          <div className="cart-card-item">
            <div className="cart-shop-info">
              <input type="checkbox" name="choose-this-shop" id="choose-this-shop" />
              <i className="bi bi-shop"></i>
              <span className="cart-shop-name">Shop Name</span>
            </div>
            <div className="cart-content">
              <ul>
                <li><input type="checkbox" name="choose-this-product" id="choose-this-product" /></li>
                <li>
                  <img src="image/ShopnestLogo.png" alt="Product" />
                  <span className='cart-product-name'>quần tây đen chuẩn vải âu</span>
                  <div className="cart-variants-dropdown">
                    <span>Phân loại hàng</span>
                  </div>
                </li>
                <li>500.000đ</li>
                <li>
                  <button>+</button>
                  <input type="text" defaultValue={0} />
                  <button>-</button>
                </li>
                <li>500.000</li>
                <li>
                  <button>Xóa</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
    </>
  )
}
