"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "~~/contexts/AuthContext";
import { hasAccess } from "~~/types/auth";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Public routes that don't require auth
    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      router.push("/login");
      return;
    }

    if (user && isPublicRoute) {
      router.push("/");
      return;
    }

    // Check if user has access to current route
    if (user && !hasAccess(user.role, pathname)) {
      router.push("/");
      return;
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-yellow-400"></div>
          <p className="mt-4 text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
