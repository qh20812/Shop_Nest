interface CartColumnTitleProps {
    isAllSelected: boolean;
    onSelectAll: (checked: boolean) => void;
}

export default function CartColumnTitle({ isAllSelected, onSelectAll }: CartColumnTitleProps) {
    return (
        <div className="mb-4 rounded-lg bg-[var(--light-2)] p-4 shadow-sm">
            <div className="grid grid-cols-[2.5fr_1fr_1.2fr_1fr_1fr] items-center gap-4">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="select-all-cart"
                        className="h-[18px] w-[18px] cursor-pointer accent-[var(--primary)]"
                        checked={isAllSelected}
                        onChange={(e) => onSelectAll(e.target.checked)}
                    />
                    <label htmlFor="select-all-cart" className="cursor-pointer font-['Poppins',sans-serif] font-medium text-[var(--dark)]">
                        Sản phẩm
                    </label>
                </div>
                <div className="text-center font-['Poppins',sans-serif] font-medium text-[var(--dark)]">Đơn giá</div>
                <div className="text-center font-['Poppins',sans-serif] font-medium text-[var(--dark)]">Số lượng</div>
                <div className="text-center font-['Poppins',sans-serif] font-medium text-[var(--dark)]">Thành tiền</div>
                <div className="text-center font-['Poppins',sans-serif] font-medium text-[var(--dark)]">Thao tác</div>
            </div>
        </div>
    );
}
