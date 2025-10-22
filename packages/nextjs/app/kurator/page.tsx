"use client";

import { useEffect, useState } from "react";
// <-- Tambahkan useRef
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  ChatBubbleBottomCenterTextIcon, // <-- Icon baru untuk modal
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// <-- Tambahkan useScaffoldWriteContract
import { fetchFromIPFS } from "~~/utils/ipfs";
// Menggunakan fungsi canggih Anda
import { notification } from "~~/utils/scaffold-eth";

// <-- Tambahkan notification

// Tipe data (tidak berubah)
type Product = {
  id: string; // requestId
  nama: string;
  pengrajin: string; // artisan address
  agen: string; // submittedBy address
  tanggal: string; // submission timestamp
  region: string;
  harga: number;
  photos: number;
  hasVideo: boolean;
  ipfsHash: string;
};

type ApprovedProduct = {
  id: string; // requestId
  nama: string;
  pengrajin: string; // artisan address
  approved: string; // approval timestamp
  nftId: string;
  txHash: string;
};

type RejectedProduct = {
  id: string; // requestId
  nama: string;
  pengrajin: string; // (dari MintRequested)
  rejected: string; // rejection timestamp
  reason: string;
};

const KuratorDashboard: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

  // State untuk menyimpan data (tidak berubah)
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [approvedProducts, setApprovedProducts] = useState<ApprovedProduct[]>([]);
  const [rejectedProducts, setRejectedProducts] = useState<RejectedProduct[]>([]);

  // === 1. AMBIL DATA EVENT DARI SMART CONTRACT ===
  // (Tidak berubah)
  const { data: allRequestsEvents, isLoading: isLoadingRequests } = useScaffoldEventHistory({
    contractName: "ICAS721",
    eventName: "MintRequested",
    fromBlock: 0n,
  });

  const { data: approvedEvents, isLoading: isLoadingApproved } = useScaffoldEventHistory({
    contractName: "ICAS721",
    eventName: "MintApproved",
    fromBlock: 0n,
  });

  const { data: rejectedEvents, isLoading: isLoadingRejected } = useScaffoldEventHistory({
    contractName: "ICAS721",
    eventName: "MintRejected",
    fromBlock: 0n,
  });

  const isLoading = isLoadingRequests || isLoadingApproved || isLoadingRejected;

  // === 2. PROSES EVENT DAN AMBIL DATA IPFS ===
  // (Tidak berubah, ini sudah menggunakan Promise.all yang cepat)
  useEffect(() => {
    const processEvents = async () => {
      if (!allRequestsEvents || !approvedEvents || !rejectedEvents) return;

      const approvedMap = new Map<string, any>();
      for (const event of approvedEvents) {
        const { requestId, tokenId, timestamp } = event.args as any;
        approvedMap.set(requestId.toString(), {
          tokenId: tokenId.toString(),
          timestamp: Number(timestamp) * 1000,
          txHash: event.transactionHash,
        });
      }

      const rejectedMap = new Map<string, any>();
      for (const event of rejectedEvents) {
        const { requestId, reason, timestamp } = event.args as any;
        rejectedMap.set(requestId.toString(), {
          reason: reason,
          timestamp: Number(timestamp) * 1000,
        });
      }

      const promises = allRequestsEvents.map(async event => {
        const { requestId, artisan, submittedBy, regionCode, ipfsHash, timestamp } = event.args as any;
        const reqIdString = requestId.toString();
        const metadata = await fetchFromIPFS(ipfsHash);
        if (!metadata) {
          console.warn(`Gagal fetch IPFS untuk request ${reqIdString}`);
          return null;
        }
        return {
          eventData: { reqIdString, artisan, submittedBy, regionCode, ipfsHash, timestamp },
          metadata: metadata,
        };
      });

      const results = await Promise.all(promises);

      const pendingList: Product[] = [];
      const approvedList: ApprovedProduct[] = [];
      const rejectedList: RejectedProduct[] = [];

      for (const result of results) {
        if (!result) continue;
        const { eventData, metadata } = result;
        const { reqIdString, artisan, submittedBy, regionCode, ipfsHash, timestamp } = eventData;

        if (approvedMap.has(reqIdString)) {
          const approvalData = approvedMap.get(reqIdString);
          approvedList.push({
            id: reqIdString,
            nama: metadata.name || "Tanpa Nama",
            pengrajin: artisan,
            approved: new Date(approvalData.timestamp).toISOString(),
            nftId: `ICAS-721-${approvalData.tokenId}`,
            txHash: approvalData.txHash,
          });
        } else if (rejectedMap.has(reqIdString)) {
          const rejectionData = rejectedMap.get(reqIdString);
          rejectedList.push({
            id: reqIdString,
            nama: metadata.name || "Tanpa Nama",
            pengrajin: artisan,
            rejected: new Date(rejectionData.timestamp).toISOString(),
            reason: rejectionData.reason,
          });
        } else {
          pendingList.push({
            id: reqIdString,
            nama: metadata.name || "Tanpa Nama",
            pengrajin: artisan,
            agen: submittedBy,
            tanggal: new Date(Number(timestamp) * 1000).toISOString(),
            region: regionCode,
            harga: parseInt(metadata.attributes?.find((a: any) => a.trait_type === "Estimated Price")?.value || "0"),
            photos: metadata.properties?.images?.length || 0,
            hasVideo: !!metadata.properties?.video,
            ipfsHash: ipfsHash,
          });
        }
      }

      setPendingProducts(pendingList);
      setApprovedProducts(approvedList);
      setRejectedProducts(rejectedList);
    };

    if (!isLoading) {
      processEvents();
    }
  }, [allRequestsEvents, approvedEvents, rejectedEvents, isLoading]);

  // === 3. LOGIKA BARU UNTUK APPROVE & REJECT ===

  // State untuk modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // State untuk loading per item
  const [isSubmittingId, setIsSubmittingId] = useState<string | null>(null);

  // Hook untuk Approve
  const { writeContractAsync: approveMintAsync, isPending: isApproving } = useScaffoldWriteContract("ICAS721");

  // Hook untuk Reject
  const { writeContractAsync: rejectMintAsync, isPending: isRejecting } = useScaffoldWriteContract("ICAS721");

  const isSubmitting = isApproving || isRejecting;

  // Handler untuk Quick Approve
  const handleQuickApprove = async (requestId: string) => {
    setIsSubmittingId(requestId); // Tampilkan loading di card
    try {
      notification.info("Mengirim transaksi approval...");
      await approveMintAsync({
        functionName: "approveMint",
        args: [requestId as `0x${string}`],
      });
      notification.success("Produk berhasil disetujui!");
      // Data akan refresh otomatis oleh hook useScaffoldEventHistory
    } catch (e) {
      console.error("Error approving:", e);
      notification.error("Gagal menyetujui produk.");
    } finally {
      setIsSubmittingId(null); // Sembunyikan loading
    }
  };

  // Handler untuk membuka modal reject
  const openRejectModal = (product: Product) => {
    setSelectedProduct(product);
    setRejectionReason("");
    (document.getElementById("reject_modal") as HTMLDialogElement)?.showModal();
  };

  // Handler untuk menutup modal
  const closeRejectModal = () => {
    setSelectedProduct(null);
    (document.getElementById("reject_modal") as HTMLDialogElement)?.close();
  };

  // Handler untuk submit reject dari modal
  const handleSubmitReject = async () => {
    if (!rejectionReason || !selectedProduct) {
      notification.error("Alasan penolakan tidak boleh kosong.");
      return;
    }

    setIsSubmittingId(selectedProduct.id); // Tampilkan loading di modal
    try {
      notification.info("Mengirim transaksi rejection...");
      await rejectMintAsync({
        functionName: "rejectMint",
        args: [selectedProduct.id as `0x${string}`, rejectionReason],
      });
      notification.success("Produk berhasil ditolak.");
      closeRejectModal();
    } catch (e) {
      console.error("Error rejecting:", e);
      notification.error("Gagal menolak produk.");
    } finally {
      setIsSubmittingId(null); // Sembunyikan loading
    }
  };

  return (
    <>
      <div
        className="flex items-center flex-col min-h-screen relative"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* ... (Overlay & Header tidak berubah) ... */}
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
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
            {/* ... (Isi Header) ... */}
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheckIcon className="h-12 w-12" style={{ color: "#E9A507" }} />
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
                  Portal Kurator
                </h1>
                <p className="text-white/80 text-lg">
                  Selamat datang, Ibu Wati! Verifikasi produk untuk memastikan kualitas dan keaslian.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold">Wallet Kurator:</p>
              <Address address={connectedAddress} />
              {!connectedAddress && (
                <p className="text-yellow-400 text-sm ml-auto">⚠️ Silakan connect wallet untuk approve produk</p>
              )}
            </div>
          </div>

          {/* ... (Stats & Tabs tidak berubah) ... */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Stat: Pending */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <ClockIcon className="h-10 w-10 mx-auto mb-3" style={{ color: "#E9A507" }} />
              <div className="text-white/60 mb-2">Menunggu Review</div>
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
                {isLoading ? <span className="loading loading-spinner"></span> : pendingProducts.length}
              </div>
              <div className="text-white/50 text-sm">Perlu diverifikasi</div>
            </div>

            {/* Stat: Approved */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <CheckCircleIcon className="h-10 w-10 mx-auto mb-3 text-green-400" />
              <div className="text-white/60 mb-2">Disetujui Bulan Ini</div>
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
                {isLoading ? <span className="loading loading-spinner"></span> : approvedProducts.length}
              </div>
              <div className="text-white/50 text-sm">NFT berhasil di-mint</div>
            </div>

            {/* Stat: Rejected */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <XCircleIcon className="h-10 w-10 mx-auto mb-3 text-red-400" />
              <div className="text-white/60 mb-2">Ditolak</div>
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
                {isLoading ? <span className="loading loading-spinner"></span> : rejectedProducts.length}
              </div>
              <div className="text-white/50 text-sm">Perlu perbaikan</div>
            </div>
          </div>

          {/* --- KONTEN DINAMIS (LOADING ATAU TABS) --- */}
          {isLoading ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
              <span className="loading loading-spinner loading-lg text-yellow-400"></span>
              <p className="text-white/70 mt-4 text-lg">Memuat data submission dari blockchain...</p>
            </div>
          ) : (
            <>
              {/* ... (Tabs tidak berubah) ... */}
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

              {/* Pending Tab */}
              {activeTab === "pending" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingProducts.length === 0 ? (
                    <div className="col-span-full bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
                      <CheckCircleIcon className="h-16 w-16 mx-auto mb-4" style={{ color: "#E9A507" }} />
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
                        Semua Produk Sudah Direview!
                      </h3>
                      <p className="text-white/70">Tidak ada produk yang menunggu verifikasi saat ini.</p>
                    </div>
                  ) : (
                    pendingProducts.map(product => (
                      <div
                        key={product.id}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col transition-all hover:bg-white/10"
                      >
                        <div className="flex-grow">
                          {/* ... (Header Card) ... */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="bg-yellow-500/20 px-3 py-1 rounded-full">
                              <ClockIcon className="h-4 w-4 inline-block" style={{ color: "#E9A507" }} />
                              <span className="text-yellow-400 text-sm ml-1 font-semibold">Pending</span>
                            </div>
                            <div className="bg-white/10 px-3 py-1 rounded-full text-white/70 text-xs truncate max-w-[100px]">
                              ID: #{product.id.substring(0, 6)}...
                            </div>
                          </div>

                          {/* ... (Nama Produk) ... */}
                          <h3
                            className="text-xl font-bold mb-3"
                            style={{
                              fontFamily: "'Aldo', sans-serif",
                              background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {product.nama}
                          </h3>

                          {/* ... (Region Badge) ... */}
                          <div className="mb-4">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold"
                              style={{
                                background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                                color: "#060606",
                              }}
                            >
                              {product.region}
                            </span>
                          </div>

                          {/* ... (Details) ... */}
                          <div className="space-y-2 mb-4">
                            <div>
                              <p className="text-white/60 text-sm">Pengrajin</p>
                              <Address address={product.pengrajin} size="sm" />
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">Agen</p>
                              <Address address={product.agen} size="sm" />
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">Harga Estimasi</p>
                              <p className="text-white font-semibold">Rp {product.harga.toLocaleString("id-ID")}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">Tanggal Submit</p>
                              <p className="text-white font-semibold">
                                {new Date(product.tanggal).toLocaleDateString("id-ID")}
                              </p>
                            </div>
                          </div>

                          {/* ... (Media Badges) ... */}
                          <div className="flex gap-2 mb-4">
                            <div className="bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 text-xs">
                              {product.photos} Foto
                            </div>
                            {product.hasVideo && (
                              <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-300 text-xs">
                                ✓ Video
                              </div>
                            )}
                          </div>
                        </div>

                        {/* --- ACTIONS (TOMBOL BARU) --- */}
                        <div className="space-y-2 mt-auto">
                          <Link
                            href={`/kurator/produk/${product.id}`} // <-- UBAH 'produk' ke 'review'
                            className="block w-full text-center px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                            style={{
                              background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                              color: "#060606",
                            }}
                          >
                            <EyeIcon className="h-4 w-4 inline-block mr-2" />
                            Review Detail
                          </Link>

                          {/* Tombol Quick Approve */}
                          <button
                            className="w-full px-4 py-2 rounded-lg font-semibold bg-white/5 text-white border border-green-400/50 hover:bg-green-500/20 transition-all disabled:opacity-50"
                            disabled={!connectedAddress || isSubmitting}
                            onClick={() => handleQuickApprove(product.id)}
                          >
                            {isSubmittingId === product.id && isApproving ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              <>
                                <CheckCircleIcon className="h-4 w-4 inline-block mr-2" />
                                Quick Approve
                              </>
                            )}
                          </button>

                          {/* Tombol Reject */}
                          <button
                            className="w-full px-4 py-2 rounded-lg font-semibold bg-white/5 text-white border border-red-400/50 hover:bg-red-500/20 transition-all disabled:opacity-50"
                            disabled={!connectedAddress || isSubmitting}
                            onClick={() => openRejectModal(product)}
                          >
                            {isSubmittingId === product.id && isRejecting ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              <>
                                <XCircleIcon className="h-4 w-4 inline-block mr-2" />
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ... (Approved & Rejected Tab tidak berubah) ... */}
              {/* Approved Tab */}
              {activeTab === "approved" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedProducts.length === 0 ? (
                    <p className="text-white/70 col-span-full text-center py-8">Belum ada produk yang disetujui.</p>
                  ) : (
                    approvedProducts.map(product => (
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
                            fontFamily: "'Aldo', sans-serif",
                            background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {product.nama}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div>
                            <p className="text-white/60 text-sm">Pengrajin</p>
                            <Address address={product.pengrajin} size="sm" />
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">NFT ID</p>
                            <p className="text-white font-semibold">{product.nftId}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Approved on</p>
                            <p className="text-white font-semibold">
                              {new Date(product.approved).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                        </div>

                        <a
                          href={`https://sepolia.etherscan.io/tx/${product.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                        >
                          View on Explorer ↗
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Rejected Tab */}
              {activeTab === "rejected" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rejectedProducts.length === 0 ? (
                    <p className="text-white/70 col-span-full text-center py-8">Tidak ada produk yang ditolak.</p>
                  ) : (
                    rejectedProducts.map(product => (
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
                            fontFamily: "'Aldo', sans-serif",
                            background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {product.nama}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div>
                            <p className="text-white/60 text-sm">Pengrajin</p>
                            <Address address={product.pengrajin} size="sm" />
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Rejected on</p>
                            <p className="text-white font-semibold">
                              {new Date(product.rejected).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                          <p className="text-red-400 font-semibold text-sm mb-1">Alasan Penolakan:</p>
                          <p className="text-white/80 text-sm">{product.reason}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* === 4. MODAL BARU UNTUK REJECT === */}
      <dialog id="reject_modal" className="modal">
        <div className="modal-box bg-gray-800 border border-white/20 text-white">
          <h3 className="font-bold text-lg text-yellow-400 flex items-center gap-2">
            <XCircleIcon className="h-6 w-6" />
            Tolak Produk
          </h3>
          <p className="py-4 text-white/80">
            Anda akan menolak produk: <br />
            <strong className="text-white">{selectedProduct?.nama}</strong>
          </p>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white/80 flex items-center gap-2">
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                Alasan Penolakan (Wajib)
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full bg-white/10 border-white/20 text-white h-24"
              placeholder="Contoh: Foto produk tidak jelas, cerita produk kurang lengkap..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={closeRejectModal}>
              Batal
            </button>
            <button className="btn btn-error" onClick={handleSubmitReject} disabled={isSubmitting || !rejectionReason}>
              {isSubmittingId === selectedProduct?.id ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Ya, Tolak Produk"
              )}
            </button>
          </div>
        </div>
        {/* Klik di luar untuk menutup */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeRejectModal}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default KuratorDashboard;
