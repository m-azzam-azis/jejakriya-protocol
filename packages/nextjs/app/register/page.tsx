"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "~~/contexts/AuthContext";
import { UserRole } from "~~/types/auth";
import { EnvelopeIcon, LockClosedIcon, UserIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(email, password, name, role);
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goldGradientText = {
    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const goldGradientButton = {
    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
    color: "#060606",
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
      `}</style>

      <div
        className="flex flex-col min-h-screen relative text-white items-center justify-center py-8"
        style={{
          background: "#0D0D0D",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full"
          style={{
            backgroundImage: "url('/Overlay.png')",
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% auto",
            zIndex: 0,
            opacity: 0.7,
          }}
        />

        <div className="relative z-10 w-full max-w-md px-4">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={goldGradientText}>
              JejaKriya
            </h1>
            <p className="text-white/70">Daftar Akun Baru</p>
          </div>

          {/* Register Card */}
          <div className="bg-purple-950/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50">
            <h2 className="text-2xl font-bold mb-6 text-center" style={goldGradientText}>
              Register
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama Anda"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/30 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/30 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                <div className="relative">
                  <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/30 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
                <p className="text-xs text-white/50 mt-1">Minimal 6 karakter</p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Role</label>
                <div className="relative">
                  <ShieldCheckIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white focus:border-yellow-400 focus:ring-yellow-400 appearance-none"
                  >
                    <option value="user" className="bg-gray-800">
                      User / Pengguna
                    </option>
                    <option value="agen" className="bg-gray-800">
                      Agen
                    </option>
                    <option value="kurator" className="bg-gray-800">
                      Kurator
                    </option>
                    <option value="admin" className="bg-gray-800">
                      Admin
                    </option>
                  </select>
                </div>
                <div className="mt-2 text-xs text-white/50">
                  {role === "user" && "• Akses: Home, Lending, Pengrajin"}
                  {role === "agen" && "• Akses: Home, Lending, Pengrajin, Agen"}
                  {role === "kurator" && "• Akses: Home, Lending, Pengrajin, Kurator"}
                  {role === "admin" && "• Akses: Semua halaman"}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={goldGradientButton}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Loading...
                  </span>
                ) : (
                  "Daftar"
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-white/50 mt-6">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-yellow-400 hover:underline">
                Login disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
