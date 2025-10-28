import React, { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';

interface Category {
    id: number;
    img: string;
    name: string;
    slug?: string;
}

interface CategoryCarouselProps {
    categories: Category[];
    isLoading?: boolean;
}

// Debounce utility function
function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Loading skeleton component
const CategorySkeleton = () => (
    <div className="home-component">
        <div className="category-title">
            <div className="skeleton skeleton-title"></div>
        </div>
        <div className="category-carousel">
            <div className="carousel-container">
                <div className="category-content">
                    <ul>
                        {Array.from({ length: 14 }, (_, index) => (
                            <li key={`skeleton-${index}`}>
                                <div className="skeleton skeleton-image"></div>
                                <div className="skeleton skeleton-text"></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default function CategoryCarousel({ categories, isLoading = false }: CategoryCarouselProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(14);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    // Handle responsive items per page with debounced resize
    const updateItemsPerPage = useCallback(() => {
        const width = window.innerWidth;
        let newItemsPerPage: number;

        if (width <= 480) {
            newItemsPerPage = 15; // 3 cols × 5 rows
        } else if (width <= 768) {
            newItemsPerPage = 16; // 4 cols × 4 rows
        } else {
            newItemsPerPage = 14; // 7 cols × 2 rows
        }

        setItemsPerPage(newItemsPerPage);
        setCurrentPage(0); // Reset to first page when changing layout
    }, []);

    const debouncedUpdateItemsPerPage = useCallback(
        () => debounce(updateItemsPerPage, 150),
        [updateItemsPerPage]
    );

    useEffect(() => {
        updateItemsPerPage();
        const debouncedHandler = debouncedUpdateItemsPerPage();
        window.addEventListener('resize', debouncedHandler);

        return () => {
            window.removeEventListener('resize', debouncedHandler);
        };
    }, [updateItemsPerPage, debouncedUpdateItemsPerPage]);

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

    // Handle image error
    const handleImageError = useCallback((categoryId: number) => {
        setImageErrors(prev => ({ ...prev, [categoryId]: true }));
    }, []);

    // Touch/swipe handlers
    const swipeHandlers = useSwipeable({
        onSwipedLeft: nextPage,
        onSwipedRight: prevPage,
        preventScrollOnSwipe: true,
        trackMouse: false, // Only track touch on mobile
    });

    if (isLoading || categories.length === 0) {
        return <CategorySkeleton />;
    }

    return (
        <div className="home-component">
            <div className="category-title">
                <h2>danh mục</h2>
            </div>
            <div className="category-carousel">
                <div className="carousel-container" {...swipeHandlers}>
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
                            {currentCategories.map((category) => (
                                <li key={`category-${category.id}`}>
                                    {!imageErrors[category.id] ? (
                                        <img
                                            src={category.img}
                                            alt={category.name}
                                            loading="lazy"
                                            onError={() => handleImageError(category.id)}
                                        />
                                    ) : (
                                        <div className="image-placeholder">
                                            <span>📁</span>
                                        </div>
                                    )}
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