"use client";

import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  BanknotesIcon,
  Bars3Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

// Global styles dipindah ke komponen Style
const GlobalStyles = () => (
  <style jsx global>{`
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
    @import url("https://fonts.cdnfonts.com/css/mileast");

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `}</style>
);

// Komponen Shimmer Placeholder
const ShimmerPlaceholder = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded-md ${className}`} />
);

// --- Shimmer untuk Baris Tabel ---
const TableRowShimmer = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} className="border-b border-purple-900/30 hover:bg-purple-900/20 transition-colors">
          <td className="p-4">
            <ShimmerPlaceholder className="h-5 w-5 rounded" />
          </td>
          <td className="p-4">
            <div className="flex items-center gap-3">
              <ShimmerPlaceholder className="h-12 w-12 rounded-md" />
              <div className="flex-grow">
                <ShimmerPlaceholder className="h-5 w-3/4" />
              </div>
            </div>
          </td>
          <td className="p-4">
            <ShimmerPlaceholder className="h-5 w-2/3" />
          </td>
          <td className="p-4">
            <ShimmerPlaceholder className="h-5 w-1/2" />
          </td>
          <td className="p-4">
            <ShimmerPlaceholder className="h-10 w-full rounded-lg" />
          </td>
        </tr>
      ))}
    </>
  );
};

// --- DATA DIPERBANYAK ---
const nftAssets = [
  {
    id: 1,
    name: "Keris Pusaka Naga Sasra",
    image: "keris.png",
    curator: "Ibu Wati",
    collateralValue: 5000,
  },
  {
    id: 2,
    name: "Batik Tulis Sido Asih",
    image: "sidhoasih.png",
    curator: "Kriya",
    collateralValue: 1200,
  },
  {
    id: 3,
    name: "Wayang Golek Cepot",
    image: "cepot.png",
    curator: "Karsa",
    collateralValue: 850,
  },
  {
    id: 4,
    name: "Ukiran Asmat 'Wuramon'",
    image: "asmat.png",
    curator: "Ibu Wati",
    collateralValue: 3100,
  },
  {
    id: 5,
    name: "Songket Palembang 'Lepan'",
    image: "songket.png",
    curator: "Kriya",
    collateralValue: 2200,
  },
  {
    id: 6,
    name: "Topeng Cirebon 'Panji'",
    image: "panji.png",
    curator: "Karsa",
    collateralValue: 600,
  },
  {
    id: 7,
    name: "Tenun Ikat Sumba",
    image: "ikatsumba.png",
    curator: "Kriya",
    collateralValue: 1800,
  },
  {
    id: 8,
    name: "Patung Gading Gajah",
    image: "gading.png",
    curator: "Ibu Wati",
    collateralValue: 7500,
  },
  {
    id: 9,
    name: "Batik Parang Rusak",
    image: "parangrusak.png",
    curator: "Karsa",
    collateralValue: 950,
  },
  {
    id: 10,
    name: "Noken Papua 'Anggrek'",
    image: "noken.png",
    curator: "Kriya",
    collateralValue: 300,
  },
];

// --- Data untuk Filter Koleksi ---
const collectionFilters = [
  { name: "Ibu Wati", by: "Wati LABS", value: "Ibu Wati", image: "keris.png", floorPrice: 1.27, volume: 41.8 },
  { name: "Kriya Nusantara", by: "Kriya LABS", value: "Kriya", image: "noken.png", floorPrice: 0.8, volume: 20.1 },
  { name: "Cipta Karsa", by: "Karsa LABS", value: "Karsa", image: "cepot.png", floorPrice: 30.5, volume: 1500.0 },
];

const LendingPage = () => {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [selectedCollection, setSelectedCollection] = useState(collectionFilters[0].value);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Gaya
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

  // Logika filter aset berdasarkan koleksi terpilih
  const filteredAssets =
    selectedCollection === "all" ? nftAssets : nftAssets.filter(asset => asset.curator === selectedCollection);

  // --- Komponen Grid (Kartu Aset) ---
  const AssetGrid = () => (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-purple-950/20 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-purple-800/50"
            >
              <ShimmerPlaceholder className="h-48 w-full rounded-lg" />
              <ShimmerPlaceholder className="h-7 w-3/4 mt-4" />
              <ShimmerPlaceholder className="h-5 w-1/2 mt-2" />
              <ShimmerPlaceholder className="h-10 w-full mt-4" />
            </div>
          ))
        : filteredAssets.map(asset => (
            <div
              key={asset.id}
              className="bg-purple-950/20 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-purple-800/50 transition-all duration-300 hover:bg-purple-900/30 hover:border-purple-700"
            >
              <div className="relative h-48 w-full">
                <img src={asset.image} alt={asset.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-2xl truncate" style={goldGradientText}>
                  {asset.name}
                </h3>
                <div className="text-sm text-white/70 mt-2 space-y-1">
                  <p className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-yellow-400" />
                    <strong>Kurator:</strong> {asset.curator}
                  </p>
                  <p className="flex items-center gap-2">
                    <BanknotesIcon className="h-4 w-4 text-yellow-400" />
                    <strong>Nilai:</strong> {asset.collateralValue.toLocaleString()} USDC
                  </p>
                </div>
                <button className="w-full mt-4 py-2 rounded-lg border-0 font-bold" style={goldGradientButton}>
                  Ajukan Pinjaman
                </button>
              </div>
            </div>
          ))}
    </section>
  );

  // --- Komponen Tabel (List Aset) ---
  const AssetTable = () => (
    <div className="overflow-x-auto bg-purple-950/20 backdrop-blur-sm border-y border-purple-800/50 shadow-xl">
      <table className="w-full">
        <thead className="border-b border-purple-800/50">
          <tr>
            <th className="p-4 w-12">
              <input type="checkbox" className="bg-transparent border-white/30 rounded" />
            </th>
            <th className="text-left p-4 text-xs text-white/50 uppercase tracking-wider">
              <div className="flex items-center gap-1 cursor-pointer">
                Aset <ChevronDownIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="text-left p-4 text-xs text-white/50 uppercase tracking-wider">
              <div className="flex items-center gap-1 cursor-pointer">
                Kurator <ChevronDownIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="text-left p-4 text-xs text-white/50 uppercase tracking-wider">
              <div className="flex items-center gap-1 cursor-pointer">
                Nilai Kolateral <ChevronDownIcon className="h-4 w-4" />
              </div>
            </th>
            <th className="w-48"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableRowShimmer />
          ) : (
            filteredAssets.map(asset => (
              <tr key={asset.id} className="border-b border-purple-900/30 hover:bg-purple-900/20 transition-colors">
                <td className="p-4">
                  <input type="checkbox" className="bg-transparent border-white/30 rounded" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      width={48}
                      height={48}
                      className="rounded-md w-12 h-12 object-cover"
                    />
                    <span className="font-semibold whitespace-nowrap">{asset.name}</span>
                  </div>
                </td>
                <td className="p-4 text-white/70 whitespace-nowrap">{asset.curator}</td>
                <td className="p-4 font-semibold whitespace-nowrap">{asset.collateralValue.toLocaleString()} USDC</td>
                <td className="p-4">
                  <button className="w-full py-2 rounded-lg border-0 font-bold text-sm" style={goldGradientButton}>
                    Ajukan Pinjaman
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // --- Komponen Hero Section dengan Gambar Besar dan Detail ---
  const HeroCollectionSection = () => {
    const currentCollection = collectionFilters.find(col => col.value === selectedCollection);

    if (!currentCollection) return null;

    return (
      <section className="w-full relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
        {/* Gambar Latar Belakang Utama */}
        <img
          src={currentCollection.image}
          alt={currentCollection.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay gelap agar teks lebih terbaca */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Konten Detail di Pojok Kiri Bawah */}
        <div className="absolute bottom-6 left-6 text-white z-10 p-4 bg-black/60 rounded-lg backdrop-blur-sm max-w-sm md:max-w-md">
          <h1 className="text-3xl md:text-4xl mb-2" style={goldGradientText}>
            {currentCollection.name}
          </h1>
          <p className="text-white/70 text-lg mb-4">By {currentCollection.by}</p>

          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-white/50 text-sm">FLOOR PRICE</p>
              <p className="text-xl font-bold">{currentCollection.floorPrice} ETH</p>
            </div>
            <div>
              <p className="text-white/50 text-sm">1D VOLUME</p>
              <p className="text-xl font-bold">{currentCollection.volume} ETH</p>
            </div>
          </div>

          <button className="border-0 font-bold px-6 py-3 rounded-lg flex items-center" style={goldGradientButton}>
            VIEW COLLECTION <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </div>

        {/* Thumbnail Carousel untuk Mengganti Gambar Utama */}
        <div className="absolute bottom-6 right-6 z-10 flex gap-3 overflow-x-auto py-2 pr-2">
          {collectionFilters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setSelectedCollection(filter.value)}
              className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedCollection === filter.value
                  ? "border-yellow-400 shadow-lg shadow-yellow-400/20"
                  : "border-white/10 hover:border-white/40"
              }`}
            >
              <img
                src={filter.image
                  .replace("1000x500", "200x200")
                  .replace("text=Ibu Wati", `text=${filter.name.substring(0, 5).toUpperCase()}`)}
                alt={filter.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <GlobalStyles />
      <div
        className="flex flex-col min-h-screen relative text-white"
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

        <div className="relative z-10 w-full pt-[120px]">
          {/* --- HERO SECTION (Full-width dengan padding) --- */}
          <div className="w-full p-4 md:p-6">
            <HeroCollectionSection />
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <main className="w-full">
            {/* --- Header Konten & Search (Full-width dengan padding) --- */}
            <div className="w-full p-4 md:p-6 pt-0">
              <section className="flex-grow w-full">
                {/* Header Konten (View Toggler) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <h2 className="text-3xl" style={goldGradientText}>
                    Galeri Aset Jaminan
                  </h2>
                  <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-lg">
                    <button
                      className={`p-2 rounded ${
                        viewMode === "list" ? "text-yellow-400" : "text-white/50"
                      } hover:text-yellow-400`}
                      onClick={() => setViewMode("list")}
                    >
                      <Bars3Icon className="h-5 w-5" />
                    </button>
                    <button
                      className={`p-2 rounded ${
                        viewMode === "grid" ? "text-yellow-400" : "text-white/50"
                      } hover:text-yellow-400`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Squares2X2Icon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* --- SEARCH BAR DI BAWAH JUDUL "Galeri Aset Jaminan" --- */}
                <div className="relative mb-6">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Cari aset di galeri ini..."
                    className="bg-white/5 border border-white/20 w-full pl-10 p-3 rounded-lg focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
              </section>
            </div>

            {/* Konten Aset (Full-width untuk Tabel, Full-width dengan padding untuk Grid) */}
            <div className="w-full">
              {viewMode === "list" ? (
                <AssetTable />
              ) : (
                <div className="w-full p-4 md:p-6 pt-0">
                  <AssetGrid />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default LendingPage;
