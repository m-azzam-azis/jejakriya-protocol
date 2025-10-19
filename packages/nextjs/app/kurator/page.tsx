"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { CheckCircleIcon, ClockIcon, EyeIcon, ShieldCheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const KuratorDashboard: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

  // Mock data - nanti diganti dengan data real dari smart contract
  const pendingProducts = [
    {
      id: 1,
      nama: "Kain Tenun Sumba Motif Mamuli",
      pengrajin: "Ibu Lastri",
      agen: "Doni",
      tanggal: "2025-10-15",
      region: "SUMBA-TIMUR",
      harga: 850000,
      photos: 4,
      hasVideo: true,
    },
    {
      id: 2,
      nama: "Tas Anyaman Rotan Natural",
      pengrajin: "Pak Wayan",
      agen: "Doni",
      tanggal: "2025-10-14",
      region: "BALI-UBUD",
      harga: 450000,
      photos: 5,
      hasVideo: false,
    },
  ];

  const approvedProducts = [
    {
      id: 10,
      nama: "Batik Tulis Jogja Motif Parang",
      pengrajin: "Ibu Siti",
      approved: "2025-10-13",
      nftId: "ICAS-721-001",
      txHash: "0x123...abc",
    },
  ];

  const rejectedProducts = [
    {
      id: 20,
      nama: "Keramik Kasongan",
      pengrajin: "Pak Budi",
      rejected: "2025-10-12",
      reason: "Foto kurang jelas, perlu foto tambahan dari sudut berbeda",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-secondary text-secondary-content py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheckIcon className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Portal Kurator</h1>
              <p className="text-secondary-content/80">
                Selamat datang, Ibu Wati! Verifikasi produk untuk memastikan kualitas dan keaslian.
              </p>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-2 mt-4 bg-secondary-content/10 rounded-lg p-3">
            <p className="text-sm font-semibold">Wallet Kurator:</p>
            <Address address={connectedAddress} />
            {!connectedAddress && (
              <p className="text-warning text-sm ml-auto">⚠️ Silakan connect wallet untuk approve produk</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="stats stats-vertical md:stats-horizontal shadow w-full mb-8">
          <div className="stat">
            <div className="stat-figure text-warning">
              <ClockIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Menunggu Review</div>
            <div className="stat-value text-warning">{pendingProducts.length}</div>
            <div className="stat-desc">Perlu diverifikasi</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Disetujui Bulan Ini</div>
            <div className="stat-value text-success">{approvedProducts.length}</div>
            <div className="stat-desc">NFT berhasil di-mint</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-error">
              <XCircleIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Ditolak</div>
            <div className="stat-value text-error">{rejectedProducts.length}</div>
            <div className="stat-desc">Perlu perbaikan</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-4">
          <a className={`tab ${activeTab === "pending" ? "tab-active" : ""}`} onClick={() => setActiveTab("pending")}>
            <ClockIcon className="h-5 w-5 mr-2" />
            Pending ({pendingProducts.length})
          </a>
          <a className={`tab ${activeTab === "approved" ? "tab-active" : ""}`} onClick={() => setActiveTab("approved")}>
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Approved ({approvedProducts.length})
          </a>
          <a className={`tab ${activeTab === "rejected" ? "tab-active" : ""}`} onClick={() => setActiveTab("rejected")}>
            <XCircleIcon className="h-5 w-5 mr-2" />
            Rejected ({rejectedProducts.length})
          </a>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Pending Tab */}
          {activeTab === "pending" && (
            <>
              {pendingProducts.length === 0 ? (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body text-center py-16">
                    <CheckCircleIcon className="h-16 w-16 mx-auto text-success mb-4" />
                    <h3 className="text-2xl font-bold">Semua Produk Sudah Direview!</h3>
                    <p className="text-base-content/70">Tidak ada produk yang menunggu verifikasi saat ini.</p>
                  </div>
                </div>
              ) : (
                pendingProducts.map(product => (
                  <div key={product.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                    <div className="card-body">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Product Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="card-title text-2xl">{product.nama}</h3>
                              <div className="flex gap-2 mt-2">
                                <div className="badge badge-primary">{product.region}</div>
                                <div className="badge badge-outline">ID: #{product.id}</div>
                              </div>
                            </div>
                            <div className="badge badge-warning gap-2">
                              <ClockIcon className="h-4 w-4" />
                              Pending
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div>
                              <p className="text-sm text-base-content/70">Pengrajin</p>
                              <p className="font-semibold">{product.pengrajin}</p>
                            </div>
                            <div>
                              <p className="text-sm text-base-content/70">Agen</p>
                              <p className="font-semibold">{product.agen}</p>
                            </div>
                            <div>
                              <p className="text-sm text-base-content/70">Harga Estimasi</p>
                              <p className="font-semibold">Rp {product.harga.toLocaleString("id-ID")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-base-content/70">Tanggal Submit</p>
                              <p className="font-semibold">{new Date(product.tanggal).toLocaleDateString("id-ID")}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <div className="badge badge-info">{product.photos} Foto</div>
                            {product.hasVideo && <div className="badge badge-success">✓ Video</div>}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col gap-2 min-w-fit">
                          <Link href={`/kurator/review/${product.id}`} className="btn btn-primary gap-2">
                            <EyeIcon className="h-5 w-5" />
                            Review Detail
                          </Link>

                          <button className="btn btn-outline btn-success gap-2" disabled={!connectedAddress}>
                            <CheckCircleIcon className="h-5 w-5" />
                            Quick Approve
                          </button>

                          <button className="btn btn-outline btn-error gap-2">
                            <XCircleIcon className="h-5 w-5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* Approved Tab */}
          {activeTab === "approved" && (
            <>
              {approvedProducts.map(product => (
                <div key={product.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="card-title">{product.nama}</h3>
                        <p className="text-base-content/70">Pengrajin: {product.pengrajin}</p>
                        <div className="flex gap-2 mt-2">
                          <div className="badge badge-success">Approved</div>
                          <div className="badge badge-outline">{product.nftId}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-base-content/70">Approved on</p>
                        <p className="font-semibold">{new Date(product.approved).toLocaleDateString("id-ID")}</p>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${product.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary text-sm mt-1"
                        >
                          View on Explorer ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Rejected Tab */}
          {activeTab === "rejected" && (
            <>
              {rejectedProducts.map(product => (
                <div key={product.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="card-title">{product.nama}</h3>
                        <p className="text-base-content/70">Pengrajin: {product.pengrajin}</p>
                        <div className="badge badge-error mt-2">Rejected</div>
                        <div className="alert alert-error mt-3">
                          <XCircleIcon className="h-5 w-5" />
                          <div>
                            <p className="font-semibold">Alasan Penolakan:</p>
                            <p className="text-sm">{product.reason}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-base-content/70">Rejected on</p>
                        <p className="font-semibold">{new Date(product.rejected).toLocaleDateString("id-ID")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KuratorDashboard;
