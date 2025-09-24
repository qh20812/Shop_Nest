// @ts-nocheck
import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  roles: Role[];
}

interface PageProps {
  user: User;
  roles: Role[];
  errors: Record<string, string>;
}

export default function Edit() {
  const { user, roles, errors } = usePage<PageProps>().props;

  const [values, setValues] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    is_active: user.is_active ? 1 : 0,
    roles: user.roles.map((r) => r.id),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (id: number) => {
    setValues((prev) => {
      const selected = prev.roles.includes(id)
        ? prev.roles.filter((r) => r !== id)
        : [...prev.roles, id];
      return { ...prev, roles: selected };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(`/admin/users/${user.id}`, values);
  };

  return (
    <div>
      <h1>Chỉnh sửa User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ:</label>
          <input
            type="text"
            name="first_name"
            value={values.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p style={{ color: "red" }}>{errors.first_name}</p>}
        </div>

        <div>
          <label>Tên:</label>
          <input
            type="text"
            name="last_name"
            value={values.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p style={{ color: "red" }}>{errors.last_name}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <label>Trạng thái:</label>
          <select
            name="is_active"
            value={values.is_active}
            onChange={handleChange}
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Vô hiệu</option>
          </select>
        </div>

        <div>
          <label>Roles:</label>
          {roles.map((r) => (
            <div key={r.id}>
              <label>
                <input
                  type="checkbox"
                  checked={values.roles.includes(r.id)}
                  onChange={() => handleRoleToggle(r.id)}
                />
                {r.name}
              </label>
            </div>
          ))}
          {errors.roles && <p style={{ color: "red" }}>{errors.roles}</p>}
        </div>

        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
}
