import '../../../css/AuthPage.css';
import AuthContainer from '../../components/auth/AuthContainer';

export default function SellerRegister() {
    return (
        <div className="auth-page">
            <AuthContainer defaultMode="signup" />
        </div>
    );
}
