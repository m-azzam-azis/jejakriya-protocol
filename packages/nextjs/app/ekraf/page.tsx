"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  ArrowTrendingUpIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  FunnelIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

<style jsx global>{`
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");

  @import url("https://fonts.cdnfonts.com/css/aldo");
`}</style>;

const ShimmerPlaceholder = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded-md ${className}`} />
); // ...existing code...
{
  /* Overlay dari landing page */
}
<div
  aria-hidden
  className="pointer-events-none absolute inset-x-0 top-0 h-full"
  style={{
    backgroundImage: "url('/Overlay.png')",
    backgroundRepeat: "repeat-y",
    backgroundPosition: "top left",
    backgroundSize: "100% auto",
    zIndex: 0,
    opacity: 0.7,
  }}
/>;
// ...existing code...

const EkrafDashboardPage: NextPage = () => {
  const [loading, setLoading] = useState(true);

  // Simulasi pengambilan data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalAssets = 12450;

  const statsCards = [
    { title: "Total Aset Terdaftar", value: totalAssets.toLocaleString(), icon: BuildingLibraryIcon },
    { title: "Distribusi Geografis", value: "34 Provinsi", icon: MapPinIcon },
    { title: "Pertumbuhan Aset (Bulan Ini)", value: "+12%", icon: ArrowTrendingUpIcon },
  ];

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

  return (
    <div
      className="flex flex-col min-h-screen relative text-white"
      style={{
        background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
        fontFamily: "'Poppins', sans-serif", // DIUBAH: Font dasar menjadi Poppins
      }}
    >
      {/* Overlay dari landing page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{
          backgroundImage: "url('/Overlay.png')",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "top left",
          zIndex: 0,
          opacity: 0.7,
        }}
      />

      {/* Konten diletakkan di atas overlay */}
      <div className="relative z-10 w-full">
        {/* ===== HERO/HEADER SECTION ===== */}
        <header className="w-full py-12 px-5 text-center">
          <h1
            className="text-5xl md:text-6xl font-bold font-aldo" // Aldo diterapkan khusus di sini
            style={goldGradientText}
          >
            Dashboard EKRAF
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mt-4">
            Pandangan makro dan wawasan strategis dari data on-chain JejakKriya.
          </p>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="w-full max-w-7xl mx-auto p-4 md:p-6">
          {/* --- Filter Section --- */}
          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10 mb-8">
            <h2 className="font-aldo text-2xl mb-4 flex items-center" style={goldGradientText}>
              <FunnelIcon className="h-6 w-6 mr-3" />
              Filter Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <input type="date" className="input bg-transparent border-white/20 w-full" />
              <select className="select bg-transparent border-white/20 w-full">
                <option>Semua Provinsi</option>
              </select>
              <select className="select bg-transparent border-white/20 w-full">
                <option>Semua Kategori</option>
              </select>
              <div className="md:col-span-2 lg:col-span-2 flex justify-end gap-2 pt-4">
                <button className="btn btn-outline border-white/30 text-white hover:bg-white/10">
                  <DocumentDuplicateIcon className="h-4 w-4" /> Ekspor CSV
                </button>
                <button className="btn border-0 font-bold" style={goldGradientButton}>
                  <DocumentDuplicateIcon className="h-4 w-4" /> Ekspor PDF
                </button>
              </div>
            </div>
          </section>

          {/* --- Stats Grid Section --- */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-white/70">{stat.title}</h3>
                  <stat.icon className="h-6 w-6 text-yellow-400" />
                </div>
                {loading ? (
                  <ShimmerPlaceholder className="h-12 w-3/4" />
                ) : (
                  <p className="text-5xl font-aldo" style={goldGradientText}>
                    {stat.value}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* --- Charts Section --- */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
            <div className="lg:col-span-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
              <h3 className="font-aldo text-2xl mb-4" style={goldGradientText}>
                Analisis Pasar Sekunder
              </h3>
              {loading ? (
                <ShimmerPlaceholder className="h-48 w-full" />
              ) : (
                <div className="h-48 flex items-center justify-center text-white/50">
                  <ChartBarIcon className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
              <h3 className="font-aldo text-2xl mb-4" style={goldGradientText}>
                Aktivitas Kurator
              </h3>
              {loading ? (
                <ShimmerPlaceholder className="h-48 w-full" />
              ) : (
                <div className="h-48 flex items-center justify-center text-white/50">
                  <ChartBarIcon className="h-8 w-8" />
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EkrafDashboardPage;
