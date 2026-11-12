interface CartTitleProps {
    title: string;
}

export default function CartTitle({ title }: CartTitleProps) {
    return (
        <div className="mb-4 rounded-lg bg-[var(--light-2)] p-5 shadow-sm">
            <h1 className="m-0 font-['Poppins',sans-serif] text-2xl font-semibold text-[var(--dark)]">{title}</h1>
        </div>
    );
}
