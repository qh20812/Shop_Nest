import { useState } from "react";
import SellerRegisterForm from "./SellerRegisterForm";
import SignInForm from "./SignInForm";
import TogglePanel from "./TogglePanel";
import "../../../css/AuthPage.css";
import { useTranslation } from "../../lib/i18n";

export default function SellerAuthContainer() {
  const [isActive, setIsActive] = useState(true);
  const { t } = useTranslation();

  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">
      <SellerRegisterForm />
      <SignInForm />
      <div className="toggle-container">
        <div className="toggle">
          <TogglePanel
            type="left"
            title={t("Chào mừng trở lại!")}
            description={t("Đăng nhập vào tài khoản người bán của bạn")}
            buttonText={t("Đăng nhập")}
            onClick={() => setIsActive(false)}
          />
          <TogglePanel
            type="right"
            title={t("Xin chào, người bán mới!")}
            description={t("Tạo tài khoản người bán để bắt đầu kinh doanh trên ShopNest")}
            buttonText={t("Đăng ký")}
            onClick={() => setIsActive(true)}
          />
        </div>
      </div>
    </div>
  );
}
