import { useTranslation } from '../../../lib/i18n';

function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="mt-8 bg-blue-300 border-t">
            <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-center">
                    {/* Cột 1: Logo và tên web */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center mb-2">
                            <img src="https://down-vn.img.susercontent.com/file/fa6ada2555e8e51f369718bbc92ccc52@resize_w640_nl.webp" alt="ShopNest Logo" className="mr-2 w-14 h-14" />
                            <span className="text-xl font-bold text-white">Shopnest</span>
                        </div>
                        {/* <p className="mt-2 text-sm text-blue-900">{t('slogan')}</p> */}
                    </div>

                    {/* Cột 2: Dịch vụ khách hàng */}
                    <div className="flex flex-col items-center justify-center text-left">
                        <h3 className="mb-3 font-semibold text-white text-md">{t('customerServiceTitle')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-white transition hover:text-blue-900">{t('helpCenter')}</a></li>
                            <li><a href="#" className="text-white transition hover:text-blue-900">{t('buyGuide')}</a></li>
                            <li><a href="#" className="text-white transition hover:text-blue-900">{t('sellGuide')}</a></li>
                            <li><a href="#" className="text-white transition hover:text-blue-900">{t('refundPolicy')}</a></li>
                        </ul>
                    </div>

                    {/* Cột 3: ShopNest */}
                    <div className="flex flex-col items-center justify-center text-left">
                        <h3 className="mb-3 font-semibold text-white text-md">ShopNest</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-white transition hover:text-blue-900">{t('AboutUs')}</a></li>
                            <li><a href="#" className="text-white transition hover:text-blue-900">{t('PrivacyPolicy')}</a></li>
                            <li><a href="#" className="text-white transition hover:text-blue-900">{t('TermsOfUse')}</a></li>
                        </ul>
                    </div>

                </div>
                <div className="pt-4 mt-8 text-center border-t">
                    <p className="text-sm text-white">&copy; {new Date().getFullYear()} ShopNest. {t('copyright')}</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;