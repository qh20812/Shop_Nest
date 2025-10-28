import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import PrimaryButton from "@/components/PrimaryButton";

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
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("seller.register.store")); // Route Laravel
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Register as Seller
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Create your seller account to start your business on ShopNest.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="first_name" value="First Name" />
            <TextInput
              id="first_name"
              name="first_name"
              value={data.first_name}
              onChange={(e) => setData("first_name", e.target.value)}
              required
              className="mt-1 block w-full"
            />
            <InputError message={errors.first_name} className="mt-2" />
          </div>

          <div>
            <InputLabel htmlFor="last_name" value="Last Name" />
            <TextInput
              id="last_name"
              name="last_name"
              value={data.last_name}
              onChange={(e) => setData("last_name", e.target.value)}
              required
              className="mt-1 block w-full"
            />
            <InputError message={errors.last_name} className="mt-2" />
          </div>
        </div>

        <div>
          <InputLabel htmlFor="username" value="Username" />
          <TextInput
            id="username"
            name="username"
            value={data.username}
            onChange={(e) => setData("username", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.username} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="phone_number" value="Phone Number" />
          <TextInput
            id="phone_number"
            name="phone_number"
            value={data.phone_number}
            onChange={(e) => setData("phone_number", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.phone_number} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="shop_name" value="Shop Name" />
          <TextInput
            id="shop_name"
            name="shop_name"
            value={data.shop_name}
            onChange={(e) => setData("shop_name", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.shop_name} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="shop_address" value="Shop Address" />
          <TextInput
            id="shop_address"
            name="shop_address"
            value={data.shop_address}
            onChange={(e) => setData("shop_address", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.shop_address} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData("password_confirmation", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <PrimaryButton className="w-full justify-center" disabled={processing}>
          Create Seller Account
        </PrimaryButton>
      </form>
    </div>
  );
}
