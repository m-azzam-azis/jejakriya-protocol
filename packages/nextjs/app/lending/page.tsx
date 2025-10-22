"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { BanknotesIcon, FunnelIcon, MagnifyingGlassIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

// <-- 1. IMPORT DITAMBAHKAN

// Komponen Shimmer Placeholder
const ShimmerPlaceholder = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded-md ${className}`} />
);

const LendingPage: NextPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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

  // --- 2. DATA ASET DIPERBARUI DENGAN URL GAMBAR ---
  const nftAssets = [
    {
      id: 1,
      name: "Keris Pusaka Naga Sasra",
      image: "/Keris-Nagasasra-Wahyu-Tumurun-Kinatah-Kamarogan-Silih-Asih-3.jpg",
      curator: "Museum Nasional",
      collateralValue: 5000,
    },
    {
      id: 2,
      name: "Batik Tulis Sido Asih",
      image: "/Batik-Sido-Asih.jpg",
      curator: "Kriya Nusantara",
      collateralValue: 1200,
    },
    {
      id: 3,
      name: "Wayang Golek Cepot",
      image: "/cepot.jpg",
      curator: "Galeri Warisan",
      collateralValue: 850,
    },
  ];
  // --------------------------------------------------

  return (
    <div
      className="flex flex-col min-h-screen relative text-white"
      style={{
        background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
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

      <div className="relative z-10 w-full">
        {/* ===== HERO/HEADER SECTION ===== */}
        <header className="w-full py-12 px-5 text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-aldo" style={goldGradientText}>
            Likuiditas untuk Warisan Budaya
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mt-4">
            Pilih aset kreatif terverifikasi Anda di bawah ini untuk digunakan sebagai jaminan pinjaman.
          </p>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="w-full max-w-7xl mx-auto p-4 md:p-6">
          {/* --- Filter Section --- */}
          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10 mb-8">
            <h2 className="font-aldo text-2xl mb-4 flex items-center" style={goldGradientText}>
              <FunnelIcon className="h-6 w-6 mr-3" />
              Galeri Aset Jaminan
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-grow">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Cari nama aset..."
                  className="input bg-transparent border-white/20 w-full pl-10"
                />
              </div>
              <select className="select bg-transparent border-white/20 min-w-[200px]">
                <option>Filter berdasarkan Kurator</option>
                <option>Museum Nasional</option>
                <option>Kriya Nusantara</option>
                <option>Galeri Warisan</option>
              </select>
            </div>
          </section>

          {/* --- NFT Asset Grid --- */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? // Shimmer placeholders
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/10">
                    <ShimmerPlaceholder className="h-48 w-full rounded-lg" />
                    <ShimmerPlaceholder className="h-7 w-3/4 mt-4" />
                    <ShimmerPlaceholder className="h-5 w-1/2 mt-2" />
                    <ShimmerPlaceholder className="h-10 w-full mt-4" />
                  </div>
                ))
              : // NFT Asset Cards
                nftAssets.map(asset => (
                  <div
                    key={asset.id}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                  >
                    {/* --- 3. BAGIAN INI DIGANTI DENGAN NEXT/IMAGE --- */}
                    <div className="relative h-48 w-full">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        layout="fill"
                        objectFit="cover"
                        priority={asset.id <= 3} // Memprioritaskan gambar yang terlihat di awal
                      />
                    </div>
                    {/* ------------------------------------------- */}

                    <div className="p-4">
                      <h3 className="font-aldo text-2xl truncate" style={goldGradientText}>
                        {asset.name}
                      </h3>
                      <div className="text-sm text-white/70 mt-2 space-y-1">
                        <p className="flex items-center gap-2">
                          <ShieldCheckIcon className="h-4 w-4 text-yellow-400" />
                          <strong>Kurator:</strong> {asset.curator}
                        </p>
                        <p className="flex items-center gap-2">
                          <BanknotesIcon className="h-4 w-4 text-yellow-400" />
                          <strong>Nilai Kolateral:</strong> {asset.collateralValue.toLocaleString()} USDC
                        </p>
                      </div>
                      <button className="btn w-full mt-4 border-0 font-bold" style={goldGradientButton}>
                        Ajukan Pinjaman
                      </button>
                    </div>
                  </div>
                ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default LendingPage;
