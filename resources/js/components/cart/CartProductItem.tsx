import QuantitySelector from './QuantitySelector';

interface CartProduct {
    id: number;
    name: string;
    image: string;
    variant: string;
    price: number;
    quantity: number;
    maxQuantity?: number;
}

interface CartProductItemProps {
    product: CartProduct;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
}

export default function CartProductItem({ product, isSelected, onSelect, onQuantityChange, onRemove }: CartProductItemProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const subtotal = product.price * product.quantity;

    return (
        <div className="grid grid-cols-[40px_2.5fr_1fr_1.2fr_1fr_1fr] items-center gap-4 border-b border-[var(--grey)] p-5 transition-colors duration-300 last:border-b-0 hover:bg-[var(--light)]">
            <div className="flex items-center justify-center">
                <input
                    type="checkbox"
                    id={`product-${product.id}`}
                    className="h-[18px] w-[18px] cursor-pointer accent-[var(--primary)]"
                    checked={isSelected}
                    onChange={(e) => onSelect(e.target.checked)}
                />
            </div>

            <div className="flex items-center gap-3">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="m-0 mb-2 line-clamp-2 font-['Poppins',sans-serif] text-sm leading-[1.4] font-medium text-[var(--dark)]">
                        {product.name}
                    </h4>
                    <div className="inline-block rounded bg-[var(--light)] px-2 py-1 text-xs text-[var(--dark-grey)]">
                        <span>Phân loại hàng: {product.variant}</span>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <span className="font-['Poppins',sans-serif] font-semibold text-[var(--primary)]">{formatPrice(product.price)}</span>
            </div>

            <div className="flex justify-center">
                <QuantitySelector value={product.quantity} onChange={onQuantityChange} max={product.maxQuantity || 999} />
            </div>

            <div className="text-center">
                <span className="font-['Poppins',sans-serif] font-semibold text-[var(--primary)]">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-center">
                <button
                    className="flex cursor-pointer items-center gap-1.5 rounded border border-[var(--danger)] bg-transparent px-3 py-2 font-['Poppins',sans-serif] text-xs text-[var(--danger)] transition-all duration-300 hover:bg-[var(--danger)] hover:text-white"
                    onClick={onRemove}
                    type="button"
                >
                    <i className="bi bi-trash"></i>
                    Xóa
                </button>
            </div>
        </div>
    );
}
