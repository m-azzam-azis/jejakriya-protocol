"use client";

import { useEffect, useState } from "react";
import {
  ArrowTrendingUpIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  FunnelIcon,
  GlobeAltIcon,
  MapPinIcon,
  UserGroupIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Global styles (Mengganti Poppins dengan Mileast)
<style jsx global>{`
  @import url("https://fonts.cdnfonts.com/css/mileast");
  @import url("https://fonts.cdnfonts.com/css/aldo");
`}</style>;

// Shimmer Placeholder (tidak berubah)
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

// --- Komponen Modal ---
const DashboardModal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  // Gold gradient text style
  const goldGradientText = {
    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-[#0D0D0D] via-[#1a1a1a] to-[#0D0D0D] border border-white/20 rounded-2xl shadow-xl w-full max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3
            className="font-aldo text-2xl" // Header modal tetap pakai Aldo
            style={goldGradientText}
          >
            {title}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-yellow-400 transition-colors">
            <XCircleIcon className="h-7 w-7" />
          </button>
        </div>

        {/* Konten Modal */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
// --- Akhir Komponen Modal ---

const EkrafDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    province: "all",
    category: "all",
  });

  const [isCuratorModalOpen, setIsCuratorModalOpen] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Data Hardcoded (tidak berubah)
  const totalAssets = 15780;
  const provincesCovered = 28;
  const monthlyGrowth = 8.5;
  const totalValueLocked = 12500000;
  const activeCurators = 52;

  // Stats Cards (tidak berubah)
  const statsCards = [
    {
      title: "Total Aset Terverifikasi",
      value: totalAssets.toLocaleString("id-ID"),
      icon: BuildingLibraryIcon,
      description: "Jumlah aset kriya unik on-chain.",
    },
    {
      title: "Distribusi Geografis",
      value: `${provincesCovered} Provinsi`,
      icon: MapPinIcon,
      description: "Cakupan wilayah asal aset kriya.",
    },
    {
      title: "Pertumbuhan Aset (30hr)",
      value: `+${monthlyGrowth.toFixed(1)}%`,
      icon: ArrowTrendingUpIcon,
      description: "Peningkatan aset baru bulan ini.",
    },
    {
      title: "Total Nilai Aset (Est.)",
      value: `Rp ${totalValueLocked.toLocaleString("id-ID")}`,
      icon: CurrencyDollarIcon,
      description: "Estimasi nilai total aset terdaftar.",
    },
    {
      title: "Kurator Aktif",
      value: activeCurators.toLocaleString("id-ID"),
      icon: UserGroupIcon,
      description: "Jumlah kurator yang aktif verifikasi.",
    },
  ];

  // Style gradients (tidak berubah)
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

  // --- Placeholder Charts (tidak berubah) ---

  const PlaceholderBarChart = () => (
    <svg viewBox="0 0 100 50" className="w-full h-full text-white/30" preserveAspectRatio="none">
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
      <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );

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
      <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );

  const PlaceholderDonutChart = () => (
    <svg viewBox="0 0 36 36" className="w-full h-full">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F2C14D" />
          <stop offset="100%" stopColor="#E9A507" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C48A04" />
          <stop offset="100%" stopColor="#A07003" />
        </linearGradient>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3D2C88" />
          <stop offset="100%" stopColor="#533CAF" />
        </linearGradient>
      </defs>
      <circle
        cx="18"
        cy="18"
        r="15.9154943092"
        fill="transparent"
        stroke="url(#grad1)"
        strokeWidth="3.8"
        strokeDasharray="50 50"
        strokeDashoffset="-0"
      />
      <circle
        cx="18"
        cy="18"
        r="15.9154943092"
        fill="transparent"
        stroke="url(#grad2)"
        strokeWidth="3.8"
        strokeDasharray="30 70"
        strokeDashoffset="-50"
      />
      <circle
        cx="18"
        cy="18"
        r="15.9154943092"
        fill="transparent"
        stroke="url(#grad3)"
        strokeWidth="3.8"
        strokeDasharray="20 80"
        strokeDashoffset="-80"
      />
    </svg>
  );

  const PlaceholderMap = () => (
    <svg
      viewBox="0 0 100 50"
      className="w-full h-full text-white/20"
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d="M92.8,22.4c-0.6-0.6-1.5-0.8-2.3-0.6l-8.2,1.7c-0.6-1.4-1.3-2.8-2.1-4.1c-1.4-2.4-3.2-4.5-5.3-6.2 c-0.6-0.5-1.5-0.5-2.1,0.1c-0.6,0.6-0.6,1.5-0.1,2.1c1.8,1.5,3.4,3.3,4.6,5.4c0.8,1.3,1.4,2.7,1.9,4.1l-6.8-3.1 c-0.6-0.3-1.4-0.1-1.8,0.4l-4.1,4.1c-0.3,0.3-0.4,0.7-0.4,1.1c0,0.4,0.1,0.8,0.4,1.1l5.2,5.2c0.3,0.3,0.7,0.4,1.1,0.4 c0.4,0,0.8-0.1,1.1-0.4l4.1-4.1c0.5-0.5,0.6-1.2,0.4-1.8l-3.1-6.8c0.5,0,1,0,1.4-0.1c2.4-0.4,4.7-1.3,6.8-2.6 c0.6-0.4,0.8-1.1,0.6-1.8c-0.2-0.7-0.9-1.1-1.6-1c-1.9,0.4-3.8,0.4-5.6-0.1c-0.1,0-0.2,0-0.3,0c-0.4,0-0.8-0.1-1.2-0.2l-4.5,4.5 c-0.3,0.3-0.7,0.4-1.1,0.4s-0.8-0.1-1.1-0.4l-5.2-5.2c-0.3-0.3-0.4-0.7-0.4-1.1c0-0.4,0.1-0.8,0.4-1.1l4.1-4.1 c0.5-0.5,1.2-0.6,1.8-0.4l6.8,3.1c-0.5-1.4-1-2.8-1.9-4.1c-1.2-2.1-2.8-3.9-4.6-5.4c-0.5-0.5-0.5-1.4,0.1-2.1 c0.6-0.6,1.5-0.6,2.1-0.1c2.1,1.7,3.9,3.8,5.3,6.2c0.8,1.3,1.5,2.7,2.1,4.1l8.2-1.7c0.8-0.2,1.6,0,2.3,0.6c0.6,0.6,0.8,1.5,0.6,2.3 l-1.7,8.2c1.4,0.6,2.8,1.3,4.1,2.1c2.4,1.4,4.5,3.2,6.2,5.3c0.5,0.6,0.5,1.5-0.1,2.1c-0.6,0.6-1.5,0.6-2.1-0.1 c-1.5-1.8-3.3-3.4-5.4-4.6c-1.3-0.8-2.7-1.4-4.1-1.9l3.1,6.8c0.3,0.6,0.1,1.4-0.4,1.8l-4.1,4.1c-0.3,0.3-0.7,0.4-1.1,0.4 c-0.4,0-0.8-0.1-1.1-0.4l-5.2-5.2c-0.3-0.3-0.4-0.7-0.4-1.1c0-0.4,0.1-0.8,0.4-1.1l4.1-4.1c0.5-0.5,1.2-0.6,1.8-0.4l6.8,3.1 c-0.2-0.6-0.4-1.1-0.7-1.7c-0.8-1.6-1.9-3-3.2-4.3l-8.2,1.7c-0.6,0.1-1.3,0.1-1.8-0.4l-4.1-4.1c-0.3-0.3-0.4-0.7-0.4-1.1 c0-0.4,0.1-0.8,0.4-1.1l5.2-5.2c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l4.1-4.1c0.5-0.5,1.2-0.6,1.8-0.4l6.8,3.1 c-0.5-1.4-1-2.8-1.9-4.1c-1.2-2.1-2.8-3.9-4.6-5.4c-0.5-0.5-0.5-1.4,0.1-2.1c0.6-0.6,1.5-0.6,2.1-0.1c2.1,1.7,3.9,3.8,5.3,6.2 c0.8,1.3,1.5,2.7,2.1,4.1l8.2-1.7c0.8-0.2,1.6,0,2.3,0.6c0.6,0.6,0.8,1.5,0.6,2.3l-1.7,8.2c1.4,0.6,2.8,1.3,4.1,2.1 c2.4,1.4,4.5,3.2,6.2,5.3c0.5,0.6,0.5,1.5-0.1,2.1c-0.6,0.6-1.5,0.6-2.1-0.1c-1.5-1.8-3.3-3.4-5.4-4.6c-1.3-0.8-2.7-1.4-4.1-1.9 l3.1,6.8c0.3,0.6,0.1,1.4-0.4,1.8l-4.1,4.1c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4l-5.2-5.2c-0.3-0.3-0.4-0.7-0.4-1.1 c0-0.4,0.1-0.8,0.4-1.1l4.1-4.1c0.5-0.5,1.2-0.6,1.8-0.4l6.8,3.1c-0.2-0.6-0.4-1.1-0.7-1.7c-0.8-1.6-1.9-3-3.2-4.3l-8.2,1.7 c-0.6,0.1-1.3,0.1-1.8-0.4l-4.1-4.1c-0.3-0.3-0.4-0.7-0.4-1.1c0-0.4,0.1-0.8,0.4-1.1l5.2-5.2c0.3,0.3,0.7,0.4,1.1,0.4 s0.8-0.1,1.1-0.4l4.1-4.1c0.5-0.5,1.2-0.6,1.8-0.4l6.8,3.1c-0.5-1.4-1-2.8-1.9-4.1c-1.2-2.1-2.8-3.9-4.6-5.4 c-0.5-0.5-0.5-1.4,0.1-2.1c0.6-0.6,1.5-0.6,2.1-0.1c2.1,1.7,3.9,3.8,5.3,6.2c0.8,1.3,1.5,2.7,2.1,4.1l8.2-1.7 c0.8-0.2,1.6,0,2.3,0.6C93.4,20.9,93.6,21.7,92.8,22.4z M17.3,31.8l-4.1,4.1c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4 l-5.2-5.2c-0.3-0.3-0.4-0.7-0.4-1.1c0-0.4,0.1-0.8,0.4-1.1l4.1-4.1c0.5-0.5,1.2-0.6,1.8-0.4l6.8,3.1c-0.5-1.4-1-2.8-1.9-4.1 c-1.2-2.1-2.8-3.9-4.6-5.4c-0.5-0.5-0.5-1.4,0.1-2.1c0.6-0.6,1.5-0.6,2.1-0.1c2.1,1.7,3.9,3.8,5.3,6.2c0.8,1.3,1.5,2.7,2.1,4.1 l8.2-1.7c0.8-0.2,1.6,0,2.3,0.6c0.6,0.6,0.8,1.5,0.6,2.3l-1.7,8.2c1.4,0.6,2.8,1.3,4.1,2.1c2.4,1.4,4.5,3.2,6.2,5.3 c0.5,0.6,0.5,1.5-0.1,2.1c-0.6,0.6-1.5,0.6-2.1-0.1c-1.5-1.8-3.3-3.4-5.4-4.6c-1.3-0.8-2.7-1.4-4.1-1.9l3.1,6.8 c0.3,0.6,0.1,1.4-0.4,1.8l-4.1,4.1c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4l-5.2-5.2c-0.3-0.3-0.4-0.7-0.4-1.1 c0-0.4,0.1-0.8,0.4-1.1l4.1-4.1C16.1,31.2,16.8,31.3,17.3,31.8z" />
    </svg>
  );

  const PlaceholderList = ({ items = 3 }: { items?: number }) => (
    <div className="flex flex-col gap-3">
      {Array(items)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <ShimmerPlaceholder className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-grow">
              <ShimmerPlaceholder className="h-4 w-3/4 mb-1" />
              <ShimmerPlaceholder className="h-3 w-1/2" />
            </div>
            <ShimmerPlaceholder className="h-6 w-12" />
          </div>
        ))}
    </div>
  );

  return (
    <div
      className="flex flex-col min-h-screen relative text-white"
      style={{
        background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
        // --- PERUBAHAN FONT DI SINI ---
        fontFamily: "'Mileast', sans-serif",
      }}
    >
      {/* Overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 h-full"
        style={{
          backgroundImage: "url('/Overlay.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          zIndex: 0,
          opacity: 0.4,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col flex-grow ">
        {/* ===== HERO/HEADER SECTION ===== */}
        <header className="w-full py-12 px-5 pt-[120px] text-center">
          <h1
            className="text-5xl md:text-7xl font-bold font-aldo tracking-wider" // Tetap pakai Aldo
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
            <h2
              className="font-aldo text-2xl mb-5 flex items-center" // Tetap pakai Aldo
              style={goldGradientText}
            >
              <FunnelIcon className="h-6 w-6 mr-3 text-yellow-400" />
              Filter Data & Ekspor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
              {/* Filter Inputs dengan state */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60">Tanggal Mulai</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="input bg-black/20 border-white/20 w-full rounded-lg text-white/80 placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60">Tanggal Akhir</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="input bg-black/20 border-white/20 w-full rounded-lg text-white/80 placeholder-white/50 focus:border-yellow-400 focus:ring-yellow-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60">Provinsi</label>
                <select
                  name="province"
                  value={filters.province}
                  onChange={handleFilterChange}
                  className="select bg-black/20 border-white/20 w-full rounded-lg text-white/80 focus:border-yellow-400 focus:ring-yellow-400"
                >
                  <option className="bg-gray-800 text-white" value="all">
                    Semua Provinsi
                  </option>
                  <option className="bg-gray-800 text-white" value="jabar">
                    Jawa Barat
                  </option>
                  <option className="bg-gray-800 text-white" value="bali">
                    Bali
                  </option>
                  <option className="bg-gray-800 text-white" value="yogya">
                    Yogyakarta
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60">Kategori</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="select bg-black/20 border-white/20 w-full rounded-lg text-white/80 focus:border-yellow-400 focus:ring-yellow-400"
                >
                  <option className="bg-gray-800 text-white" value="all">
                    Semua Kategori
                  </option>
                  <option className="bg-gray-800 text-white" value="tenun">
                    Tenun
                  </option>
                  <option className="bg-gray-800 text-white" value="batik">
                    Batik
                  </option>
                  <option className="bg-gray-800 text-white" value="anyaman">
                    Anyaman
                  </option>
                </select>
              </div>

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

          {/* --- Stats Grid Section (5 Kolom) --- */}
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
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
                  <p
                    className="text-3xl md:text-4xl font-aldo tracking-wide my-1" // Angka besar tetap pakai Aldo
                    style={goldGradientText}
                  >
                    {stat.value}
                  </p>
                )}
                <p className="text-xs text-white/50 mt-auto pt-2">{stat.description}</p>
              </div>
            ))}
          </section>

          {/* --- Charts Section (Grid Lebih Kompleks) --- */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Pasar Sekunder (Lebar 2 kolom) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <h3
                className="font-aldo text-2xl mb-4 flex items-center" // Tetap pakai Aldo
                style={goldGradientText}
              >
                <ChartBarIcon className="h-6 w-6 mr-3 text-yellow-400" />
                Volume Pasar Sekunder
              </h3>
              <div className="h-72 md:h-80">
                {loading ? <ShimmerPlaceholder className="h-full w-full" /> : <PlaceholderBarChart />}
              </div>
              <p className="text-xs text-white/50 mt-2 text-center">Volume transaksi bulanan (simulasi)</p>
            </div>

            {/* Chart 2: Aktivitas Verifikasi (1 kolom) */}
            <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <h3
                className="font-aldo text-2xl mb-4 flex items-center" // Tetap pakai Aldo
                style={goldGradientText}
              >
                <UserGroupIcon className="h-6 w-6 mr-3 text-yellow-400" />
                Aktivitas Verifikasi
              </h3>
              <div className="h-72 md:h-80">
                {loading ? <ShimmerPlaceholder className="h-full w-full" /> : <PlaceholderLineChart />}
              </div>
              <p className="text-xs text-white/50 mt-2 text-center">Jumlah verifikasi per hari (simulasi)</p>
            </div>

            {/* WIDGET BARU: Komposisi Kategori */}
            <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <h3
                className="font-aldo text-2xl mb-4 flex items-center" // Tetap pakai Aldo
                style={goldGradientText}
              >
                <ChartPieIcon className="h-6 w-6 mr-3 text-yellow-400" />
                Komposisi Kategori
              </h3>
              <div className="h-48">
                {loading ? <ShimmerPlaceholder className="h-full w-full rounded-full" /> : <PlaceholderDonutChart />}
              </div>
              {/* Legenda Simulasi */}
              <div className="flex justify-center gap-4 mt-4 text-xs text-white/70">
                <span className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>Tenun (50%)
                </span>
                <span className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-yellow-700 mr-2"></span>Batik (30%)
                </span>
                <span className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-purple-500 mr-2"></span>Lainnya (20%)
                </span>
              </div>
            </div>

            {/* WIDGET BARU: Kurator Teraktif */}
            <div className="flex flex-col bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <h3
                className="font-aldo text-2xl mb-4 flex items-center" // Tetap pakai Aldo
                style={goldGradientText}
              >
                <UsersIcon className="h-6 w-6 mr-3 text-yellow-400" />
                Kurator Teraktif
              </h3>
              <div className="h-48">
                {loading ? (
                  <PlaceholderList items={3} />
                ) : (
                  <div className="flex flex-col gap-3 text-sm">
                    {/* Data List Simulasi */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://ui-avatars.com/api/?name=DI&background=c48a04&color=fff"
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">Dekranasda Jabar</p>
                          <p className="text-xs text-white/50">1,204 Verifikasi</p>
                        </div>
                      </div>
                      <span className="text-yellow-400 font-bold">#1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://ui-avatars.com/api/?name=KY&background=3D2C88&color=fff"
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">Kriya Yogya</p>
                          <p className="text-xs text-white/50">980 Verifikasi</p>
                        </div>
                      </div>
                      <span className="text-white/70 font-bold">#2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://ui-avatars.com/api/?name=AB&background=3D2C88&color=fff"
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">Asosiasi Batik</p>
                          <p className="text-xs text-white/50">751 Verifikasi</p>
                        </div>
                      </div>
                      <span className="text-white/70 font-bold">#3</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Tombol Trigger Modal */}
              <div className="mt-auto pt-4">
                <button
                  className="btn btn-sm border-0 font-bold rounded-lg w-full text-xs"
                  style={goldGradientButton}
                  onClick={() => setIsCuratorModalOpen(true)}
                >
                  Lihat Semua Kurator
                </button>
              </div>
            </div>

            {/* WIDGET BARU: Peta Distribusi */}
            <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
              <h3
                className="font-aldo text-2xl mb-4 flex items-center" // Tetap pakai Aldo
                style={goldGradientText}
              >
                <GlobeAltIcon className="h-6 w-6 mr-3 text-yellow-400" />
                Distribusi Geografis
              </h3>
              <div className="h-48 flex items-center justify-center">
                {loading ? <ShimmerPlaceholder className="h-full w-full" /> : <PlaceholderMap />}
              </div>
              <p className="text-xs text-white/50 mt-2 text-center">Peta sebaran aset terverifikasi (simulasi)</p>
            </div>
          </section>
        </main>

        {/* Footer Placeholder */}
        <footer className="w-full text-center p-6 mt-12 text-sm text-white/40">
          © 2025 JejakKriya - Kementerian Pariwisata dan Ekonomi Kreatif
        </footer>

        {/* Instance Modal */}
        <DashboardModal
          isOpen={isCuratorModalOpen}
          onClose={() => setIsCuratorModalOpen(false)}
          title="Daftar Lengkap Kurator Aktif"
        >
          {/* Konten simulasi untuk modal */}
          <div className="flex flex-col gap-4 text-sm">
            {[
              { name: "Dekranasda Jabar", count: 1204, rank: 1, initial: "DJ" },
              { name: "Kriya Yogya", count: 980, rank: 2, initial: "KY" },
              { name: "Asosiasi Batik", count: 751, rank: 3, initial: "AB" },
              { name: "Museum Tekstil", count: 620, rank: 4, initial: "MT" },
              { name: "Cita Tenun Indonesia", count: 512, rank: 5, initial: "CT" },
              { name: "Galeri Nasional", count: 450, rank: 6, initial: "GN" },
              { name: "Institut Seni Bali", count: 398, rank: 7, initial: "IS" },
            ].map(item => (
              <div key={item.rank} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${item.initial}&background=${item.rank === 1 ? "c48a04" : "3D2C88"}&color=fff`}
                    alt="avatar"
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-white/50">{item.count.toLocaleString("id-ID")} Verifikasi</p>
                  </div>
                </div>
                <span className={`font-bold ${item.rank === 1 ? "text-yellow-400" : "text-white/70"}`}>
                  #{item.rank}
                </span>
              </div>
            ))}
          </div>
        </DashboardModal>
      </div>
    </div>
  );
};

export default EkrafDashboardPage;
