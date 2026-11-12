import { Head } from '@inertiajs/react';
import HomeLayout from '../../layouts/app/HomeLayout';

export default function About() {
    return (
        <HomeLayout>
            <Head title="Về chúng tôi - ShopNest" />

            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-xl bg-white p-8 shadow-lg">
                    <h1 className="mb-6 text-3xl font-bold text-blue-800">Về chúng tôi</h1>

                    <div className="prose max-w-none">
                        <p className="mb-6 text-lg text-gray-600">
                            ShopNest là nền tảng thương mại điện tử hàng đầu, mang đến trải nghiệm mua sắm tuyệt vời cho khách hàng.
                        </p>

                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Sứ mệnh của chúng tôi</h2>
                        <p className="mb-6 text-gray-600">
                            Chúng tôi cam kết cung cấp những sản phẩm chất lượng cao với giá cả hợp lý, đồng thời mang đến dịch vụ khách hàng xuất
                            sắc.
                        </p>

                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Tại sao chọn ShopNest?</h2>
                        <ul className="list-inside list-disc space-y-2 text-gray-600">
                            <li>Sản phẩm đa dạng, chất lượng cao</li>
                            <li>Giá cả cạnh tranh</li>
                            <li>Giao hàng nhanh chóng</li>
                            <li>Dịch vụ khách hàng 24/7</li>
                            <li>Chính sách đổi trả linh hoạt</li>
                        </ul>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
