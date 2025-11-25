import { useAuthStore } from "../../auth/store/auth.store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import AdminAppLayout from "../../Admin/layouts/layout";

export function AppLayout() {
  const role = useAuthStore.getState().user?.role;
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) navigate("/auth");
  }, [role]);

  return role === "admin" ? <AdminAppLayout /> : null;
}
