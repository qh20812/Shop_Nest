import React from "react";
import SellerRegisterForm from '@/Components/auth/SellerRegisterForm';
import "@/../css/SellerRegister.css";
import HomeLayout from "@/layouts/app/HomeLayout";

export default function SellerRegister() {
  return (
    <HomeLayout>
      <div className="seller-register-page">
        <SellerRegisterForm />
      </div>
    </HomeLayout>
  );
}
