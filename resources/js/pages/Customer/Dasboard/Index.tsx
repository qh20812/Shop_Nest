/** @jsxImportSource react */
import { useEffect, useState } from 'react';
import Avatar from '../../../components/ui/Avatar';
import StatusBadge from '../../../components/ui/StatusBadge';
import styles from '../styles/dashboard.module.css';

interface Insights {
    total_orders: number;
    pending_orders: number;
    delivered_orders: number;
    total_spent: number;
}

interface Order {
    id: number;
    code?: string;
    created_at?: string;
    status?: string;
    total?: number;
    main_product?: string;
}

interface Profile {
    name?: string;
    email?: string;
    avatar?: string | null;
    status?: string;
}

interface DashboardData {
    insights: Insights | null;
    recentOrders: Order[];
    wishlistCount: number;
    reviewsCount: number;
    profile: Profile | null;
}

function formatCurrency(value?: number) {
    if (value == null) return '0';
    return value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default function CustomerDashboard() {
    const [data, setData] = useState<DashboardData>({
        insights: null,
        recentOrders: [],
        wishlistCount: 0,
        reviewsCount: 0,
        profile: null,
    });

    useEffect(() => {
        // UI-only placeholder data — replace with API calls when backend ready
        setData({
            insights: { total_orders: 12, pending_orders: 2, delivered_orders: 8, total_spent: 1234.5 },
            recentOrders: [
                { id: 105, code: 'ORD-105', created_at: '2025-10-09T10:00:00Z', status: 'pending', total: 59.99, main_product: 'Áo thun' },
                { id: 104, code: 'ORD-104', created_at: '2025-10-08T18:20:00Z', status: 'delivered', total: 120.0, main_product: 'Giày' },
                { id: 103, code: 'ORD-103', created_at: '2025-10-07T12:05:00Z', status: 'delivered', total: 40.0, main_product: 'Mũ' },
                { id: 102, code: 'ORD-102', created_at: '2025-10-06T09:30:00Z', status: 'cancelled', total: 0.0, main_product: 'Áo khoác' },
                { id: 101, code: 'ORD-101', created_at: '2025-10-05T14:40:00Z', status: 'processing', total: 75.5, main_product: 'Quần jeans' },
            ],
            wishlistCount: 5,
            reviewsCount: 3,
            profile: { name: 'Nguyễn Văn A', email: 'a@example.com', avatar: null, status: 'active' },
        });
    }, []);

    const insights = data.insights ?? { total_orders: 0, pending_orders: 0, delivered_orders: 0, total_spent: 0 };
    const orders = Array.isArray(data.recentOrders) ? data.recentOrders.slice(0, 5) : [];

    return (
        <div className={styles.page}>
            <div className={styles.headerRow}>
                <div className={styles.profile} aria-label="Profile summary">
                    <Avatar src={data.profile?.avatar ?? null} alt={data.profile?.name ?? 'Người dùng'} size={64} />
                    <div className={styles.profileInfo}>
                        <div className={styles.profileName}>{data.profile?.name ?? 'Người dùng'}</div>
                        <div className={styles.profileEmail}>{data.profile?.email ?? '-'}</div>
                        <div className={styles.profileStatus}>{data.profile?.status ?? 'active'}</div>
                    </div>
                    <a className={styles.editProfile} href="/profile">Chỉnh sửa</a>
                </div>

                <div className={styles.quickActions} role="toolbar" aria-label="Quick actions">
                    <a className={styles.actionBtn} href="/orders">Tất cả đơn hàng</a>
                    <a className={styles.actionBtn} href="/wishlist">Wishlist</a>
                    <a className={styles.actionBtn} href="/reviews/new">Viết review</a>
                    <a className={styles.actionBtn} href="/profile">Cập nhật thông tin</a>
                </div>
            </div>

            {/* Insights as a table */}
            <section className={styles.insights} aria-label="Order insights">
                <table className={styles.insightsTable}>
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Chỉ số</th>
                            <th>Giá trị</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.icon}>🧾</td>
                            <td>Tổng số đơn hàng</td>
                            <td className={styles.value}>{insights.total_orders}</td>
                        </tr>
                        <tr>
                            <td className={styles.icon}>⏳</td>
                            <td>Đang chờ xử lý</td>
                            <td className={styles.value}>{insights.pending_orders}</td>
                        </tr>
                        <tr>
                            <td className={styles.icon}>✅</td>
                            <td>Đã giao thành công</td>
                            <td className={styles.value}>{insights.delivered_orders}</td>
                        </tr>
                        <tr>
                            <td className={styles.icon}>💰</td>
                            <td>Tổng tiền đã chi</td>
                            <td className={styles.value}>{formatCurrency(insights.total_spent)}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Main area: recent orders (table) + small stats */}
            <div className={styles.midRow}>
                <div className={styles.leftColumn}>
                    <section className={styles.recent} aria-label="Recent orders">
                        <h3>Đơn hàng gần đây</h3>
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Ngày đặt</th>
                                        <th>Trạng thái</th>
                                        <th>Tổng tiền</th>
                                        <th>Sản phẩm chính</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr><td colSpan={6} className={styles.empty}>Không có đơn hàng</td></tr>
                                    ) : (
                                        orders.map((o) => (
                                            <tr key={o.id}>
                                                <td>{o.code ?? `#${o.id}`}</td>
                                                <td>{o.created_at ? new Date(o.created_at).toLocaleString() : '-'}</td>
                                                <td><StatusBadge status={o.status ?? 'unknown'} /></td>
                                                <td>{o.total != null ? Number(o.total).toLocaleString() : '-'}</td>
                                                <td>{o.main_product ?? '-'}</td>
                                                <td><a aria-label={`Xem đơn ${o.id}`} href={`/orders/${o.id}`} className={styles.viewLink}>Xem</a></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <div className={styles.rightColumn}>
                    <table className={styles.smallTable} aria-label="Quick counts">
                        <tbody>
                            <tr>
                                <td className={styles.smallIcon} aria-hidden>❤️</td>
                                <td>
                                    <div className={styles.smallValue}>{data.wishlistCount}</div>
                                    <div className={styles.smallTitle}>Sản phẩm yêu thích</div>
                                </td>
                                <td><a className={styles.smallAction} href="/wishlist">Xem</a></td>
                            </tr>
                            <tr>
                                <td className={styles.smallIcon} aria-hidden>⭐</td>
                                <td>
                                    <div className={styles.smallValue}>{data.reviewsCount}</div>
                                    <div className={styles.smallTitle}>Đánh giá đã viết</div>
                                </td>
                                <td><a className={styles.smallAction} href="/reviews">Xem</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


