"use client";

import { useEffect, useState } from "react";
// Remove NextPage type if using App Router
// import type { NextPage } from "next";
import {
  ArrowTrendingUpIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  FunnelIcon,
  MapPinIcon, // Added for potential future use
  UserGroupIcon, // Added for potential future use
} from "@heroicons/react/24/outline";

// Global styles (keep using Poppins and Aldo)
<style jsx global>{`
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
  @import url("https://fonts.cdnfonts.com/css/aldo");
`}</style>;

// Improved Shimmer Placeholder with subtle animation
const ShimmerPlaceholder = ({ className }: { className?: string }) => (
  <div className={`bg-white/10 rounded-lg overflow-hidden relative ${className}`}>
    <div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
      style={{ animation: "shimmer 1.5s infinite" }}
    />
    <style jsx>{`
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `}</style>
  </div>
);

// const EkrafDashboardPage: NextPage = () => { // Remove NextPage type
const EkrafDashboardPage = () => {
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Keep loading duration
    return () => clearTimeout(timer);
  }, []);

  // Updated Hardcoded Data (Slightly more descriptive/varied)
  const totalAssets = 15780;
  const provincesCovered = 28;
  const monthlyGrowth = 8.5; // Use number for potential formatting
  const totalValueLocked = 12500000; // Example stat
  const activeCurators = 52; // Example stat

  // Updated Stats Cards array
  const statsCards = [
    {
      title: "Total Aset Terverifikasi",
      value: totalAssets.toLocaleString("id-ID"), // Use Indonesian locale
      icon: BuildingLibraryIcon,
      description: "Jumlah aset kriya unik yang terdaftar on-chain.",
    },
    {
      title: "Distribusi Geografis",
      value: `${provincesCovered} Provinsi`,
      icon: MapPinIcon,
      description: "Cakupan wilayah asal aset kriya terdaftar.",
    },
    {
      title: "Pertumbuhan Aset (Bulan Ini)",
      value: `+${monthlyGrowth.toFixed(1)}%`, // Format percentage
      icon: ArrowTrendingUpIcon,
      description: "Peningkatan jumlah aset baru bulan ini.",
    },
    // Example additional stats
    // { title: "Total Nilai Aset (Est.)", value: `Rp ${totalValueLocked.toLocaleString("id-ID")}`, icon: CurrencyDollarIcon, description: "Estimasi nilai total aset yang terdaftar." },
    // { title: "Kurator Aktif", value: activeCurators.toLocaleString("id-ID"), icon: UserGroupIcon, description: "Jumlah kurator yang aktif melakukan verifikasi." },
  ];

  // Gold gradient text style
  const goldGradientText = {
    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  // Gold gradient button style
  const goldGradientButton = {
    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
    color: "#060606", // Dark text for contrast
  };

  // Simple SVG Bar Chart Placeholder
  const PlaceholderBarChart = () => (
    <svg viewBox="0 0 100 50" className="w-full h-full text-white/30" preserveAspectRatio="none">
      {/* Bars with gold gradient */}
      <defs>
        <linearGradient id="goldBarGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2C14D" />
          <stop offset="100%" stopColor="#C48A04" />
        </linearGradient>
      </defs>
      <rect x="5" y="30" width="15" height="20" fill="url(#goldBarGradient)" rx="2" />
      <rect x="25" y="10" width="15" height="40" fill="url(#goldBarGradient)" rx="2" />
      <rect x="45" y="20" width="15" height="30" fill="url(#goldBarGradient)" rx="2" />
      <rect x="65" y="5" width="15" height="45" fill="url(#goldBarGradient)" rx="2" />
      <rect x="85" y="25" width="15" height="25" fill="url(#goldBarGradient)" rx="2" />
      {/* Axis lines */}
      <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
  // Simple SVG Line Chart Placeholder
  const PlaceholderLineChart = () => (
    <svg viewBox="0 0 100 50" className="w-full h-full text-white/30" preserveAspectRatio="none">
      <defs>
        <linearGradient id="goldLineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C48A04" />
          <stop offset="100%" stopColor="#F2C14D" />
        </linearGradient>
      </defs>
      <polyline
        points="5,40 25,20 45,30 65,10 85,25 95,15"
        fill="none"
        stroke="url(#goldLineGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Axis lines */}
      <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );

  return (
    <div
      className="flex flex-col min-h-screen relative text-white"
      style={{
        background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
        fontFamily: "'Poppins', sans-serif", // Base font Poppins
      }}
    >
      {/* Overlay - Using cover and no-repeat */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 h-full" // Use fixed to prevent scrolling with content
        style={{
          backgroundImage: "url('/Overlay.png')",
          backgroundRepeat: "no-repeat", // Changed
          backgroundPosition: "center", // Changed
          backgroundSize: "cover", // Changed
          zIndex: 0,
          opacity: 0.4, // Slightly reduced opacity
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col flex-grow">
        {/* ===== HERO/HEADER SECTION ===== */}
        <header className="w-full py-16 px-5 text-center">
          <h1
            className="text-5xl md:text-7xl font-bold font-aldo tracking-wider" // Use Aldo font here
            style={goldGradientText}
          >
            Dashboard EKRAF
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mt-5">
            Pandangan makro dan wawasan strategis dari data on-chain JejakKriya.
          </p>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="w-full max-w-7xl mx-auto p-4 md:p-6 flex-grow">
          {/* --- Filter Section --- */}
          <section className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 mb-8">
            <h2 className="font-aldo text-2xl mb-5 flex items-center" style={goldGradientText}>
              <FunnelIcon className="h-6 w-6 mr-3 text-yellow-400" />
              Filter Data & Ekspor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
              {/* Filter Inputs */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60">Tanggal Mulai</label>
                <input
                  type="date"
                  className="input bg-black/20 border-white/20 w-full rounded-lg text-white/80 placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60">Tanggal Akhir</label>
                <input
                  type="date"
                  className="input bg-black/20 border-white/20 w-full rounded-lg text-white/80 placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60">Provinsi</label>
                <select className="select bg-black/20 border-white/20 w-full rounded-lg text-white/80 focus:border-yellow-400 focus:ring-yellow-400">
                  <option className="bg-gray-800 text-white">Semua Provinsi</option>
                  <option className="bg-gray-800 text-white">Jawa Barat</option>
                  <option className="bg-gray-800 text-white">Bali</option>
                  <option className="bg-gray-800 text-white">Yogyakarta</option>
                  {/* Add more provinces */}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60">Kategori</label>
                <select className="select bg-black/20 border-white/20 w-full rounded-lg text-white/80 focus:border-yellow-400 focus:ring-yellow-400">
                  <option className="bg-gray-800 text-white">Semua Kategori</option>
                  <option className="bg-gray-800 text-white">Tenun</option>
                  <option className="bg-gray-800 text-white">Batik</option>
                  <option className="bg-gray-800 text-white">Anyaman</option>
                  {/* Add more categories */}
                </select>
              </div>

              {/* Export Buttons (aligned to end on larger screens) */}
              <div className="flex justify-start md:justify-end gap-2 pt-4 col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-1 self-end">
                <button className="btn btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white rounded-lg flex-1 md:flex-none">
                  <DocumentDuplicateIcon className="h-4 w-4" /> CSV
                </button>
                <button className="btn border-0 font-bold rounded-lg flex-1 md:flex-none" style={goldGradientButton}>
                  <DocumentDuplicateIcon className="h-4 w-4" /> PDF
                </button>
              </div>
            </div>
          </section>

          {/* --- Stats Grid Section --- */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 transition-all duration-300 hover:border-yellow-400/50 hover:shadow-yellow-400/10 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-white/70">{stat.title}</h3>
                  <stat.icon className="h-7 w-7 text-yellow-400 flex-shrink-0" />
                </div>
                {loading ? (
                  <ShimmerPlaceholder className="h-12 w-3/4 mt-1 mb-2" />
                ) : (
                  <p className="text-4xl md:text-5xl font-aldo tracking-wide my-1" style={goldGradientText}>
                    {stat.value}
                  </p>
                )}
                <p className="text-xs text-white/50 mt-auto pt-2">{stat.description}</p>
              </div>
            ))}
          </section>

          {/* --- Charts Section --- */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Pasar Sekunder (Example: Bar Chart) */}
            <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <h3 className="font-aldo text-2xl mb-4 flex items-center" style={goldGradientText}>
                <ChartBarIcon className="h-6 w-6 mr-3 text-yellow-400" />
                Volume Pasar Sekunder
              </h3>
              <div className="h-64 md:h-72">
                {" "}
                {/* Fixed height for chart area */}
                {loading ? <ShimmerPlaceholder className="h-full w-full" /> : <PlaceholderBarChart />}
              </div>
              <p className="text-xs text-white/50 mt-2 text-center">Volume transaksi bulanan (simulasi)</p>
            </div>

            {/* Chart 2: Aktivitas Kurator (Example: Line Chart) */}
            <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <h3 className="font-aldo text-2xl mb-4 flex items-center" style={goldGradientText}>
                <UserGroupIcon className="h-6 w-6 mr-3 text-yellow-400" />
                Aktivitas Verifikasi
              </h3>
              <div className="h-64 md:h-72">
                {" "}
                {/* Fixed height for chart area */}
                {loading ? <ShimmerPlaceholder className="h-full w-full" /> : <PlaceholderLineChart />}
              </div>
              <p className="text-xs text-white/50 mt-2 text-center">Jumlah verifikasi per hari (simulasi)</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EkrafDashboardPage;
