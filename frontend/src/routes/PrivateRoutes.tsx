import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { SplashScreen } from "../shared/components/layout/SplashScreen";
import React from "react";

export default function PrivateRoutes({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return usuario ? children : <Navigate to="/login" />;
}