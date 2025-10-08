import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import HomeLayout from '../../layouts/app/HomeLayout';
import FlashSaleCarousel from '@/components/home/ui/FlashSaleCarousel';

export default function Home() {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(14); // Default: 2 rows × 7 items per row

    // Handle responsive items per page
    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width <= 480) {
                setItemsPerPage(15); // 3 cols × 5 rows
            } else if (width <= 768) {
                setItemsPerPage(16); // 4 cols × 4 rows
            } else {
                setItemsPerPage(14); // 7 cols × 2 rows
            }
            setCurrentPage(0); // Reset to first page when changing layout
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);

        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    // All categories data
    const categories = [
        { img: "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp", name: "Điện thoại" },
        { img: "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp", name: "Thời trang nữ" },
        { img: "https://down-vn.img.susercontent.com/file/74ca517e1fa74dc4d974e5d03c3139de@resize_w640_nl.webp", name: "Thời trang nam" },
        { img: "https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w640_nl.webp", name: "Giày dép" },
        { img: "https://down-vn.img.susercontent.com/file/7abfbfee3c4844652b4a8245e473d857@resize_w640_nl.webp", name: "Điện tử" },
        { img: "https://down-vn.img.susercontent.com/file/24b194a695ea59d384768b7b471d563f@resize_w640_nl.webp", name: "Đồ gia dụng" },
        { img: "https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d@resize_w640_nl.webp", name: "Sức khỏe" },
        { img: "https://down-vn.img.susercontent.com/file/6cb7e633f8b63757463b676bd19a50e4@resize_w640_nl.webp", name: "Thể thao" },
        { img: "https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d@resize_w640_nl.webp", name: "Phụ kiện" },
        { img: "https://down-vn.img.susercontent.com/file/099edde1ab31df35bc255912bab54a5e@resize_w640_nl.webp", name: "Đồ chơi" },
        { img: "https://down-vn.img.susercontent.com/file/36013311815c55d303b0e6c62d6a8139@resize_w640_nl.webp", name: "Đồ dùng học tập" },
        { img: "https://down-vn.img.susercontent.com/file/ec14dd4fc238e676e43be2a911414d4d@resize_w640_nl.webp", name: "Làm đẹp" },
        // Add more categories to demonstrate carousel
        { img: "https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5@resize_w640_nl.webp", name: "Đồng hồ" },
        { img: "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b@resize_w640_nl.webp", name: "Máy tính" },
        { img: "https://down-vn.img.susercontent.com/file/74ca517e1fa74dc4d974e5d03c3139de@resize_w640_nl.webp", name: "Đồ nội thất" },
        { img: "https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca@resize_w640_nl.webp", name: "Xe cộ" },
        { img: "https://down-vn.img.susercontent.com/file/7abfbfee3c4844652b4a8245e473d857@resize_w640_nl.webp", name: "Nhà cửa" },
        { img: "https://down-vn.img.susercontent.com/file/24b194a695ea59d384768b7b471d563f@resize_w640_nl.webp", name: "Du lịch" },
    ];

    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const currentCategories = categories.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <HomeLayout>
            <Head title="ShopNest - Trang chủ" />
            <div className="home-content">
                <div className="home-component">
                    <div className="category-title">
                        <h2>danh mục</h2>
                    </div>
                    <div className="category-carousel">
                        <div className="carousel-container">
                            {/* Previous Button */}
                            {currentPage > 0 && (
                                <button
                                    className="carousel-btn carousel-btn-prev"
                                    onClick={prevPage}
                                    aria-label="Previous categories"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15,18 9,12 15,6"></polyline>
                                    </svg>
                                </button>
                            )}

                            <div className="category-content">
                                <ul>
                                    {currentCategories.map((category, index) => (
                                        <li key={`${currentPage}-${index}`}>
                                            <img src={category.img} alt={category.name} />
                                            <span>{category.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Next Button */}
                            {currentPage < totalPages - 1 && (
                                <button
                                    className="carousel-btn carousel-btn-next"
                                    onClick={nextPage}
                                    aria-label="Next categories"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9,18 15,12 9,6"></polyline>
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Carousel Indicators */}
                        <div className="carousel-indicators">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentPage ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(index)}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="home-component">
                    <div className="flash-sale-title">
                        <h2>f<i className="bi bi-lightning-fill"></i>ash sale</h2>
                        <div className="flash-sale-timer">
                            {/* giờ */}
                            <div className="timer">00</div>
                            {/* phút */}
                            <div className="timer">03</div>
                            {/* giây */}
                            <div className="timer">59</div>
                        </div>
                    </div>
                    <div className="flash-sale-content">
                        <FlashSaleCarousel />
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}