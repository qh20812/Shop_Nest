import React from 'react';
import DailyDiscoverCard from './DailyDiscoverCard';

interface Product {
    id: number;
    image: string;
    name: string;
    discountPercent?: number | null;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
}

export default function DailyDiscoverContent() {
    // Sample product data - this would typically come from props or API
    const products: Product[] = [
        {
            id: 1,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnuah5s9af1c7",
            name: "Áo thun nam cotton basic form rộng thoải mái, chất liệu mềm mại",
            discountPercent: 25,
            price: 149000,
            originalPrice: 199000,
            rating: 4.5,
            reviewCount: 128
        },
        {
            id: 2,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnub8h1a3wjb5",
            name: "Giày sneaker nữ thể thao trắng đen basic ulzzang",
            discountPercent: 30,
            price: 199000,
            originalPrice: 285000,
            rating: 4.8,
            reviewCount: 245
        },
        {
            id: 3,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnua98q46m999",
            name: "Túi xách nữ đeo chéo mini vintage phong cách Hàn Quốc",
            price: 89000,
            rating: 4.3,
            reviewCount: 89
        },
        {
            id: 4,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnual4t5sg5a1",
            name: "Điện thoại smartphone gaming chip cao cấp RAM 8GB",
            discountPercent: 15,
            price: 4990000,
            originalPrice: 5890000,
            rating: 4.7,
            reviewCount: 342
        },
        {
            id: 5,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnub7n8vdmj82",
            name: "Đồng hồ thông minh smartwatch chống nước IP68",
            discountPercent: 40,
            price: 599000,
            originalPrice: 999000,
            rating: 4.4,
            reviewCount: 156
        },
        {
            id: 6,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnubah2p8sl16",
            name: "Tai nghe bluetooth không dây chất lượng cao",
            discountPercent: 20,
            price: 299000,
            originalPrice: 375000,
            rating: 4.6,
            reviewCount: 203
        },
        {
            id: 7,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnubc4s8hxl45",
            name: "Máy tính bảng Android 10 inch màn hình 2K",
            price: 2490000,
            rating: 4.2,
            reviewCount: 67
        },
        {
            id: 8,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnubef6q3o982",
            name: "Balo laptop 15.6 inch chống thấm nước nhiều ngăn",
            discountPercent: 35,
            price: 299000,
            originalPrice: 460000,
            rating: 4.5,
            reviewCount: 134
        },
        {
            id: 9,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnubg8h3sm567",
            name: "Kem dưỡng da mặt vitamin C chống lão hóa",
            discountPercent: 50,
            price: 149000,
            originalPrice: 298000,
            rating: 4.9,
            reviewCount: 567
        },
        {
            id: 10,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnubi6t8gj134",
            name: "Váy midi nữ dáng A họa tiết hoa vintage",
            price: 199000,
            rating: 4.1,
            reviewCount: 78
        },
        {
            id: 11,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnubj2s9vx989",
            name: "Nước hoa nam mùi thơm sang trọng lâu phai",
            discountPercent: 25,
            price: 399000,
            originalPrice: 532000,
            rating: 4.7,
            reviewCount: 189
        },
        {
            id: 12,
            image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llnubk8f4cw345",
            name: "Quần jean nam slim fit co giãn thoải mái",
            discountPercent: 30,
            price: 249000,
            originalPrice: 356000,
            rating: 4.3,
            reviewCount: 212
        }
    ];

    const handleProductClick = (product: Product) => {
        // Navigate to product detail page
        console.log('Navigate to product:', product.id);
        // You can implement navigation logic here
    };

    return (
        <div className="daily-discover-content">
            <div className="daily-discover-grid">
                {products.map((product) => (
                    <DailyDiscoverCard
                        key={product.id}
                        image={product.image}
                        name={product.name}
                        discountPercent={product.discountPercent}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        onClick={() => handleProductClick(product)}
                    />
                ))}
            </div>
        </div>
    );
}
