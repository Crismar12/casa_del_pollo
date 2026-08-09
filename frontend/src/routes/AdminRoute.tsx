import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { SkeletonLoader } from "../shared/components/iu/SkeletonLoader";
import React from "react";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-10">
        <SkeletonLoader variant="card" />
      </div>
    );
  }

  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
