import { Navigate } from "react-router-dom";
import { adminAuth } from "@/lib/adminAuth";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  if (!adminAuth.isAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }
  return <>{children}</>;
};

export default AdminGuard;
