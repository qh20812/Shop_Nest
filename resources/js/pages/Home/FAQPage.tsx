import React, { useState } from 'react';
// Do dự án gốc sử dụng Font Awesome cho icon, chúng ta sẽ giữ lại liên kết này.
// Trong môi trường React thực tế, nên dùng một thư viện icon React như 'lucide-react'.

// 1. Định nghĩa dữ liệu FAQ
interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        id: 1,
        question: "1. Làm thế nào để đặt hàng trên website?",
        answer: "Bạn chỉ cần chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán. Hệ thống sẽ hướng dẫn bạn từng bước nhập thông tin giao hàng và chọn phương thức thanh toán phù hợp. Quá trình này rất nhanh chóng và tiện lợi.",
    },
    {
        id: 2,
        question: "2. Các phương thức thanh toán nào được chấp nhận?",
        answer: "Chúng tôi chấp nhận thanh toán qua nhiều hình thức bao gồm: Thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, và thanh toán qua các cổng thanh toán điện tử như Visa/MasterCard, Momo, ZaloPay.",
    },
    {
        id: 3,
        question: "3. Chính sách đổi trả sản phẩm như thế nào?",
        answer: "Sản phẩm được đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi do nhà sản xuất hoặc không đúng mô tả. Vui lòng giữ lại hóa đơn và bao bì gốc khi yêu cầu đổi trả.",
    },
    {
        id: 4,
        question: "4. Thời gian giao hàng trung bình là bao lâu?",
        answer: "Thời gian giao hàng phụ thuộc vào địa chỉ của bạn. Thường là 2-3 ngày làm việc trong nội thành và 3-5 ngày làm việc đối với các tỉnh thành khác. Bạn có thể theo dõi trạng thái đơn hàng trong tài khoản cá nhân.",
    },
    {
        id: 5,
        question: "5. Làm sao để liên hệ với bộ phận hỗ trợ khách hàng?",
        answer: "Bạn có thể liên hệ với chúng tôi qua số điện thoại: 1900-xxxx (giờ hành chính) hoặc gửi email đến địa chỉ: support@ecom.vn. Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
    },
];

// 2. Định nghĩa CSS dưới dạng chuỗi (vì CSS này quá phức tạp để chuyển sang inline style)
// Đây là cách tốt nhất để đảm bảo tất cả các quy tắc CSS, bao gồm media query và :hover, được giữ nguyên.
const globalStyles = `
    /* Tải Font Poppins như đã thấy trong Home.css */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    
    /* Các biến CSS cơ bản từ Home.css */
    :root {
        --light: #f6f6f9;
        --light-2: #ffffff;
        --primary: #1976D2; /* Xanh dương chủ đạo */
        --light-primary: #CFE8FF;
        --grey: #eee;
        --dark: #363949; /* Chữ tối */
        --dark-grey: #AAAAAA;
        --shadow-medium: rgba(0, 0, 0, 0.15);
        --font-lg: 18px;
        --font-md: 16px;
        --font-sm: 13px;
    }

    /* Thiết lập chung */
    .faq-wrapper * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
    }

    .faq-wrapper body {
        background-color: var(--light);
        line-height: 1.6;
        color: var(--dark);
        padding: 20px;
    }

    .faq-container {
        max-width: 900px;
        margin: 40px auto;
        background: var(--light-2);
        border-radius: 12px;
        box-shadow: 0 4px 20px var(--shadow-medium);
        padding: 30px;
    }

    .faq-header {
        text-align: center;
        margin-bottom: 40px;
        border-bottom: 3px solid var(--primary);
        padding-bottom: 15px;
    }

    .faq-header h1 {
        font-size: 32px;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 5px;
    }

    .faq-header p {
        font-size: var(--font-md);
        color: var(--dark-grey);
    }

    /* Phần tử FAQ (Accordion Item) */
    .faq-item {
        border: 1px solid var(--grey);
        border-radius: 8px;
        margin-bottom: 15px;
        overflow: hidden;
        transition: box-shadow 0.3s ease;
    }
    
    .faq-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Phần câu hỏi */
    .faq-question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 25px;
        background-color: var(--light-2);
        font-size: var(--font-lg);
        font-weight: 600;
        color: var(--dark);
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .faq-question:hover {
        background-color: var(--grey);
    }

    /* Biểu tượng (Icon) */
    .faq-icon {
        font-size: var(--font-lg);
        color: var(--primary);
        transition: transform 0.3s ease;
    }

    .faq-item.active .faq-icon {
        transform: rotate(180deg);
    }

    /* Phần trả lời */
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        padding: 0 25px;
        background-color: var(--light);
        transition: max-height 0.4s ease-out, padding 0.4s ease-out;
    }

    .faq-item.active .faq-answer {
        max-height: 500px; /* Giá trị lớn hơn chiều cao nội dung */
        padding: 15px 25px 20px 25px;
    }

    .faq-answer p {
        font-size: var(--font-md);
        color: var(--dark);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .faq-container {
            margin: 20px;
            padding: 20px;
        }
        .faq-header h1 {
            font-size: 28px;
        }
        .faq-question {
            font-size: var(--font-md);
            padding: 15px 20px;
        }
        .faq-icon {
            font-size: var(--font-md);
        }
        .faq-item.active .faq-answer {
            padding: 10px 20px 15px 20px;
        }
    }
`;


// 3. Component FAQItem (Mục FAQ đơn lẻ)
const FAQItemComponent: React.FC<{ item: FAQItem, isActive: boolean, onToggle: (id: number) => void }> = ({ item, isActive, onToggle }) => {
    return (
        <div className={`faq-item ${isActive ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => onToggle(item.id)}>
                <span>{item.question}</span>
                {/* Sử dụng Font Awesome icon class như trong HTML gốc */}
                <i className="fas fa-chevron-down faq-icon"></i>
            </div>
            <div className="faq-answer">
                <p>{item.answer}</p>
            </div>
        </div>
    );
};

// 4. Component chính
const FAQPage: React.FC = () => {
    // 5. State để theo dõi mục nào đang mở
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // 6. Hàm xử lý khi click vào câu hỏi
    const handleToggle = (id: number) => {
        // Nếu click vào mục đang mở -> đóng nó (null), ngược lại -> mở mục đó
        setActiveIndex(prevIndex => (prevIndex === id ? null : id));
    };

    return (
        // Wrapper để đảm bảo CSS chỉ áp dụng bên trong component
        <div className="faq-wrapper">
            {/* 7. Nhúng CSS vào head (hoặc component) */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

            <div className="faq-container">
                <div className="faq-header">
                    <h1>Câu Hỏi Thường Gặp (FAQ)</h1>
                    <p>Giải đáp nhanh chóng các thắc mắc phổ biến của khách hàng.</p>
                </div>

                {/* 8. Render danh sách FAQ */}
                {faqData.map(item => (
                    <FAQItemComponent
                        key={item.id}
                        item={item}
                        isActive={activeIndex === item.id}
                        onToggle={handleToggle}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQPage;
