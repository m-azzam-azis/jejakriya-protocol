"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { CheckCircleIcon, ClockIcon, EyeIcon, ShieldCheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useProductStore } from "~~/services/store/productStore";

const KuratorDashboard: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

  // Real data from product store
  const products = useProductStore((s) => s.products);
  const approveProduct = useProductStore((s) => s.approveProduct);
  const rejectProduct = useProductStore((s) => s.rejectProduct);

  const pendingProducts = products.filter((p) => p.status === "pending");
  const approvedProducts = products.filter((p) => p.status === "approved" || p.status === "minted");
  const rejectedProducts = products.filter((p) => p.status === "rejected");

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        @import url('https://fonts.cdnfonts.com/css/mileast');
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
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheckIcon className="h-12 w-12" style={{ color: "#E9A507" }} />
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
                  Portal Kurator
                </h1>
                <p className="text-white/80 text-lg">
                  Selamat datang, Ibu Wati! Verifikasi produk untuk memastikan kualitas dan keaslian.
                </p>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center gap-2 mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold">Wallet Kurator:</p>
              <Address address={connectedAddress} />
              {!connectedAddress && (
                <p className="text-yellow-400 text-sm ml-auto">⚠️ Silakan connect wallet untuk approve produk</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <ClockIcon className="h-10 w-10 mx-auto mb-3" style={{ color: "#E9A507" }} />
              <div className="text-white/60 mb-2">Menunggu Review</div>
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
                {pendingProducts.length}
              </div>
              <div className="text-white/50 text-sm">Perlu diverifikasi</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <CheckCircleIcon className="h-10 w-10 mx-auto mb-3 text-green-400" />
              <div className="text-white/60 mb-2">Disetujui Bulan Ini</div>
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
                {approvedProducts.length}
              </div>
              <div className="text-white/50 text-sm">NFT berhasil di-mint</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <XCircleIcon className="h-10 w-10 mx-auto mb-3 text-red-400" />
              <div className="text-white/60 mb-2">Ditolak</div>
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
                {rejectedProducts.length}
              </div>
              <div className="text-white/50 text-sm">Perlu perbaikan</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "pending"
                  ? "text-black"
                  : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
              }`}
              style={
                activeTab === "pending"
                  ? {
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    }
                  : {}
              }
              onClick={() => setActiveTab("pending")}
            >
              <ClockIcon className="h-5 w-5 inline-block mr-2" />
              Pending ({pendingProducts.length})
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "approved"
                  ? "text-black"
                  : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
              }`}
              style={
                activeTab === "approved"
                  ? {
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    }
                  : {}
              }
              onClick={() => setActiveTab("approved")}
            >
              <CheckCircleIcon className="h-5 w-5 inline-block mr-2" />
              Approved ({approvedProducts.length})
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "rejected"
                  ? "text-black"
                  : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
              }`}
              style={
                activeTab === "rejected"
                  ? {
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    }
                  : {}
              }
              onClick={() => setActiveTab("rejected")}
            >
              <XCircleIcon className="h-5 w-5 inline-block mr-2" />
              Rejected ({rejectedProducts.length})
            </button>
          </div>

          {/* Content - Grid Layout 3 Columns */}
          {/* Pending Tab */}
          {activeTab === "pending" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProducts.length === 0 ? (
                <div className="col-span-full bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
                  <CheckCircleIcon className="h-16 w-16 mx-auto mb-4" style={{ color: "#E9A507" }} />
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
                    Semua Produk Sudah Direview!
                  </h3>
                  <p className="text-white/70">Tidak ada produk yang menunggu verifikasi saat ini.</p>
                </div>
              ) : (
                pendingProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-yellow-500/20 px-3 py-1 rounded-full">
                        <ClockIcon className="h-4 w-4 inline-block" style={{ color: "#E9A507" }} />
                        <span className="text-yellow-400 text-sm ml-1 font-semibold">Pending</span>
                      </div>
                      <div className="bg-white/10 px-3 py-1 rounded-full text-white/70 text-xs">ID: #{product.id}</div>
                    </div>

                    {/* Product Name */}
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{
                        fontFamily: "'Mileast', sans-serif",
                        background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                          color: "#060606",
                        }}
                      >
                        {product.category || "-"}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="text-white/60 text-sm">Pengrajin</p>
                        <p className="text-white font-semibold">{product.pengrajinName}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Diajukan oleh</p>
                        <p className="text-white font-semibold">{product.submittedBy}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Kategori</p>
                        <p className="text-white font-semibold">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Tanggal Submit</p>
                        <p className="text-white font-semibold">{new Date(product.submittedAt).toLocaleDateString("id-ID")}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Status</p>
                        <p className="text-white font-semibold">{product.status}</p>
                      </div>
                    </div>

                    {/* Media Badges */}
                    <div className="flex gap-2 mb-4">
                      <div className="bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 text-xs">{product.imageUrl ? "Foto" : "-"}</div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Link
                        href={`/kurator/produk/${product.id}`}
                        className="block w-full text-center px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                        style={{
                          background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                          color: "#060606",
                        }}
                      >
                        <EyeIcon className="h-4 w-4 inline-block mr-2" />
                        Review Detail
                      </Link>

                      <button
                        className="w-full px-4 py-2 rounded-lg font-semibold bg-white/5 text-white border border-green-400/50 hover:bg-green-500/20 transition-all disabled:opacity-50"
                        disabled={!connectedAddress}
                        onClick={() => approveProduct(product.id, connectedAddress ?? "Kurator Demo")}
                      >
                        <CheckCircleIcon className="h-4 w-4 inline-block mr-2" />
                        Quick Approve
                      </button>

                      <Link
                        href={`/kurator/produk/${product.id}`}
                        className="w-full px-4 py-2 rounded-lg font-semibold bg-white/5 text-white border border-red-400/50 hover:bg-red-500/20 transition-all text-center block"
                      >
                        <XCircleIcon className="h-4 w-4 inline-block mr-2" />
                        Review & Reject
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Approved Tab */}
          {activeTab === "approved" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="bg-green-500/20 px-3 py-1 rounded-full inline-block mb-4">
                    <CheckCircleIcon className="h-4 w-4 inline-block text-green-400" />
                    <span className="text-green-400 text-sm ml-1 font-semibold">Approved</span>
                  </div>

                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Mileast', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {product.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Pengrajin</p>
                      <p className="text-white font-semibold">{product.pengrajinName}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">NFT ID</p>
                      <p className="text-white font-semibold">{product.nftTokenId ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Approved on</p>
                      <p className="text-white font-semibold">
                        {product.reviewedAt ? new Date(product.reviewedAt).toLocaleDateString("id-ID") : "-"}
                      </p>
                    </div>
                  </div>

                  <a
                    href={product.nftContractAddress ? `https://sepolia.etherscan.io/address/${product.nftContractAddress}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                  >
                    View on Explorer ↗
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Rejected Tab */}
          {activeTab === "rejected" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="bg-red-500/20 px-3 py-1 rounded-full inline-block mb-4">
                    <XCircleIcon className="h-4 w-4 inline-block text-red-400" />
                    <span className="text-red-400 text-sm ml-1 font-semibold">Rejected</span>
                  </div>

                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Mileast', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {product.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Pengrajin</p>
                      <p className="text-white font-semibold">{product.pengrajinName}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Rejected on</p>
                      <p className="text-white font-semibold">
                        {product.reviewedAt ? new Date(product.reviewedAt).toLocaleDateString("id-ID") : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                    <p className="text-red-400 font-semibold text-sm mb-1">Alasan Penolakan:</p>
                    <p className="text-white/80 text-sm">{product.rejectionReason ?? "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KuratorDashboard;
