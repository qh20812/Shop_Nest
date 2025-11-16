import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import '@/../css/SellerRegister.css';

export default function SellerRegisterForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    shop_name: "",
    shop_address: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, [reset]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("seller.register.store")); // Route Laravel
  };

  return (
    <div className="seller-register-page" role="main">
      <div className="seller-register-container">
        <form onSubmit={submit} className="seller-register-form" role="form" aria-labelledby="seller-register-title">
          <h1 id="seller-register-title">Register as Seller</h1>
          <p>Create your seller account to start your business on ShopNest.</p>

          <div className="seller-form-grid">
            <div className="seller-form-field">
              <InputLabel htmlFor="first_name" value="First Name" />
              <TextInput
                id="first_name"
                name="first_name"
                value={data.first_name}
                onChange={(e) => setData("first_name", e.target.value)}
                required
                className="seller-input"
                autoComplete="given-name"
                aria-describedby={errors.first_name ? "first_name-error" : undefined}
                aria-invalid={!!errors.first_name}
              />
              <div id="first_name-error">
                <InputError message={errors.first_name} className="input-error" />
              </div>
            </div>

            <div className="seller-form-field">
              <InputLabel htmlFor="last_name" value="Last Name" />
              <TextInput
                id="last_name"
                name="last_name"
                value={data.last_name}
                onChange={(e) => setData("last_name", e.target.value)}
                required
                className="seller-input"
                autoComplete="family-name"
                aria-describedby={errors.last_name ? "last_name-error" : undefined}
                aria-invalid={!!errors.last_name}
              />
              <div id="last_name-error">
                <InputError message={errors.last_name} className="input-error" />
              </div>
            </div>
          </div>

          <div className="seller-form-field">
            <InputLabel htmlFor="username" value="Username" />
            <TextInput
              id="username"
              name="username"
              value={data.username}
              onChange={(e) => setData("username", e.target.value)}
              required
              className="seller-input"
              autoComplete="username"
              aria-describedby={errors.username ? "username-error" : undefined}
              aria-invalid={!!errors.username}
            />
            <div id="username-error">
              <InputError message={errors.username} className="input-error" />
            </div>
          </div>

          <div className="seller-form-field">
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              required
              className="seller-input"
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            <div id="email-error">
              <InputError message={errors.email} className="input-error" />
            </div>
          </div>

          <div className="seller-form-field">
            <InputLabel htmlFor="phone_number" value="Phone Number" />
            <TextInput
              id="phone_number"
              name="phone_number"
              value={data.phone_number}
              onChange={(e) => setData("phone_number", e.target.value)}
              required
              className="seller-input"
              autoComplete="tel"
              aria-describedby={errors.phone_number ? "phone_number-error" : undefined}
              aria-invalid={!!errors.phone_number}
            />
            <div id="phone_number-error">
              <InputError message={errors.phone_number} className="input-error" />
            </div>
          </div>

          <div className="seller-form-field">
            <InputLabel htmlFor="shop_name" value="Shop Name" />
            <TextInput
              id="shop_name"
              name="shop_name"
              value={data.shop_name}
              onChange={(e) => setData("shop_name", e.target.value)}
              required
              className="seller-input"
              autoComplete="organization"
              aria-describedby={errors.shop_name ? "shop_name-error" : undefined}
              aria-invalid={!!errors.shop_name}
            />
            <div id="shop_name-error">
              <InputError message={errors.shop_name} className="input-error" />
            </div>
          </div>

          <div className="seller-form-field">
            <InputLabel htmlFor="shop_address" value="Shop Address" />
            <TextInput
              id="shop_address"
              name="shop_address"
              value={data.shop_address}
              onChange={(e) => setData("shop_address", e.target.value)}
              required
              className="seller-input"
              autoComplete="address-line1"
              aria-describedby={errors.shop_address ? "shop_address-error" : undefined}
              aria-invalid={!!errors.shop_address}
            />
            <div id="shop_address-error">
              <InputError message={errors.shop_address} className="input-error" />
            </div>
          </div>

          <div className="seller-form-field">
            <InputLabel htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              required
              className="seller-input"
              autoComplete="new-password"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
            />
            <div id="password-error">
              <InputError message={errors.password} className="input-error" />
            </div>
          </div>

          <div className="seller-form-field">
            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
            <TextInput
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              required
              className="seller-input"
              autoComplete="new-password"
              aria-describedby={errors.password_confirmation ? "password_confirmation-error" : undefined}
              aria-invalid={!!errors.password_confirmation}
            />
            <div id="password_confirmation-error">
              <InputError message={errors.password_confirmation} className="input-error" />
            </div>
          </div>

          <PrimaryButton className="seller-submit-btn" disabled={processing} aria-describedby="submit-help">
            Create Seller Account
          </PrimaryButton>

          <div className="seller-form-links">
            <p>By creating an account, you agree to our</p>
            <div className="seller-links-list">
              <a href={route('terms')} target="_blank" rel="noopener noreferrer" className="seller-link">
                Terms of Service
              </a>
              <span className="seller-link-separator">•</span>
              <a href={route('selling-policy')} target="_blank" rel="noopener noreferrer" className="seller-link">
                Selling Policy
              </a>
              <span className="seller-link-separator">•</span>
              <a href={route('privacy-policy')} target="_blank" rel="noopener noreferrer" className="seller-link">
                Privacy Policy
              </a>
            </div>
          </div>

          <div id="submit-help" className="sr-only">
            Click to create your seller account and start your business on ShopNest
          </div>
        </form>
      </div>
    </div>
  );
}
