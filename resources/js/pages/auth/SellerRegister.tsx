import '@/../css/SellerRegister.css';
import SellerRegisterForm from '@/components/auth/SellerRegisterForm';
import HomeLayout from '@/layouts/app/HomeLayout';

export default function SellerRegister() {
    return (
        <HomeLayout>
            <div className="seller-register-page">
                <SellerRegisterForm />
            </div>
        </HomeLayout>
    );
}
