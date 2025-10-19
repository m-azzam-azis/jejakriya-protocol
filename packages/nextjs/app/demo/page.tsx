"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { ChartBarIcon, CurrencyDollarIcon, QrCodeIcon, SparklesIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import {
  NFTCard,
  NFTTimeline,
  QRCodeGenerator,
  StatsGrid,
  VerificationBadge,
  generateNFTTimeline,
} from "~~/components/jejakriya";

/**
 * Demo Page - Showcase Quick Win Features
 * - Animated Stats
 * - QR Code Generator
 * - Timeline Visualization
 * - NFT Grid Gallery
 */
const DemoPage: NextPage = () => {
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);

  // Mock stats data
  const demoStats = [
    {
      value: 1247,
      label: "Total NFT Terverifikasi",
      icon: <ChartBarIcon className="h-8 w-8" />,
      color: "bg-primary/10",
    },
    {
      value: 342,
      label: "Pengrajin Aktif",
      icon: <UserGroupIcon className="h-8 w-8" />,
      color: "bg-secondary/10",
    },
    {
      value: 458.3,
      label: "Total Nilai (ETH)",
      prefix: "",
      suffix: " ETH",
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      color: "bg-accent/10",
    },
  ];

  // Mock NFT data
  const mockNFTs = [
    {
      id: 1,
      name: "Tenun Sumba Motif Kuda",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400",
      creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      tokenId: "#001",
      creatorHandle: "@pengrajin_sumba",
      likes: 42,
      price: "0.45 ETH",
      region: "NTT - Sumba",
      category: "Tenun",
      status: "verified" as const,
      views: 234,
      lastSale: "0.45 ETH",
      isCollateralized: false,
    },
    {
      id: 2,
      name: "Batik Tulis Solo",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400",
      creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      tokenId: "#002",
      creatorHandle: "@batik_solo",
      likes: 18,
      price: "0.32 ETH",
      region: "Jawa Tengah - Solo",
      category: "Batik",
      status: "verified" as const,
      views: 189,
      lastSale: "0.32 ETH",
      isCollateralized: true,
    },
    {
      id: 3,
      name: "Ukiran Kayu Jepara",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400",
      creator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      tokenId: "#003",
      creatorHandle: "@ukir_jepara",
      likes: 128,
      price: "0.68 ETH",
      region: "Jawa Tengah - Jepara",
      category: "Ukiran",
      status: "verified" as const,
      views: 312,
      lastSale: "0.68 ETH",
      isCollateralized: false,
    },
    {
      id: 4,
      name: "Anyaman Rotan Kalimantan",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400",
      creator: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      tokenId: "#004",
      creatorHandle: "@rotan_kaltim",
      likes: 6,
      price: "0.15 ETH",
      region: "Kalimantan Selatan",
      category: "Anyaman",
      status: "pending" as const,
      views: 45,
      lastSale: "0.15 ETH",
      isCollateralized: false,
    },
  ];

  // Mock timeline data
  const mockTimelineData = {
    artisanAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    submittedAt: Math.floor(Date.now() / 1000) - 86400 * 7, // 7 days ago
    curatorAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    approvedAt: Math.floor(Date.now() / 1000) - 86400 * 2, // 2 days ago
    mintedAt: Math.floor(Date.now() / 1000) - 86400 * 1, // 1 day ago
  };

  const timelineEvents = generateNFTTimeline(mockTimelineData);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent text-primary-content py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <SparklesIcon className="h-12 w-12" />
            <h1 className="text-5xl font-bold">JejaKriya Protocol Demo</h1>
          </div>
          <p className="text-xl text-primary-content/90 max-w-3xl">
            Fundamental Protocol untuk Aset Kreatif Indonesia - Showcasing Quick Win Features untuk Demo yang Impressive
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Feature 1: Animated Stats */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ChartBarIcon className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Animated Statistics</h2>
          </div>
          <p className="text-base-content/70 mb-6">
            Stats yang count up dengan smooth animation saat scroll ke section
          </p>
          <StatsGrid stats={demoStats} />
        </section>

        {/* Feature 2: NFT Grid Gallery */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
              />
            </svg>
            <h2 className="text-3xl font-bold">NFT Gallery Grid</h2>
          </div>
          <p className="text-base-content/70 mb-6">
            Grid responsive dengan hover effects dan status badges. Klik NFT untuk lihat QR Code
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockNFTs.map(nft => (
              <div key={nft.id} onClick={() => setSelectedNFT(nft.id)} className="cursor-pointer">
                <NFTCard {...nft} />
              </div>
            ))}
          </div>
        </section>

        {/* Feature 3: QR Code Generator */}
        {selectedNFT && (
          <section className="card bg-base-100 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <QrCodeIcon className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">QR Code Verification</h2>
            </div>
            <p className="text-base-content/70 mb-6">
              Setiap NFT punya QR code unik untuk verifikasi keaslian. Scan untuk lihat detail di blockchain explorer
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <QRCodeGenerator value={`https://jejakriya.id/verify/${selectedNFT}`} size={300} downloadable={true} />
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{mockNFTs.find(n => n.id === selectedNFT)?.name}</h3>
                <div className="flex items-center gap-2">
                  <VerificationBadge
                    status={mockNFTs.find(n => n.id === selectedNFT)?.status || "pending"}
                    size="lg"
                    showText={true}
                  />
                </div>
                <div className="divider"></div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Region:</span> {mockNFTs.find(n => n.id === selectedNFT)?.region}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {mockNFTs.find(n => n.id === selectedNFT)?.category}
                  </p>
                  <p>
                    <span className="font-semibold">Creator:</span>
                    <span className="font-mono text-xs ml-2">
                      {mockNFTs.find(n => n.id === selectedNFT)?.creator.slice(0, 10)}...
                    </span>
                  </p>
                </div>
                <button className="btn btn-primary btn-block mt-4">View on Blockchain Explorer</button>
                <button onClick={() => setSelectedNFT(null)} className="btn btn-ghost btn-block">
                  Close
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Feature 4: Timeline Visualization */}
        <section className="card bg-base-100 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-3xl font-bold">Product Journey Timeline</h2>
          </div>
          <p className="text-base-content/70 mb-6">
            Visualisasi perjalanan produk dari tangan pengrajin hingga menjadi NFT terverifikasi di blockchain
          </p>

          <NFTTimeline events={timelineEvents} />
        </section>

        {/* Showcase Grid: All Features */}
        <section>
          <h2 className="text-3xl font-bold mb-6">🎯 Quick Win Features Summary</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-gradient-to-br from-primary/20 to-primary/5 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">✨ Animated Stats</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Count-up animation dengan easing</li>
                  <li>Intersection Observer untuk trigger on scroll</li>
                  <li>Responsive grid layout</li>
                </ul>
                <div className="badge badge-primary">Easy to Implement</div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-secondary/20 to-secondary/5 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🎨 NFT Gallery Grid</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Tailwind responsive grid</li>
                  <li>Hover effects & image scaling</li>
                  <li>Status badges & collateral indicators</li>
                </ul>
                <div className="badge badge-secondary">Reusable Components</div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-accent/20 to-accent/5 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">📱 QR Code Generator</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Generate QR dari URL verifikasi</li>
                  <li>Download as PNG image</li>
                  <li>Perfect untuk print & marketing</li>
                </ul>
                <div className="badge badge-accent">Wow Factor</div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-info/20 to-info/5 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">⏱️ Journey Timeline</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>DaisyUI timeline component</li>
                  <li>Status indicators dengan icons</li>
                  <li>Cerita visual dari pengrajin → NFT</li>
                </ul>
                <div className="badge badge-info">Story Telling</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold mb-4">Siap untuk Demo? 🚀</h2>
          <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            Semua fitur ini sudah production-ready dan bisa langsung digunakan untuk presentasi stakeholder
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/agen-mvp" className="btn btn-primary btn-lg gap-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Daftarkan Produk
            </a>
            <a href="/pemilik" className="btn btn-outline btn-lg gap-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Lihat Gallery NFT
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DemoPage;
