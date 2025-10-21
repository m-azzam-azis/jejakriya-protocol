"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  BanknotesIcon,
  ChartBarIcon,
  CircleStackIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

<style jsx global>{`
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
  @import url("https://fonts.cdnfonts.com/css/aldo");
`}</style>;
// Komponen Shimmer yang disesuaikan untuk tema gelap
const ShimmerPlaceholder = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded-md ${className}`} />
);

// Gaya untuk teks dengan gradien emas
const goldGradientText = {
  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// Gaya untuk tombol dengan gradien emas
const goldGradientButton = {
  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
  color: "#060606",
};

// Komponen Sidebar yang sudah disesuaikan gayanya
const AdminSidebar = () => (
  <aside className="w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 flex-shrink-0 p-4 hidden md:block">
    <div className="flex items-center gap-3 mb-10">
      <ShieldCheckIcon className="h-8 w-8" style={{ color: "#E9A507" }} />
      <h1 className="text-3xl font-aldo" style={goldGradientText}>
        Admin
      </h1>
    </div>
    <ul className="menu space-y-2">
      <li>
        <a className="active bg-white/10 text-white">
          <ChartBarIcon className="h-5 w-5" />
          Dashboard
        </a>
      </li>
    </ul>
  </aside>
);

const AdminDashboardPage: NextPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { title: "Total Value Locked (TVL)", value: "$1,234,567", icon: CircleStackIcon },
    { title: "Total Dana Dipinjam", value: "$876,543", icon: BanknotesIcon },
    { title: "Tingkat Utilisasi", value: "67.00%", icon: ScaleIcon },
  ];

  return (
    <div
      className="flex h-screen text-white"
      style={{
        background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
      }}
    >
      {/* Overlay dari landing page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full"
        style={{ backgroundImage: "url('/Overlay.png')", backgroundRepeat: "repeat-y", zIndex: 0, opacity: 0.7 }}
      />

      <AdminSidebar />

      {/* Wrapper untuk konten utama agar bisa di-scroll */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-aldo" style={goldGradientText}>
            Admin Dashboard
          </h1>
          <p className="text-white/70 mt-1">Monitoring kesehatan Lending Pool dan manajemen protokol JejakKriya.</p>
        </header>

        {/* --- Stats Section --- */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10 transition-all duration-300 hover:bg-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-white/70">{stat.title}</h3>
                  <stat.icon className="h-6 w-6 text-yellow-400" />
                </div>
                {loading ? (
                  <ShimmerPlaceholder className="h-10 w-3/4" />
                ) : (
                  <p className="text-4xl font-aldo" style={goldGradientText}>
                    {stat.value}
                  </p>
                )}
              </div>
            ))}
            {/* Kartu Suku Bunga */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10 transition-all duration-300 hover:bg-white/10">
              <h3 className="text-base font-semibold text-white/70">Suku Bunga (APY)</h3>
              {loading ? (
                <ShimmerPlaceholder className="h-12 w-full mt-2" />
              ) : (
                <div className="text-lg space-y-1 pt-2">
                  <p>
                    Pemasok (LP): <span className="font-bold text-green-400">5.25%</span>
                  </p>
                  <p>
                    Peminjam: <span className="font-bold text-red-400">8.15%</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- Management Section --- */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
            <h3 className="font-aldo text-2xl mb-4" style={goldGradientText}>
              Manajemen Risiko
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-2">Peminjam</th>
                    <th className="p-2">Health Factor</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <>
                      <tr>
                        <td>
                          <ShimmerPlaceholder className="h-5 w-full" />
                        </td>
                        <td>
                          <ShimmerPlaceholder className="h-5 w-full" />
                        </td>
                        <td>
                          <ShimmerPlaceholder className="h-5 w-full" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <ShimmerPlaceholder className="h-5 w-full" />
                        </td>
                        <td>
                          <ShimmerPlaceholder className="h-5 w-full" />
                        </td>
                        <td>
                          <ShimmerPlaceholder className="h-5 w-full" />
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="border-b border-white/5">
                        <td className="p-2 font-mono text-sm">0xabc...</td>
                        <td className="p-2">1.15</td>
                        <td className="p-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                            Dekat Likuidasi
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-2 font-mono text-sm">0xdef...</td>
                        <td className="p-2">2.54</td>
                        <td className="p-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/70">Aman</span>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
              <h3 className="font-aldo text-2xl mb-4" style={goldGradientText}>
                Parameter Protokol
              </h3>
              <div className="border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-sm rounded-lg p-3 flex gap-3 items-center">
                <ExclamationTriangleIcon className="h-8 w-8 flex-shrink-0" />
                <p>Perubahan di sini adalah tindakan berisiko tinggi dan harus melalui proses Multi-Sig.</p>
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="text-white/70">Ubah Loan-to-Value (LTV)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input bg-transparent border-white/20 w-full"
                    placeholder="Contoh: 35"
                  />
                  <button className="btn border-0 font-bold bg-red-600 hover:bg-red-700 text-white">Ajukan</button>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
              <h3 className="font-aldo text-2xl mb-4" style={goldGradientText}>
                Manajemen Kurator
              </h3>
              <div className="form-control">
                <label className="label">
                  <span className="text-white/70">Alamat Wallet Kurator</span>
                </label>
                <input type="text" className="input bg-transparent border-white/20 w-full" placeholder="0x..." />
                <div className="flex gap-2 mt-3">
                  <button className="btn border-0 font-bold" style={goldGradientButton}>
                    <UserPlusIcon className="h-4 w-4" /> Tambah
                  </button>
                  <button className="btn btn-outline border-white/30 text-white hover:bg-white/10">
                    <UserMinusIcon className="h-4 w-4" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
