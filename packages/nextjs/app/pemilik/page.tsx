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
      collateralValue: "6.5 ETH", // 30% LTV
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
    <div className="min-h-screen bg-neutral text-neutral-content">
      {/* Header/Navbar */}
      <div className="navbar bg-neutral border-b border-base-content/10 px-6">
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-xl">
              JK
            </div>
          </Link>

          <div className="tabs tabs-boxed ml-8 bg-neutral">
            <a className="tab tab-active">Creator</a>
            <a className="tab">Collector</a>
          </div>
        </div>

        <div className="flex-none gap-4">
          {/* Search */}
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search NFT's, Collections"
                className="input input-bordered bg-base-100/5 border-base-content/20 w-80"
              />
              <button className="btn btn-square bg-base-100/5 border-base-content/20">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Add NFT Button */}
          <Link href="/agen/produk/baru" className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Add NFT
          </Link>

          {/* User Avatar */}
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10">
              <span className="text-xl">R</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-20 bg-neutral border-r border-base-content/10 flex flex-col items-center py-6 gap-6">
          <button className="btn btn-ghost btn-square">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </button>
          <button className="btn btn-ghost btn-square">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="btn btn-ghost btn-square">
            <Squares2X2Icon className="h-6 w-6" />
          </button>
          <button className="btn btn-ghost btn-square">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Page Title & Controls */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: "Georgia, serif" }}>
                RECENT COLLECTIONS
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <Address address={connectedAddress} />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className={`btn btn-square ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setViewMode("grid")}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                className={`btn btn-square ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
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
                className="card bg-base-100/5 hover:bg-base-100/10 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => setSelectedNFT(nft.id)}
              >
                {/* NFT Image */}
                <figure className="relative aspect-square overflow-hidden">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={256}
                    height={256}
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-circle btn-ghost">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="btn btn-sm btn-circle btn-ghost">
                        <HeartIcon className="h-4 w-4" />
                      </button>
                      <button className="btn btn-sm btn-circle btn-ghost">
                        <ArrowsRightLeftIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Collateral Badge */}
                  {nft.isCollateralized && (
                    <div className="absolute top-2 right-2 badge badge-warning badge-sm gap-1">🔒 Locked</div>
                  )}

                  {/* Top Left: Creator */}
                  <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-6">
                        <span className="text-xs">{nft.creator.charAt(0)}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold">{nft.creator}</span>
                  </div>

                  {/* Bottom Stats */}
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs flex items-center gap-1">
                      <EyeIcon className="h-3 w-3" />
                      {nft.views.toLocaleString()}
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs">Last {nft.lastSale}</div>
                  </div>
                </figure>

                {/* Card Body */}
                <div className="card-body p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1 line-clamp-1">{nft.name}</h3>
                      <p className="text-xs text-base-content/60">{nft.creatorHandle}</p>
                    </div>
                    <button className="btn btn-ghost btn-circle btn-xs">
                      <HeartIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="badge badge-outline badge-sm">{nft.region}</div>
                    <div className="text-xs text-base-content/60">{nft.tokenId}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* History Section */}
          <div className="mt-16">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Georgia, serif" }}>
              HISTORY
            </h2>

            <div className="tabs tabs-boxed bg-transparent border-b border-base-content/10 mb-6">
              <a className={`tab ${activeTab === "owned" ? "tab-active" : ""}`} onClick={() => setActiveTab("owned")}>
                All history
              </a>
              <a
                className={`tab ${activeTab === "history" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("history")}
              >
                Purchase
              </a>
              <a className="tab">Transfer</a>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th className="text-base-content/60">EVENT</th>
                    <th className="text-base-content/60">FROM/TO</th>
                    <th className="text-base-content/60">AMOUNT</th>
                    <th className="text-base-content/60">VALUE</th>
                    <th className="text-base-content/60">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((item, index) => (
                    <tr key={index}>
                      <td className="font-semibold">{item.event}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-primary/20 rounded-full w-8">
                              <span className="text-xs">A</span>
                            </div>
                          </div>
                          <span>→</span>
                          <div className="avatar placeholder">
                            <div className="bg-secondary/20 rounded-full w-8">
                              <span className="text-xs">B</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{item.amount}</td>
                      <td className="font-bold">{item.value}</td>
                      <td className="text-base-content/60">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel - NFT Detail (when selected) */}
        {selectedNFT && (
          <div className="w-96 bg-base-100/5 border-l border-base-content/10 p-6 overflow-y-auto">
            {(() => {
              const nft = nftCollection.find(n => n.id === selectedNFT);
              if (!nft) return null;

              return (
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-10">
                            <span className="text-lg">{nft.creator.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold">{nft.creator}</h3>
                          <p className="text-xs text-base-content/60">{nft.creatorHandle}</p>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-circle btn-sm" onClick={() => setSelectedNFT(null)}>
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
                  <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Georgia, serif" }}>
                    {nft.name}
                  </h2>
                  <p className="text-sm text-base-content/70 mb-6">#{nft.tokenId.split("-")[2]}</p>

                  {/* Stats */}
                  <div className="flex gap-4 mb-6">
                    <div className="stat bg-base-100/5 rounded-lg p-4">
                      <div className="stat-figure">
                        <EyeIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="stat-value text-2xl">{(nft.views / 1000).toFixed(1)}k</div>
                      <div className="stat-desc">Views</div>
                    </div>
                    <div className="stat bg-base-100/5 rounded-lg p-4">
                      <div className="stat-figure">
                        <svg className="h-6 w-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="stat-value text-2xl">{nft.price}</div>
                      <div className="stat-desc">Current Price</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-base-content/70 mb-6">{nft.description}</p>

                  {/* Actions */}
                  <div className="space-y-3">
                    {nft.isCollateralized ? (
                      <>
                        <div className="alert alert-warning">
                          <CurrencyDollarIcon className="h-5 w-5" />
                          <div>
                            <p className="font-bold text-sm">Active Loan</p>
                            <p className="text-xs">Borrowed: {nft.activeLoan}</p>
                          </div>
                        </div>
                        <button className="btn btn-success btn-block gap-2">
                          <CurrencyDollarIcon className="h-5 w-5" />
                          Repay & Unlock
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-primary btn-block gap-2">
                          <CurrencyDollarIcon className="h-5 w-5" />
                          Borrow Against NFT
                        </button>
                        <div className="text-center text-sm text-base-content/60">
                          Max loan: {nft.collateralValue} (30% LTV)
                        </div>
                      </>
                    )}

                    <button className="btn btn-outline btn-block gap-2">
                      <ArrowsRightLeftIcon className="h-5 w-5" />
                      Transfer NFT
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="mt-8 space-y-2">
                    <h4 className="font-bold mb-3">Metadata</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">Region</span>
                      <span className="font-semibold">{nft.region}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">Token ID</span>
                      <span className="font-semibold">{nft.tokenId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">Mint Date</span>
                      <span className="font-semibold">{new Date(nft.mintDate).toLocaleDateString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">Last Sale</span>
                      <span className="font-semibold">{nft.lastSale}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PemilikDashboard;
