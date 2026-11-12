import CartProductItem from './CartProductItem';

interface CartProduct {
    id: number;
    name: string;
    image: string;
    variant: string;
    price: number;
    quantity: number;
    maxQuantity?: number;
}

interface Shop {
    id: number;
    name: string;
    products: CartProduct[];
}

interface CartShopCardProps {
    shop: Shop;
    selectedProducts: number[];
    onSelectShop: (checked: boolean) => void;
    onSelectProduct: (productId: number, checked: boolean) => void;
    onQuantityChange: (productId: number, quantity: number) => void;
    onRemoveProduct: (productId: number) => void;
}

export default function CartShopCard({
    shop,
    selectedProducts,
    onSelectShop,
    onSelectProduct,
    onQuantityChange,
    onRemoveProduct,
}: CartShopCardProps) {
    const isShopSelected = shop.products.every((product) => selectedProducts.includes(product.id));

    const handleShopSelect = (checked: boolean) => {
        onSelectShop(checked);
    };

    return (
        <div className="overflow-hidden rounded-lg bg-[var(--light-2)] shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between border-b border-[var(--grey)] bg-[var(--light)] p-4">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id={`shop-${shop.id}`}
                        className="h-[18px] w-[18px] cursor-pointer accent-[var(--primary)]"
                        checked={isShopSelected}
                        onChange={(e) => handleShopSelect(e.target.checked)}
                    />
                    <i className="bi bi-shop text-base text-[var(--primary)]"></i>
                    <span className="font-['Poppins',sans-serif] font-semibold text-[var(--dark)]">{shop.name}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        className="flex cursor-pointer items-center gap-1.5 rounded border border-[var(--primary)] bg-transparent px-3 py-1.5 font-['Poppins',sans-serif] text-[13px] text-[var(--primary)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white"
                        type="button"
                    >
                        <i className="bi bi-chat-dots"></i>
                        Chat
                    </button>
                </div>
            </div>

            <div className="flex flex-col">
                {shop.products.map((product) => (
                    <CartProductItem
                        key={product.id}
                        product={product}
                        isSelected={selectedProducts.includes(product.id)}
                        onSelect={(checked) => onSelectProduct(product.id, checked)}
                        onQuantityChange={(quantity) => onQuantityChange(product.id, quantity)}
                        onRemove={() => onRemoveProduct(product.id)}
                    />
                ))}
            </div>
        </div>
    );
}
