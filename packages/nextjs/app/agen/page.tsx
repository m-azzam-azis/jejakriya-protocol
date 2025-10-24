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
import { useProductStore } from "~~/services/store/productStore";

const AgenDashboard: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"pengrajin" | "produk">("pengrajin");

  // Use product store for real data
  const products = useProductStore(s => s.products);

  // Aggregate pengrajin list from products
  const pengrajinMap: Record<
    string,
    { id: string; nama: string; desa?: string; jumlahProduk: number; status?: string }
  > = {};
  products.forEach(p => {
    if (!pengrajinMap[p.pengrajinId]) {
      pengrajinMap[p.pengrajinId] = {
        id: p.pengrajinId,
        nama: p.pengrajinName,
        desa: "-",
        jumlahProduk: 0,
        status: "aktif",
      };
    }
    pengrajinMap[p.pengrajinId].jumlahProduk++;
  });
  const pengrajinList = Object.values(pengrajinMap);

  const produkList = products.slice().reverse();

  const pendingProducts = products.filter(p => p.status === "pending");
  const approvedProducts = products.filter(p => p.status === "approved");
  const mintedProducts = products.filter(p => p.status === "minted");

  const toDate = (d: any) => (d ? new Date(d) : new Date());

  const recentActivities = products
    .slice()
    .sort((a, b) => toDate(b.reviewedAt ?? b.submittedAt).getTime() - toDate(a.reviewedAt ?? a.submittedAt).getTime())
    .slice(0, 10)
    .map(p => {
      const time = p.reviewedAt ?? p.submittedAt;
      if (p.status === "pending") {
        return { text: `${p.pengrajinName} - produk "${p.name}" menunggu verifikasi`, time };
      } else if (p.status === "approved") {
        return { text: `Produk "${p.name}" disetujui oleh ${p.reviewedBy}`, time };
      } else if (p.status === "minted") {
        return {
          text: `NFT "${p.name}" berhasil di-mint (token: ${p.nftTokenId?.slice(0, 8) ?? "-"}) untuk ${p.pengrajinName}`,
          time,
        };
      } else if (p.status === "rejected") {
        return { text: `Produk "${p.name}" ditolak: ${p.rejectionReason ?? "-"}`, time };
      }
      return { text: "-", time: p.submittedAt };
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "minted":
        return (
          <div className="bg-green-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <CheckCircleIcon className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">Ter-mint</span>
          </div>
        );
      case "pending":
        return (
          <div className="bg-yellow-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <ClockIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">Menunggu Kurasi</span>
          </div>
        );
      case "approved":
        return (
          <div className="bg-blue-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <DocumentTextIcon className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold">Disetujui</span>
          </div>
        );
      case "rejected":
        return (
          <div className="bg-red-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <DocumentTextIcon className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm font-semibold">Ditolak</span>
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
        @import url("https://fonts.cdnfonts.com/css/mileast");
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
                    fontFamily: "'Mileast', sans-serif",
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
                      fontFamily: "'Mileast', sans-serif",
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
                      fontFamily: "'Mileast', sans-serif",
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
                      fontFamily: "'Mileast', sans-serif",
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
                  fontFamily: "'Mileast', sans-serif",
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
                  fontFamily: "'Mileast', sans-serif",
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
                  fontFamily: "'Mileast', sans-serif",
                  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {mintedProducts.length}
              </div>
              <div className="text-white/50 text-sm">Sudah di-mint</div>
            </div>
          </div>

          {/* Recent Activities & Quick Links */}
          <div className="grid gap-6 mb-6">
            <div className="col-span-2">
              <div className="card bg-white/10 backdrop-blur-sm shadow-lg p-4">
                <h2
                  className="text-xl font-bold mb-1"
                  style={{
                    fontFamily: "'Mileast', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Aktivitas Terbaru
                </h2>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="text-white/70">No</th>
                      <th className="text-white/70">Aktivitas</th>
                      <th className="text-white/70">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((a, i) => (
                      <tr key={i}>
                        <td className="text-white">{i + 1}</td>
                        <td className="text-white">{a.text}</td>
                        <td className="text-white/70">{new Date(a.time).toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                      fontFamily: "'Mileast', sans-serif",
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
                      fontFamily: "'Mileast', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {produk.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Pengrajin</p>
                      <p className="text-white font-semibold">{produk.pengrajinName}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Tanggal Dibuat</p>
                      <p className="text-white font-semibold">
                        {new Date(produk.submittedAt).toLocaleDateString("id-ID")}
                      </p>
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
