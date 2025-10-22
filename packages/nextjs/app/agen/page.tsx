"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const AgenDashboard: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"pengrajin" | "produk">("pengrajin");

  // Mock data - nanti diganti dengan data real dari backend
  const pengrajinList = [
    { id: 1, nama: "Ibu Lastri", desa: "Sumba Timur", jumlahProduk: 5, status: "aktif" },
    { id: 2, nama: "Pak Wayan", desa: "Ubud, Bali", jumlahProduk: 3, status: "aktif" },
    { id: 3, nama: "Ibu Siti", desa: "Yogyakarta", jumlahProduk: 8, status: "aktif" },
  ];

  const produkList = [
    { id: 1, nama: "Kain Tenun Sumba", pengrajin: "Ibu Lastri", status: "terverifikasi", tanggal: "2025-10-15" },
    { id: 2, nama: "Tas Anyaman Rotan", pengrajin: "Pak Wayan", status: "menunggu_kurasi", tanggal: "2025-10-14" },
    { id: 3, nama: "Batik Tulis Jogja", pengrajin: "Ibu Siti", status: "draf", tanggal: "2025-10-13" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "terverifikasi":
        return (
          <div className="bg-green-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <CheckCircleIcon className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">Terverifikasi</span>
          </div>
        );
      case "menunggu_kurasi":
        return (
          <div className="bg-yellow-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <ClockIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">Menunggu Kurasi</span>
          </div>
        );
      case "draf":
        return (
          <div className="bg-blue-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <DocumentTextIcon className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold">Draf</span>
          </div>
        );
      default:
        return (
          <div className="bg-white/10 px-3 py-1 rounded-full">
            <span className="text-white/70 text-sm">{status}</span>
          </div>
        );
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
      `}</style>

      <div
        className="flex items-center flex-col min-h-screen relative"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
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
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
            <div className="flex items-center gap-4">
              <UserGroupIcon className="h-12 w-12" style={{ color: "#E9A507" }} />
              <div>
                <h1
                  className="text-4xl font-bold mb-2"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background:
                      "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Portal Agen Digital
                </h1>
                <p className="text-white/80 text-lg">Selamat datang, Doni! Kelola pengrajin dan produk dari sini.</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/agen/pengrajin/baru"
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)",
                  }}
                >
                  <UserGroupIcon className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Tambah Pengrajin Baru
                  </h3>
                  <p className="text-white/70 text-sm">Daftarkan pengrajin baru ke sistem</p>
                </div>
              </div>
            </Link>

            <Link
              href="/agen/produk/baru"
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)",
                  }}
                >
                  <PlusCircleIcon className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Tambah Produk Baru
                  </h3>
                  <p className="text-white/70 text-sm">Dokumentasikan karya pengrajin</p>
                </div>
              </div>
            </Link>

            <Link
              href="/agen/submissions"
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)",
                  }}
                >
                  <DocumentTextIcon className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Lihat Submissions
                  </h3>
                  <p className="text-white/70 text-sm">Track status produk di blockchain</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <UserGroupIcon className="h-10 w-10 mx-auto mb-3" style={{ color: "#E9A507" }} />
              <div className="text-white/60 mb-2">Total Pengrajin</div>
              <div
                className="text-4xl font-bold mb-1"
                style={{
                  fontFamily: "'Aldo', sans-serif",
                  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {pengrajinList.length}
              </div>
              <div className="text-white/50 text-sm">Yang Anda kelola</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <DocumentTextIcon className="h-10 w-10 mx-auto mb-3" style={{ color: "#E9A507" }} />
              <div className="text-white/60 mb-2">Produk Terdaftar</div>
              <div
                className="text-4xl font-bold mb-1"
                style={{
                  fontFamily: "'Aldo', sans-serif",
                  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {produkList.length}
              </div>
              <div className="text-white/50 text-sm">Total produk</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <CheckCircleIcon className="h-10 w-10 mx-auto mb-3 text-green-400" />
              <div className="text-white/60 mb-2">Terverifikasi</div>
              <div
                className="text-4xl font-bold mb-1"
                style={{
                  fontFamily: "'Aldo', sans-serif",
                  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {produkList.filter(p => p.status === "terverifikasi").length}
              </div>
              <div className="text-white/50 text-sm">Sudah di-mint</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "pengrajin"
                  ? "text-black"
                  : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
              }`}
              style={
                activeTab === "pengrajin"
                  ? {
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    }
                  : {}
              }
              onClick={() => setActiveTab("pengrajin")}
            >
              <UserGroupIcon className="h-5 w-5 inline-block mr-2" />
              Daftar Pengrajin
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "produk" ? "text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
              }`}
              style={
                activeTab === "produk"
                  ? {
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    }
                  : {}
              }
              onClick={() => setActiveTab("produk")}
            >
              <DocumentTextIcon className="h-5 w-5 inline-block mr-2" />
              Daftar Produk
            </button>
          </div>

          {/* Content - Grid Cards */}
          {activeTab === "pengrajin" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pengrajinList.map((pengrajin, index) => (
                <div
                  key={pengrajin.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div className="bg-green-500/20 px-3 py-1 rounded-full">
                      <span className="text-green-400 text-xs font-semibold">{pengrajin.status}</span>
                    </div>
                  </div>

                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {pengrajin.nama}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Lokasi</p>
                      <p className="text-white font-semibold">{pengrajin.desa}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Jumlah Produk</p>
                      <p className="text-white font-semibold">{pengrajin.jumlahProduk} produk</p>
                    </div>
                  </div>

                  <Link
                    href={`/agen/pengrajin/${pengrajin.id}`}
                    className="block w-full text-center px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                      color: "#060606",
                    }}
                  >
                    Lihat Detail
                  </Link>
                </div>
              ))}
            </div>
          )}

          {activeTab === "produk" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produkList.map((produk, index) => (
                <div
                  key={produk.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    {getStatusBadge(produk.status)}
                  </div>

                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {produk.nama}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Pengrajin</p>
                      <p className="text-white font-semibold">{produk.pengrajin}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Tanggal Dibuat</p>
                      <p className="text-white font-semibold">{new Date(produk.tanggal).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>

                  <Link
                    href={`/agen/produk/${produk.id}`}
                    className="block w-full text-center px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                      color: "#060606",
                    }}
                  >
                    Lihat Detail
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgenDashboard;
