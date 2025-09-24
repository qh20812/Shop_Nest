import '@/../css/Sidebar.css';
import '@/../css/app.css';

interface SidebarProps {
  items: Array<{
    icon: string;
    label: string;
    href: string;
  }>;
}

export default function Sidebar({ items }: SidebarProps) {
  return (
    <div className="sidebar">
      <a href="#" className='logo'>
        <i className='bx bx-store'></i>
        <div className='logo-name'><span>Shop</span>Nest</div>
      </a>
      <ul className="side-menu">
        {items.map((item, index)=>(
          <li key={index}>
            <a href={item.href || '#'}>
              <i className={`bx ${item.icon}`}></i>
              {item.label}
            </a>
          </li>
        ))}
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
