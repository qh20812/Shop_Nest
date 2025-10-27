import React, { useState, useEffect } from 'react';

interface Category {
    img: string;
    name: string;
}

interface CategoryCarouselProps {
    categories: Category[];
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
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
    );
}