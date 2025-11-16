
import React from "react";
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";
import UserEditForm from "../../../Components/admin/users/UserEditForm";
import { useTranslation } from '../../../lib/i18n';
import Header from '../../../components/ui/Header';

interface Role {
  id: number;
  name: Record<string, string>; // Translation object with locale keys
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
        <Header
          title={t("Edit User")}
          breadcrumbs={[
            { label: t("Users"), href: "/admin/users" },
            { label: t("Edit"), href: "#", active: true },
          ]}
        />

        {/* Form chỉnh sửa */}
        <UserEditForm 
          user={user} 
          roles={roles} 
          errors={errors} 
        />
    </AppLayout>
  );
}
