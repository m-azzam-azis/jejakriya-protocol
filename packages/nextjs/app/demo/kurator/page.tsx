"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import {
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  EyeIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const DemoKurator: NextPage = () => {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    // Load product from localStorage
    const storedProduct = localStorage.getItem("demoProduct");
    if (storedProduct) {
      setProduct(JSON.parse(storedProduct));
    }
  }, []);

  const handleApprove = async () => {
    setIsApproving(true);

    // Update status to approved
    const updatedProduct = {
      ...product,
      status: "approved",
      reviewedAt: new Date().toISOString(),
      reviewedBy: "Ibu Wati (Kurator)",
    };

    localStorage.setItem("demoProduct", JSON.stringify(updatedProduct));

    // Simulasi loading
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Pindah ke halaman profile/pembayaran
    router.push("/demo/profile");
  };

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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
        @import url("https://fonts.cdnfonts.com/css/mileast");
      `}</style>

      <div
        className="flex flex-col min-h-screen relative"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
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
            backgroundPosition: "top left",
            backgroundSize: "100% auto",
            zIndex: 0,
            opacity: 0.7,
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 pt-[150px]">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <ShieldCheckIcon className="h-16 w-16" style={{ color: "#E9A507" }} />
              <h1
                className="text-5xl md:text-6xl font-bold"
                style={{
                  fontFamily: "'Mileast', sans-serif",
                  ...goldGradientText,
                }}
              >
                Verifikasi Kurator
              </h1>
            </div>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Demo: Proses Verifikasi Produk Kriya
            </p>
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
                  ...goldGradientText,
                }}
              >
                1
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
                  ...goldGradientText,
                }}
              >
                0
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
                  ...goldGradientText,
                }}
              >
                0
              </div>
              <div className="text-white/50 text-sm">Perlu perbaikan</div>
            </div>
          </div>

          {/* Pending Tab */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold mb-4"
              style={{
                fontFamily: "'Mileast', sans-serif",
                ...goldGradientText,
              }}
            >
              Produk Pending (1)
            </h2>

            {/* Product Card - Same as original */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col transition-all hover:bg-white/10">
              <div className="flex-grow">
                {/* Header Card */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-yellow-500/20 px-3 py-1 rounded-full">
                    <ClockIcon className="h-4 w-4 inline-block" style={{ color: "#E9A507" }} />
                    <span className="text-yellow-400 text-sm ml-1 font-semibold">Pending</span>
                  </div>
                  <div className="bg-white/10 px-3 py-1 rounded-full text-white/70 text-xs truncate max-w-[100px]">
                    ID: #{product?.id?.substring(0, 6) || "demo01"}...
                  </div>
                </div>

                {/* Nama Produk */}
                <h3
                  className="text-xl font-bold mb-3"
                  style={{
                    fontFamily: "'Mileast', sans-serif",
                    ...goldGradientText,
                  }}
                >
                  {product?.name || "Batik Tulis Jogja Motif Parang"}
                </h3>

                {/* Region Badge */}
                <div className="mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                      color: "#060606",
                    }}
                  >
                    {product?.region || "YOGYAKARTA"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-white/60 text-sm">Pengrajin</p>
                    <p className="text-white font-semibold">{product?.pengrajinName || "Ibu Siti - Yogyakarta"}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Agen</p>
                    <p className="text-white font-semibold">0xD940...6e37 (Demo)</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Harga Estimasi</p>
                    <p className="text-white font-semibold">Rp {(product?.price || 1250000).toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Tanggal Submit</p>
                    <p className="text-white font-semibold">{new Date().toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              </div>

              {/* Actions (Tombol) */}
              <div className="space-y-2 mt-auto">
                <button
                  onClick={() => router.push(`/demo/kurator/produk/${product?.id || 'demo01'}`)}
                  className="block w-full text-center px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                  style={goldGradientButton}
                >
                  <EyeIcon className="h-4 w-4 inline-block mr-2" />
                  Lihat Detail Produk
                </button>

                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full px-4 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-all disabled:opacity-50"
                >
                  {isApproving ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 inline-block mr-2" />
                      Approved Mint
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              💡 Mode Demo: Klik "Setujui Produk" untuk melanjutkan ke tahap pembayaran
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoKurator;
