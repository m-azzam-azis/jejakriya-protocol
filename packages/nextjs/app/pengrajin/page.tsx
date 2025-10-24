"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  EyeIcon,
  HeartIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const PemilikDashboard: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"owned" | "history">("owned");
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);

  // Mock NFT data - nanti diganti dengan data real dari smart contract
  const nftCollection = [
    {
      id: 1,
      tokenId: "ICAS-001",
      name: "Kain Tenun Sumba Motif Mamuli",
      creator: "Ibu Lastri",
      creatorHandle: "@ibu_lastri",
      region: "SUMBA-TIMUR",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop",
      views: 35456,
      likes: 892,
      price: "21.765 ETH",
      lastSale: "14.3 ETH",
      mintDate: "2025-10-15",
      collateralValue: "6.5 ETH",
      isCollateralized: false,
      description:
        "Kain tenun tangan dengan motif Mamuli khas Sumba Timur. Dibuat dengan pewarna alami dari tanaman lokal.",
    },
    {
      id: 2,
      tokenId: "ICAS-002",
      name: "Batik Tulis Jogja Motif Parang",
      creator: "Ibu Siti",
      creatorHandle: "@batik_siti",
      region: "YOGYAKARTA",
      image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&auto=format&fit=crop",
      views: 28341,
      likes: 654,
      price: "18.5 ETH",
      lastSale: "12.3 ETH",
      mintDate: "2025-10-13",
      collateralValue: "5.55 ETH",
      isCollateralized: false,
      description:
        "Batik tulis premium dengan motif Parang Rusak. Proses pembuatan 3 bulan dengan teknik canting tradisional.",
    },
    {
      id: 3,
      tokenId: "ICAS-003",
      name: "Tas Anyaman Rotan Natural",
      creator: "Pak Wayan",
      creatorHandle: "@wayan_craft",
      region: "BALI-UBUD",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
      views: 19823,
      likes: 421,
      price: "8.2 ETH",
      lastSale: "5.5 ETH",
      mintDate: "2025-10-10",
      collateralValue: "2.46 ETH",
      isCollateralized: true,
      activeLoan: "1.5 ETH",
      description: "Tas anyaman rotan dengan pewarna alami. Desain modern dengan sentuhan tradisional Bali.",
    },
    {
      id: 4,
      tokenId: "ICAS-004",
      name: "Ukiran Kayu Jepara Naga",
      creator: "Pak Ahmad",
      creatorHandle: "@jepara_carving",
      region: "JEPARA",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&auto=format&fit=crop",
      views: 42190,
      likes: 1203,
      price: "32.8 ETH",
      lastSale: "28.1 ETH",
      mintDate: "2025-10-08",
      collateralValue: "9.84 ETH",
      isCollateralized: false,
      description:
        "Ukiran relief naga dari kayu jati pilihan. Detail rumit dengan finishing natural berkualitas tinggi.",
    },
  ];

  const historyData = [
    { event: "Transfer", from: "0x1234...5678", to: "0x8765...4321", amount: 3, value: "14.3 ETH", date: "21/06" },
    { event: "Purchase", from: "0xabcd...efgh", to: connectedAddress, amount: 7, value: "12.3 ETH", date: "11/07" },
    { event: "List", from: connectedAddress, to: "Market", amount: 1, value: "2.6 ETH", date: "3/07" },
  ];

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
      `}</style>

      <div
        className="min-h-screen relative pt-[100px]"
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

        <div className="relative z-10">
          {/* Header/Navbar */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl"
                    style={{
                      background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)",
                      color: "#060606",
                    }}
                  >
                    JK
                  </div>
                </Link>

                <div className="flex gap-2">
                  <button
                    className="px-6 py-2 rounded-lg font-semibold text-black"
                    style={{ background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)" }}
                  >
                    Creator
                  </button>
                  <button className="px-6 py-2 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10">
                    Collector
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search NFT's, Collections"
                    className="w-80 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-2.5 text-white/50" />
                </div>

                {/* Add NFT Button */}
                <Link
                  href="/agen/produk/baru"
                  className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    color: "#060606",
                  }}
                >
                  <PlusIcon className="h-5 w-5 inline-block mr-2" />
                  Add NFT
                </Link>

                {/* User Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{ background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)", color: "#060606" }}
                >
                  R
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Page Title & Controls */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1
                  className="text-5xl font-bold mb-4"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background:
                      "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  RECENT COLLECTIONS
                </h1>
                <div className="flex items-center gap-2">
                  <Address address={connectedAddress} />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"}`}
                  style={
                    viewMode === "grid"
                      ? { background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)" }
                      : {}
                  }
                  onClick={() => setViewMode("grid")}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"}`}
                  style={
                    viewMode === "list"
                      ? { background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)" }
                      : {}
                  }
                  onClick={() => setViewMode("list")}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-4 gap-6 mb-12">
              {nftCollection.map(nft => (
                <div
                  key={nft.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group overflow-hidden hover:scale-105"
                  onClick={() => setSelectedNFT(nft.id)}
                >
                  {/* NFT Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Collateral Badge */}
                    {nft.isCollateralized && (
                      <div className="absolute top-3 right-3 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-bold">
                        🔒 Locked
                      </div>
                    )}

                    {/* Creator Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)", color: "#060606" }}
                      >
                        {nft.creator.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-white">{nft.creator}</span>
                    </div>

                    {/* Bottom Stats */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 text-white">
                        <EyeIcon className="h-3.5 w-3.5" />
                        {nft.views.toLocaleString()}
                      </div>
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-white font-semibold">
                        Last {nft.lastSale}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1 line-clamp-1">{nft.name}</h3>
                        <p className="text-xs text-white/60">{nft.creatorHandle}</p>
                      </div>
                      <button className="text-white/70 hover:text-white">
                        <HeartIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-xs font-semibold">
                        {nft.region}
                      </div>
                      <div className="text-xs text-white/50">{nft.tokenId}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* History Section */}
            <div className="mt-16">
              <h2
                className="text-4xl font-bold mb-6"
                style={{
                  fontFamily: "'Aldo', sans-serif",
                  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                HISTORY
              </h2>

              <div className="flex gap-2 mb-6">
                <button
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === "owned" ? "text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"}`}
                  style={
                    activeTab === "owned"
                      ? { background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)" }
                      : {}
                  }
                  onClick={() => setActiveTab("owned")}
                >
                  All history
                </button>
                <button
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === "history" ? "text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"}`}
                  style={
                    activeTab === "history"
                      ? { background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)" }
                      : {}
                  }
                  onClick={() => setActiveTab("history")}
                >
                  Purchase
                </button>
                <button className="px-6 py-2 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10">
                  Transfer
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-6 py-4 text-white/60 font-semibold text-sm">EVENT</th>
                      <th className="text-left px-6 py-4 text-white/60 font-semibold text-sm">FROM/TO</th>
                      <th className="text-left px-6 py-4 text-white/60 font-semibold text-sm">AMOUNT</th>
                      <th className="text-left px-6 py-4 text-white/60 font-semibold text-sm">VALUE</th>
                      <th className="text-left px-6 py-4 text-white/60 font-semibold text-sm">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4 text-white font-semibold">{item.event}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-white/10 text-white">
                              A
                            </div>
                            <span className="text-white/60">→</span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-white/10 text-white">
                              B
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">{item.amount}</td>
                        <td className="px-6 py-4 text-white font-bold">{item.value}</td>
                        <td className="px-6 py-4 text-white/60">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - NFT Detail (when selected) */}
        {selectedNFT && (
          <div className="fixed right-0 top-0 w-96 h-screen bg-white/5 backdrop-blur-sm border-l border-white/10 p-6 overflow-y-auto z-50">
            {(() => {
              const nft = nftCollection.find(n => n.id === selectedNFT);
              if (!nft) return null;

              return (
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                        style={{ background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)", color: "#060606" }}
                      >
                        {nft.creator.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{nft.creator}</h3>
                        <p className="text-xs text-white/60">{nft.creatorHandle}</p>
                      </div>
                    </div>
                    <button
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                      onClick={() => setSelectedNFT(null)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Large Image */}
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    className="w-full aspect-square object-cover rounded-2xl mb-6"
                    height={256}
                    width={256}
                  />

                  {/* NFT Title */}
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {nft.name}
                  </h2>
                  <p className="text-sm text-white/70 mb-6">#{nft.tokenId.split("-")[2]}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <EyeIcon className="h-6 w-6 mb-2" style={{ color: "#E9A507" }} />
                      <div className="text-2xl font-bold text-white">{(nft.views / 1000).toFixed(1)}k</div>
                      <div className="text-xs text-white/60">Views</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <CurrencyDollarIcon className="h-6 w-6 mb-2" style={{ color: "#E9A507" }} />
                      <div className="text-2xl font-bold text-white">{nft.price}</div>
                      <div className="text-xs text-white/60">Current Price</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/70 mb-6">{nft.description}</p>

                  {/* Actions */}
                  <div className="space-y-3">
                    {nft.isCollateralized ? (
                      <>
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <CurrencyDollarIcon className="h-5 w-5 text-yellow-400" />
                            <p className="font-bold text-sm text-yellow-400">Active Loan</p>
                          </div>
                          <p className="text-xs text-white/80">Borrowed: {nft.activeLoan}</p>
                        </div>
                        <button className="w-full px-6 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-all">
                          <CurrencyDollarIcon className="h-5 w-5 inline-block mr-2" />
                          Repay & Unlock
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                          style={{
                            background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                            color: "#060606",
                          }}
                        >
                          <CurrencyDollarIcon className="h-5 w-5 inline-block mr-2" />
                          Borrow Against NFT
                        </button>
                        <div className="text-center text-sm text-white/60">
                          Max loan: {nft.collateralValue} (30% LTV)
                        </div>
                      </>
                    )}

                    <button className="w-full px-6 py-3 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all">
                      <ArrowsRightLeftIcon className="h-5 w-5 inline-block mr-2" />
                      Transfer NFT
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <h4 className="font-bold mb-3 text-white">Metadata</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Region</span>
                        <span className="font-semibold text-white">{nft.region}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Token ID</span>
                        <span className="font-semibold text-white">{nft.tokenId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Mint Date</span>
                        <span className="font-semibold text-white">
                          {new Date(nft.mintDate).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Last Sale</span>
                        <span className="font-semibold text-white">{nft.lastSale}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
};

export default PemilikDashboard;
