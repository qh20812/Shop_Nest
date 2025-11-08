import React, { useState } from 'react';
// Đã loại bỏ: import { Head } from '@inertiajs/react'; để tránh lỗi biên dịch trong môi trường này
import { Car, BarChart3, Star, Zap, MapPin, Map, Wallet, Check, X, Package, Truck, Phone, TrendingUp, Users, Settings, LogOut } from 'lucide-react';

// Định nghĩa biến màu sắc nguy hiểm (danger color) bằng JS để dùng trong style inline
const dangerColor = '#dc3545';

// --- COMPONENTS CƠ BẢN ---

// Component hiển thị thẻ thống kê
const StatCard = ({ icon: Icon, value, label, color = '#007bff' }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
        <Icon size={32} color={color} className="stat-icon" />
        <div className="stat-content">
            <div className="stat-value" style={{ color: color }}>{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    </div>
);

// Component hiển thị thẻ đơn hàng
const OrderCard = ({ order, onAction }) => {
    const isNew = order.status === 'new';
    const statusClass = isNew ? 'status-new' : 'status-delivery';
    const statusText = isNew ? 'MỚI' : 'ĐANG GIAO';
    const statusColor = isNew ? '#ffc107' : '#28a745';
    const actionPrimary = isNew ? 'accept' : 'completed';
    const actionSecondary = isNew ? 'reject' : 'failed';

    return (
        <div className={`order-card ${statusClass}`}>
            <div className="order-header">
                <span className="order-id">#${order.id}</span>
                <span className="status-tag" style={{ backgroundColor: statusColor }}>{statusText}</span>
            </div>
            <div className="order-info-grid">
                <p><Map size={16} /> Địa chỉ lấy: <strong>{order.pickup_address}</strong></p>
                <p><MapPin size={16} /> Địa chỉ giao: <strong>{order.delivery_address}</strong></p>
                <p><Wallet size={16} /> COD: <strong>{order.cod}</strong></p>
                <p><Truck size={16} /> Khoảng cách: <span>{order.distance}</span></p>
                <p><Phone size={16} /> SĐT Khách: <span>{order.customer_phone}</span></p>
            </div>
            <div className="order-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => onAction(actionPrimary, order.id)}>
                    {isNew ? <><Check size={16} /> Chấp nhận</> : <><Package size={16} /> Đã giao hàng</>}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => onAction(actionSecondary, order.id)}>
                    {isNew ? <><X size={16} /> Từ chối</> : <><Truck size={16} /> Thất bại</>}
                </button>
            </div>
        </div>
    );
};

// --- MODALS (CUSTOM DIALOGS) ---

// Modal chung cho xác nhận
const ConfirmationModal = ({ title, message, onConfirm, onCancel, isVisible }) => {
    if (!isVisible) return null;
    return (
        <div className="modal" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close-btn" onClick={onCancel}>&times;</span>
                <h3 style={{ color: dangerColor, marginBottom: '15px' }}>{title}</h3>
                <p style={{ marginBottom: '20px' }}>{message}</p>
                <div className="order-actions" style={{ marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={onConfirm} style={{ flexGrow: 1 }}>Xác nhận</button>
                    <button className="btn btn-secondary" onClick={onCancel} style={{ flexGrow: 1 }}>Hủy bỏ</button>
                </div>
            </div>
        </div>
    );
};

// Modal thông tin hồ sơ
const ProfileModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;
    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content profile-content" onClick={e => e.stopPropagation()}>
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Hồ sơ Shipper</h3>
                <div className="profile-info">
                    <p><Users size={16} /> Tên: <strong>Nguyễn Văn A</strong></p>
                    <p><Settings size={16} /> Mã Shipper: <strong>S-0012</strong></p>
                    <p><Star size={16} style={{ color: 'gold' }} /> Xếp hạng: <strong>4.8 / 5.0</strong></p>
                    <p><Car size={16} /> Xe: <strong>Wave Alpha (59-T1 123.45)</strong></p>
                </div>
                <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '15px', width: '100%' }}>Đóng</button>
            </div>
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---

const Dashboard = ({ title, stats, orders: initialOrders }) => {
    const [orders, setOrders] = useState(initialOrders);
    const [isActionModalVisible, setIsActionModalVisible] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [actionDetails, setActionDetails] = useState(null);

    // Xử lý khi click nút hành động trên thẻ đơn hàng
    const handleActionClick = (action, orderId) => {
        let modalTitle = '';
        let message = '';

        switch (action) {
            case 'accept':
                modalTitle = 'Chấp nhận Đơn hàng';
                message = `Bạn có muốn chấp nhận đơn hàng ${orderId} và bắt đầu giao?`;
                break;
            case 'reject':
                modalTitle = 'Từ chối Đơn hàng';
                message = `Bạn có chắc chắn muốn từ chối đơn hàng ${orderId} này không?`;
                break;
            case 'completed':
                modalTitle = 'Xác nhận Giao thành công';
                message = `Xác nhận đã giao thành công đơn hàng ${orderId} và thu tiền COD (nếu có)?`;
                break;
            case 'failed':
                modalTitle = 'Xác nhận Giao thất bại';
                message = `Xác nhận đơn hàng ${orderId} giao thất bại (khách từ chối, không liên lạc được,...)`;
                break;
            default:
                modalTitle = 'Xác nhận Hành động';
                message = 'Bạn có muốn thực hiện hành động này không?';
        }

        setActionDetails({ title: modalTitle, message, action, orderId });
        setIsActionModalVisible(true);
    };

    // Xử lý khi xác nhận trong Modal
    const handleConfirmAction = () => {
        if (!actionDetails) return;
        const { action, orderId } = actionDetails;

        // **Nơi gọi API để cập nhật trạng thái đơn hàng**
        console.log(`[API Call] Thao tác: ${action}, Đơn hàng: ${orderId}`);

        // --- CẬP NHẬT GIAO DIỆN GIẢ LẬP ---
        setOrders(prevOrders => {
            if (action === 'accept') {
                // Chuyển trạng thái đơn hàng thành 'delivery'
                return prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: 'delivery' } : order
                );
            } else if (action === 'completed' || action === 'failed') {
                // Xóa đơn hàng khỏi danh sách đang xử lý (vì đã hoàn tất/thất bại)
                return prevOrders.filter(order => order.id !== orderId);
            }
            return prevOrders;
        });

        // Đóng modal
        setIsActionModalVisible(false);
        setActionDetails(null);
    };

    // Xử lý khi hủy trong Modal
    const handleCancelAction = () => {
        setIsActionModalVisible(false);
        setActionDetails(null);
    };

    return (
        <>
            {/* Đã loại bỏ component <Head title={title} /> để tránh lỗi import */}

            {/* CSS STYLE BLOCK - Pure CSS */}
            <style jsx global>{`
                /* Variables */
                :root {
                    --primary-color: #007bff; /* Blue */
                    --secondary-color: #6c757d; /* Gray */
                    --text-color: #333;
                    --background-color: #f4f7f6;
                    --card-bg: white;
                    --success-color: #28a745;
                    --warning-color: #ffc107;
                    --danger-color: ${dangerColor}; /* Sử dụng biến JS để đảm bảo đồng nhất */
                    --border-radius: 12px;
                    --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                }

                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                }

                body {
                    background-color: var(--background-color);
                    color: var(--text-color);
                    line-height: 1.6;
                }

                /* Header */
                .header {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 1rem 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }

                .header h1 {
                    font-size: 1.4rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .profile-icon {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }
                .profile-icon:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                /* Layout chính */
                .dashboard-container {
                    padding: 20px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                /* Mobile Layout */
                .sidebar { display: none; }
                .main-content { width: 100%; }

                /* Desktop Layout */
                @media (min-width: 1024px) {
                    .dashboard-container {
                        display: grid;
                        grid-template-columns: 280px 1fr; 
                        gap: 25px;
                        padding: 30px 20px;
                    }

                    .sidebar {
                        display: block; 
                        background-color: var(--card-bg);
                        padding: 25px 20px;
                        border-radius: var(--border-radius);
                        box-shadow: var(--box-shadow);
                        align-self: start; 
                        position: sticky;
                        top: 100px; /* Dưới header */
                    }
                    
                    .main-content {
                        min-width: 0; /* Cho phép flex/grid hoạt động tốt */
                    }
                }
                
                /* Sidebar Menu */
                .sidebar h2 {
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                    color: var(--primary-color);
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 10px;
                    font-weight: 600;
                }
                
                .sidebar-menu a {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 0;
                    color: var(--text-color);
                    text-decoration: none;
                    font-size: 1rem;
                    border-bottom: 1px dotted #e9ecef;
                    transition: all 0.2s;
                }
                
                .sidebar-menu a:hover {
                    color: var(--primary-color);
                    padding-left: 8px;
                    background-color: #f0f4f7;
                    border-radius: 4px;
                }
                
                .sidebar-menu a:last-child {
                    border-bottom: none;
                }
                
                .sidebar-menu a .icon {
                    min-width: 24px;
                }


                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background-color: var(--card-bg);
                    padding: 20px;
                    border-radius: var(--border-radius);
                    box-shadow: var(--box-shadow);
                    transition: transform 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-left: 6px solid var(--primary-color);
                }
                
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
                }

                .stat-card .stat-icon {
                    opacity: 0.7;
                }

                .stat-card .stat-content {
                    flex-grow: 1;
                }

                .stat-card .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 2px;
                }

                .stat-card .stat-label {
                    font-size: 0.9rem;
                    color: var(--secondary-color);
                }

                /* Orders Section */
                .section-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    padding-bottom: 8px;
                    border-bottom: 3px solid var(--primary-color);
                    color: var(--text-color);
                }

                .order-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .order-card {
                    background-color: var(--card-bg);
                    padding: 20px;
                    border-radius: var(--border-radius);
                    box-shadow: var(--box-shadow);
                    border-left: 8px solid; /* Cho trạng thái */
                    transition: border-left-color 0.3s;
                }
                
                .order-card.status-new { border-left-color: var(--warning-color); }
                .order-card.status-delivery { border-left-color: var(--success-color); }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px dashed #e9ecef;
                }

                .order-header .order-id {
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--primary-color);
                }

                .order-header .status-tag {
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: white;
                }

                /* Order Info Grid */
                .order-info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                @media (min-width: 768px) {
                     .order-info-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                     .order-info-grid p:first-child,
                     .order-info-grid p:nth-child(2) {
                        grid-column: span 3;
                    }
                     .order-info-grid p:nth-child(3),
                     .order-info-grid p:nth-child(4),
                     .order-info-grid p:nth-child(5) {
                        grid-column: span 1;
                    }
                }

                .order-info-grid p {
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    color: var(--text-color);
                }
                .order-info-grid p span {
                    color: var(--primary-color);
                    font-weight: 600;
                    margin-left: 5px;
                }
                
                .order-info-grid p strong {
                    font-weight: 600;
                }
                
                .order-info-grid svg {
                    margin-right: 8px;
                    color: var(--primary-color);
                    min-width: 20px;
                }


                /* Actions & Buttons */
                .order-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                    flex-direction: column;
                }
                
                @media (min-width: 600px) {
                    .order-actions {
                        flex-direction: row;
                    }
                }

                .btn {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 1rem;
                }

                .btn-primary {
                    background-color: var(--primary-color);
                    color: white;
                    box-shadow: 0 3px 6px rgba(0, 123, 255, 0.3);
                }
                
                .btn-primary:hover {
                    background-color: #0056b3;
                    transform: translateY(-1px);
                    box-shadow: 0 5px 10px rgba(0, 123, 255, 0.4);
                }

                .btn-secondary {
                    background-color: var(--secondary-color);
                    color: white;
                    box-shadow: 0 3px 6px rgba(108, 117, 125, 0.3);
                }
                
                .btn-secondary:hover {
                    background-color: #5a6268;
                    transform: translateY(-1px);
                    box-shadow: 0 5px 10px rgba(108, 117, 125, 0.4);
                }
                
                /* Modal Styles */
                .modal {
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0,0,0,0.5); 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-content {
                    background-color: #fefefe;
                    padding: 30px;
                    border-radius: var(--border-radius);
                    width: 90%;
                    max-width: 450px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
                    position: relative;
                    animation: fadeIn 0.3s;
                }
                
                .profile-content .profile-info p {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                    font-size: 1rem;
                }
                
                .profile-content .profile-info strong {
                    color: var(--primary-color);
                }
                
                .close-btn {
                    color: #aaa;
                    position: absolute;
                    top: 15px;
                    right: 25px;
                    font-size: 32px;
                    font-weight: bold;
                    cursor: pointer;
                    line-height: 1;
                    transition: color 0.2s;
                }
                
                .close-btn:hover {
                    color: var(--danger-color);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }

            `}</style>

            {/* Header */}
            <header className="header">
                <h1><Truck size={28} /> Shipper Hub</h1>
                <div className="profile-icon" onClick={() => setIsProfileModalVisible(true)}>
                    <Users size={24} />
                </div>
            </header>

            <div className="dashboard-container">

                {/* Sidebar */}
                <aside className="sidebar">
                    <h2>Menu Shipper</h2>
                    <div className="sidebar-menu">
                        <a href="#"><Truck size={20} className="icon" /> Đơn hàng hiện tại</a>
                        <a href="#"><TrendingUp size={20} className="icon" /> Thống kê thu nhập</a>
                        <a href="#"><Star size={20} className="icon" /> Đánh giá</a>
                        <a href="#"><Settings size={20} className="icon" /> Cài đặt</a>
                        <a href="#" style={{ color: dangerColor }}><LogOut size={20} className="icon" /> Đăng xuất</a>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">

                    {/* Phần Thống kê nhanh */}
                    <div className="stats-grid">
                        <StatCard
                            icon={Truck}
                            value={stats.today_orders}
                            label="Đơn hàng hôm nay"
                            color="#007bff"
                        />
                        <StatCard
                            icon={Wallet}
                            value={stats.total_earnings}
                            label="Thu nhập (Tuần)"
                            color="#28a745"
                        />
                        <StatCard
                            icon={Star}
                            value={stats.average_rating}
                            label="Điểm đánh giá"
                            color="#ffc107"
                        />
                        <StatCard
                            icon={Zap}
                            value={stats.status}
                            label="Trạng thái"
                            color={stats.status === 'ONLINE' ? '#28a745' : dangerColor}
                        />
                    </div>

                    {/* Danh sách Đơn hàng Cần Xử lý */}
                    <h2 className="section-title">Đơn hàng Cần Xử lý ({orders.length})</h2>

                    <div className="order-list">
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onAction={handleActionClick}
                                />
                            ))
                        ) : (
                            <p style={{ fontSize: '1rem', color: '#6c757d', padding: '20px', backgroundColor: 'white', borderRadius: 'var(--border-radius)', textAlign: 'center' }}>
                                Tuyệt vời! Hiện tại không có đơn hàng nào cần bạn xử lý.
                            </p>
                        )}
                    </div>

                    <h2 className="section-title" style={{ marginTop: '25px' }}>Đơn hàng Đã hoàn tất hôm nay</h2>
                    <p style={{ fontSize: '0.9rem', color: '#6c757d', padding: '10px' }}>
                        (Đây là nơi hiển thị danh sách các đơn hàng đã hoàn thành, thường được tải qua API)
                    </p>

                </main>
            </div>

            {/* Modals */}
            <ConfirmationModal
                title={actionDetails?.title || 'Xác nhận Hành động'}
                message={actionDetails?.message || 'Bạn có chắc chắn muốn thực hiện hành động này không?'}
                isVisible={isActionModalVisible}
                onConfirm={handleConfirmAction}
                onCancel={handleCancelAction}
            />

            <ProfileModal
                isVisible={isProfileModalVisible}
                onClose={() => setIsProfileModalVisible(false)}
            />
        </>
    );
};

export default Dashboard;