import React, { useState } from 'react';

export interface FlashSaleItem {
    id: number;
    image: string;
    title: string;
    discount: string;
    original_price: string;
    sale_price: string;
    quantity_sold: number;
    total_quantity: number;
}

export interface FlashSaleCarouselProps {
    items?: FlashSaleItem[];
}

export const FlashSaleCarousel: React.FC<FlashSaleCarouselProps> = ({ 
    items = defaultFlashSaleItems
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6; // 2 rows x 3 columns for responsive design
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const getCurrentItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    const getProgressBarClass = (sold: number, total: number) => {
        const percentage = (sold / total) * 100;
        if (percentage >= 80) {
            return 'progress-hot'; // CHỈ CÒN X
        }
        return 'progress-selling'; // ĐANG BÁN CHẠY
    };

    const getProgressText = (sold: number, total: number) => {
        const remaining = total - sold;
        const percentage = (sold / total) * 100;
        
        if (percentage >= 80) {
            return `CHỈ CÒN ${remaining}`;
        }
        return 'ĐANG BÁN CHẠY';
    };

    const getProgressPercentage = (sold: number, total: number) => {
        return Math.min((sold / total) * 100, 100);
    };

    return (
        <div className="flash-sale-carousel">
            <div className="carousel-container">
                <button 
                    className="carousel-nav carousel-nav-prev" 
                    onClick={handlePrevPage}
                    disabled={totalPages <= 1}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>

                <div className="flash-sale-grid">
                    {getCurrentItems().map((item) => (
                        <div key={item.id} className="flash-sale-card">
                            <div className="card-image">
                                <img src={item.image} alt={item.title} />
                                <div className="discount-badge">
                                    {item.discount}
                                </div>
                            </div>
                            <div className="card-content">
                                <h4 className="card-title">{item.title}</h4>
                                <div className="card-price">
                                    <span className="sale-price">{item.sale_price}</span>
                                    <span className="original-price">{item.original_price}</span>
                                </div>
                                <div className="card-progress">
                                    <div className={`progress-bar ${getProgressBarClass(item.quantity_sold, item.total_quantity)}`}>
                                        <div className="progress-text">
                                            {getProgressText(item.quantity_sold, item.total_quantity)}
                                        </div>
                                        <div className="progress-track">
                                            <div 
                                                className="progress-fill"
                                                style={{ 
                                                    width: `${getProgressPercentage(item.quantity_sold, item.total_quantity)}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    className="carousel-nav carousel-nav-next" 
                    onClick={handleNextPage}
                    disabled={totalPages <= 1}
                >
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>

            {totalPages > 1 && (
                <div className="carousel-dots">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-dot ${index === currentPage ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Default sample data for development
const defaultFlashSaleItems: FlashSaleItem[] = [
    {
        id: 1,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "iPhone 15 Pro Max 256GB",
        discount: "-25%",
        original_price: "₫32.990.000",
        sale_price: "₫24.742.500",
        quantity_sold: 45,
        total_quantity: 50,
    },
    {
        id: 2,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "Samsung Galaxy S24 Ultra",
        discount: "-30%",
        original_price: "₫29.990.000",
        sale_price: "₫20.993.000",
        quantity_sold: 23,
        total_quantity: 100,
    },
    {
        id: 3,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "MacBook Pro M3 14inch",
        discount: "-15%",
        original_price: "₫52.990.000",
        sale_price: "₫45.041.500",
        quantity_sold: 8,
        total_quantity: 20,
    },
    {
        id: 4,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "AirPods Pro 2nd Gen",
        discount: "-20%",
        original_price: "₫6.990.000",
        sale_price: "₫5.592.000",
        quantity_sold: 89,
        total_quantity: 100,
    },
    {
        id: 5,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "iPad Air M2 11inch",
        discount: "-18%",
        original_price: "₫16.990.000",
        sale_price: "₫13.932.200",
        quantity_sold: 34,
        total_quantity: 80,
    },
    {
        id: 6,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "Apple Watch Series 9",
        discount: "-22%",
        original_price: "₫10.990.000",
        sale_price: "₫8.572.200",
        quantity_sold: 67,
        total_quantity: 75,
    },
    {
        id: 7,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "Sony WH-1000XM5",
        discount: "-35%",
        original_price: "₫8.990.000",
        sale_price: "₫5.843.500",
        quantity_sold: 156,
        total_quantity: 200,
    },
    {
        id: 8,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "Dell XPS 13 Plus",
        discount: "-28%",
        original_price: "₫35.990.000",
        sale_price: "₫25.912.800",
        quantity_sold: 12,
        total_quantity: 30,
    },
    {
        id: 9,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "Nintendo Switch OLED",
        discount: "-12%",
        original_price: "₫8.990.000",
        sale_price: "₫7.911.200",
        quantity_sold: 78,
        total_quantity: 120,
    },
    {
        id: 10,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "GoPro Hero 12 Black",
        discount: "-40%",
        original_price: "₫12.990.000",
        sale_price: "₫7.794.000",
        quantity_sold: 234,
        total_quantity: 250,
    },
    {
        id: 11,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "Dyson V15 Detect",
        discount: "-25%",
        original_price: "₫21.990.000",
        sale_price: "₫16.492.500",
        quantity_sold: 45,
        total_quantity: 60,
    },
    {
        id: 12,
        image: "/martin-martz-rMRT4hF-Fsg-unsplash.jpg",
        title: "Razer DeathAdder V3",
        discount: "-45%",
        original_price: "₫2.990.000",
        sale_price: "₫1.644.500",
        quantity_sold: 289,
        total_quantity: 300,
    },
];

export default FlashSaleCarousel;