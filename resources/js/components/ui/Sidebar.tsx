import '@/../css/Sidebar.css';
import '@/../css/app.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <a href="#" className='logo'>
        <i className='bx bx-store'></i>
        <div className='logo-name'><span>Shop</span>Nest</div>
      </a>
      <ul className="side-menu">
        <li><a href="#"><i className='bx bxs-dashboard'></i>Bảng điều khiển</a></li>
        <li><a href="#"><i className='bx bxs-shopping-bag-alt'></i>Sản phẩm</a></li>
        <li><a href="#"><i className='bx bxs-user-detail'></i>Người dùng</a></li>
        <li><a href="#"><i className='bx bxs-category'></i>Danh mục</a></li>
        <li><a href="#"><i className='bx bxs-truck'></i>Đơn hàng</a></li>
        <li><a href="#"><i className='bx bxs-cog'></i>Cài đặt</a></li>
      </ul>
      <ul className='side-menu'>
        <li>
            <a href="#" className='logout'>
                <i className='bx bx-log-out-circle'></i>
                Đăng xuất
            </a>
        </li>
      </ul>
    </div>
  )
}
