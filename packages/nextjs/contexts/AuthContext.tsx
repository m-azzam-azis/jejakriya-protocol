"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType, UserRole } from "~~/types/auth";
import { notification } from "~~/utils/scaffold-eth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (in production, use real backend)
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@jejakriya.com",
    password: "admin123",
    name: "Admin JejaKriya",
    role: "admin" as UserRole,
    walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "kurator@jejakriya.com",
    password: "kurator123",
    name: "Ibu Wati",
    role: "kurator" as UserRole,
    walletAddress: "0xD940Aadc4AAAEEd0Cd2Da6b1Baf8D8f8fBD56e37",
    createdAt: new Date(),
  },
  {
    id: "3",
    email: "agen@jejakriya.com",
    password: "agen123",
    name: "Agen Kriya",
    role: "agen" as UserRole,
    walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    createdAt: new Date(),
  },
  {
    id: "4",
    email: "user@jejakriya.com",
    password: "user123",
    name: "Pengguna Umum",
    role: "user" as UserRole,
    createdAt: new Date(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("jejakriya_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt),
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("jejakriya_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error("Email atau password salah");
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      const userData = userWithoutPassword as User;

      setUser(userData);
      localStorage.setItem("jejakriya_user", JSON.stringify(userData));
      notification.success(`Selamat datang, ${userData.name}!`);
    } catch (error: any) {
      notification.error(error.message || "Login gagal");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jejakriya_user");
    notification.info("Anda telah logout");
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if email already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error("Email sudah terdaftar");
      }

      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        email,
        name,
        role,
        createdAt: new Date(),
      };

      // In production, save to backend
      MOCK_USERS.push({ ...newUser, password } as any);

      setUser(newUser);
      localStorage.setItem("jejakriya_user", JSON.stringify(newUser));
      notification.success("Registrasi berhasil!");
    } catch (error: any) {
      notification.error(error.message || "Registrasi gagal");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("jejakriya_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
