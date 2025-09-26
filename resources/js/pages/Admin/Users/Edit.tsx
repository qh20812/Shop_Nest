
import React from "react";
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import UserEditForm from "../../../components/admin/users/UserEditForm";
import { useTranslation } from '../../../lib/i18n';

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
  [key: string]: unknown;
}

export default function Edit() {
  const { user, roles, errors } = usePage<PageProps>().props;
  const { t } = useTranslation();

  return (
    <AppLayout>
      <Head title={`${t("Edit User")} - ${user.first_name} ${user.last_name}`} />
      
        {/* Header */}
        <div className="header">
          <div className="left">
            <h1>{t("Edit User")}</h1>
            <ul className="breadcrumb">
              <li>
                <a href="/admin/dashboard">Admin</a>
              </li>
              <li>
                <i className="bx bx-chevron-right"></i>
              </li>
              <li>
                <a href="/admin/users">Users</a>
              </li>
              <li>
                <i className="bx bx-chevron-right"></i>
              </li>
              <li>
                <a href="#" className="active">
                  {t("Edit")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Form chỉnh sửa */}
        <UserEditForm 
          user={user} 
          roles={roles} 
          errors={errors} 
        />
    </AppLayout>
  );
}
