"use client";

import { useState } from "react";
import type { NextPage } from "next";
import {
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const AnalyticsDashboard: NextPage = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  // Mock data - nanti diganti dengan data real dari backend/smart contract
  const stats = {
    totalNFTs: 1247,
    totalValue: "458.3 ETH",
    activeArtisans: 342,
    totalLoans: "127.5 ETH",
    growthRate: "+23.5%",
  };

  const regionData = [
    { region: "Jawa Tengah", nfts: 342, value: "125.3 ETH", artisans: 89, color: "bg-primary" },
    { region: "Bali", nfts: 218, value: "98.7 ETH", artisans: 54, color: "bg-secondary" },
    { region: "Jawa Timur", nfts: 195, value: "87.2 ETH", artisans: 67, color: "bg-accent" },
    { region: "Sumba", nfts: 156, value: "65.4 ETH", artisans: 42, color: "bg-info" },
    { region: "Yogyakarta", nfts: 143, value: "45.8 ETH", artisans: 38, color: "bg-success" },
    { region: "Lainnya", nfts: 193, value: "35.9 ETH", artisans: 52, color: "bg-warning" },
  ];

  const categoryData = [
    { category: "Tenun", count: 387, percentage: 31, value: "152.3 ETH" },
    { category: "Batik", count: 312, percentage: 25, value: "128.7 ETH" },
    { category: "Anyaman", count: 248, percentage: 20, value: "89.4 ETH" },
    { category: "Ukiran", count: 186, percentage: 15, value: "65.2 ETH" },
    { category: "Keramik", count: 114, percentage: 9, value: "22.7 ETH" },
  ];

  const monthlyGrowth = [
    { month: "Apr", nfts: 850, loans: 45 },
    { month: "May", nfts: 920, loans: 52 },
    { month: "Jun", nfts: 1050, loans: 68 },
    { month: "Jul", nfts: 1120, loans: 84 },
    { month: "Aug", nfts: 1180, loans: 97 },
    { month: "Sep", nfts: 1210, loans: 115 },
    { month: "Oct", nfts: 1247, loans: 127 },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-content py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Buku Besar Ekonomi Kreatif Nasional</h1>
              <p className="text-accent-content/80 text-lg">Dashboard Analitik untuk Kemenparekraf/Ekraf</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-circle btn-ghost">
                <ArrowPathIcon className="h-6 w-6" />
              </button>
              <div className="badge badge-lg gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                Live Data
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Ringkasan Statistik</h2>
          <div className="join">
            <button
              className={`btn join-item ${timeRange === "7d" ? "btn-active" : ""}`}
              onClick={() => setTimeRange("7d")}
            >
              7 Hari
            </button>
            <button
              className={`btn join-item ${timeRange === "30d" ? "btn-active" : ""}`}
              onClick={() => setTimeRange("30d")}
            >
              30 Hari
            </button>
            <button
              className={`btn join-item ${timeRange === "90d" ? "btn-active" : ""}`}
              onClick={() => setTimeRange("90d")}
            >
              90 Hari
            </button>
            <button
              className={`btn join-item ${timeRange === "1y" ? "btn-active" : ""}`}
              onClick={() => setTimeRange("1y")}
            >
              1 Tahun
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-primary">
              <ChartBarIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Total NFT Terverifikasi</div>
            <div className="stat-value text-primary">{stats.totalNFTs.toLocaleString()}</div>
            <div className="stat-desc text-success font-semibold">{stats.growthRate} dari bulan lalu</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-secondary">
              <CurrencyDollarIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Nilai Aset</div>
            <div className="stat-value text-secondary">{stats.totalValue}</div>
            <div className="stat-desc">≈ Rp 18.3 Miliar</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-accent">
              <UserGroupIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Pengrajin Aktif</div>
            <div className="stat-value text-accent">{stats.activeArtisans}</div>
            <div className="stat-desc">Dari 23 provinsi</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-info">
              <CurrencyDollarIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Pinjaman Aktif</div>
            <div className="stat-value text-info">{stats.totalLoans}</div>
            <div className="stat-desc">≈ Rp 5.1 Miliar</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-success">
              <ArrowTrendingUpIcon className="h-8 w-8" />
            </div>
            <div className="stat-title">Pertumbuhan</div>
            <div className="stat-value text-success">{stats.growthRate}</div>
            <div className="stat-desc">Month over month</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Regional Distribution */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title flex items-center gap-2 mb-4">
                <MapPinIcon className="h-6 w-6" />
                Distribusi Regional
              </h3>

              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{region.region}</span>
                      <span className="text-base-content/70">{region.nfts} NFT</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <progress
                        className={`progress ${region.color.replace("bg-", "progress-")} flex-1`}
                        value={region.nfts}
                        max="350"
                      ></progress>
                      <span className="text-sm font-bold min-w-fit">{region.value}</span>
                    </div>
                    <div className="flex justify-between text-xs text-base-content/60 mt-1">
                      <span>{region.artisans} pengrajin</span>
                      <span>{((region.nfts / stats.totalNFTs) * 100).toFixed(1)}% dari total</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Kategori Produk</h3>

              <div className="space-y-4">
                {categoryData.map((cat, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">{cat.category}</span>
                        <span>
                          {cat.count} produk ({cat.percentage}%)
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={cat.percentage}
                        max="100"
                      ></progress>
                    </div>
                    <div className="text-right min-w-fit">
                      <div className="font-bold text-lg">{cat.value}</div>
                      <div className="text-xs text-base-content/60">Total nilai</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title mb-6">Pertumbuhan Bulanan</h3>

            <div className="flex items-end justify-around h-80 border-b border-base-300">
              {monthlyGrowth.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  {/* NFT Bar */}
                  <div className="flex flex-col items-center justify-end flex-1 w-full px-2">
                    <div className="tooltip" data-tip={`${data.nfts} NFT`}>
                      <div
                        className="bg-primary rounded-t w-full cursor-pointer hover:bg-primary-focus transition-colors"
                        style={{ height: `${(data.nfts / 1300) * 100}%`, minHeight: "4px" }}
                      ></div>
                    </div>
                  </div>

                  {/* Loans Bar */}
                  <div className="flex flex-col items-center justify-end h-24 w-full px-2">
                    <div className="tooltip" data-tip={`${data.loans} Pinjaman`}>
                      <div
                        className="bg-secondary rounded-t w-full cursor-pointer hover:bg-secondary-focus transition-colors"
                        style={{ height: `${(data.loans / 130) * 100}%`, minHeight: "4px" }}
                      ></div>
                    </div>
                  </div>

                  {/* Month Label */}
                  <div className="text-sm font-semibold mt-2">{data.month}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span className="text-sm">Total NFT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-secondary rounded"></div>
                <span className="text-sm">Pinjaman Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-primary/20 to-primary/5 shadow-xl">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-2">Top Performing Region</h4>
              <p className="text-3xl font-bold text-primary mb-2">Jawa Tengah</p>
              <p className="text-sm text-base-content/70">342 NFT terdaftar dengan total nilai 125.3 ETH</p>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-secondary/20 to-secondary/5 shadow-xl">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-2">Kategori Terpopuler</h4>
              <p className="text-3xl font-bold text-secondary mb-2">Tenun (31%)</p>
              <p className="text-sm text-base-content/70">387 produk tenun dengan total nilai 152.3 ETH</p>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-accent/20 to-accent/5 shadow-xl">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-2">Rata-rata Nilai NFT</h4>
              <p className="text-3xl font-bold text-accent mb-2">0.367 ETH</p>
              <p className="text-sm text-base-content/70">≈ Rp 14.7 juta per produk kreatif</p>
            </div>
          </div>
        </div>

        {/* Export & Download */}
        <div className="flex justify-center mt-12 gap-4">
          <button className="btn btn-outline gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Data (CSV)
          </button>
          <button className="btn btn-outline gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Laporan (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
