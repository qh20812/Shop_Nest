import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { useTranslation } from '../../../lib/i18n';
import Avatar from '@/components/ui/Avatar';

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

interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface PageProps {
  auth: {
    user: AuthUser;
  };
  [key: string]: unknown;
}

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
}

export default function UserTable({ users, onDelete }: UserTableProps) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const currentUserId = auth.user.id;
  return (
    <div className="bottom-data">
      <div className="orders">
        <div className="header">
          <i className="bx bx-receipt"></i>
          <h3>{t("User List")}</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>{t("ID")}</th>
              <th>{t("Full Name")}</th>
              <th>{t("Email")}</th>
              <th>{t("Role")}</th>
              <th>{t("Status")}</th>
              <th>{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                
                return (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Avatar user={user} />
                        <div>
                          <p style={{ fontWeight: "500", margin: 0 }}>
                            {user.first_name} {user.last_name}
                            {isCurrentUser && (
                              <span
                                style={{
                                  fontSize: "12px",
                                  padding: "2px 6px",
                                  borderRadius: "8px",
                                  background: "var(--light-success)",
                                  color: "var(--success)",
                                  fontWeight: "600",
                                  marginLeft: "8px",
                                }}
                              >
                                ({t('You')})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                  <td>{user.email}</td>
                  <td>
                    {user.roles.map((role, index) => (
                      <span
                        key={role.id}
                        style={{
                          fontSize: "10px",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          background: role.name === "Admin" ? "var(--light-danger)" : "var(--light-primary)",
                          color: role.name === "Admin" ? "var(--danger)" : "var(--primary)",
                          fontWeight: "600",
                          marginRight: index < user.roles.length - 1 ? "4px" : "0"
                        }}
                      >
                        {role.name}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span 
                      className={`status ${user.is_active ? "completed" : "pending"}`}
                    >
                      {user.is_active ? t("Active") : t("Inactive")}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "16px",
                          background: "var(--light-primary)",
                          color: "var(--primary)",
                          textDecoration: "none",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <i className="bx bx-edit"></i>
                        {t("Edit")}
                      </Link>
                      <button
                        onClick={() => onDelete(user.id)}
                        disabled={isCurrentUser}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "16px",
                          background: isCurrentUser ? "var(--grey)" : "var(--light-danger)",
                          color: isCurrentUser ? "var(--dark-grey)" : "var(--danger)",
                          border: "none",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: isCurrentUser ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          opacity: isCurrentUser ? 0.6 : 1,
                        }}
                      >
                        <i className="bx bx-trash"></i>
                        {t("Inactive")}
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "var(--dark-grey)" }}>
                  <i className="bx bx-user" style={{ fontSize: "48px", display: "block", marginBottom: "8px" }}></i>
                  {t("No users found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}