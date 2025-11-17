"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  IdentificationIcon,
  PhotoIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const DemoKuratorDetail: NextPage = () => {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

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

  const handleReject = () => {
    if (!rejectionReason) {
      alert("Silakan isi alasan penolakan");
      return;
    }
    alert(`Demo: Produk ditolak dengan alasan: ${rejectionReason}`);
    router.push("/demo/kurator");
  };

  const goldGradientText = {
    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
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
        @import url("https://fonts.cdnfonts.com/css/aldo");
      `}</style>

      <div
        // PERUBAHAN DI SINI: Menambahkan pt-[120px]
        className="min-h-screen relative pt-[120px]" 
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

        <div className="relative z-10 text-white">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 py-6 px-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <button
                onClick={() => router.push("/demo/kurator")}
                className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1
                  className="text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    ...goldGradientText,
                  }}
                >
                  Review Detail Produk
                </h1>
                <p className="text-white/80">Verifikasi data produk kriya</p>
              </div>
            </div>
          </div>

          {/* Konten Utama */}
          <main className="w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kolom Kiri: Detail Data */}
            <div className="lg:col-span-2 space-y-6">
              {/* Box Detail Produk */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    ...goldGradientText,
                  }}
                >
                  <DocumentTextIcon className="h-6 w-6 mr-3" />
                  Detail Produk
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">Nama Produk</p>
                    <p className="font-semibold text-white text-lg">{product.name}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Harga Estimasi</p>
                      <p className="font-semibold text-white">Rp {product.price.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Bahan Baku</p>
                      <p className="font-semibold text-white">Kain Sutra Premium, Malam Berkualitas Tinggi</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Waktu Pembuatan</p>
                      <p className="font-semibold text-white">21-30 hari</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">Deskripsi Singkat</p>
                    <p className="font-semibold text-white">{product.description}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">Cerita Produk</p>
                    <p className="font-semibold text-white whitespace-pre-line">
                      Motif parang ini merupakan warisan budaya Keraton Yogyakarta yang telah diturunkan dari generasi ke generasi.
                      Setiap goresan dibuat dengan penuh ketelitian dan kesabaran oleh pengrajin berpengalaman lebih dari 20 tahun.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box Data Verifikasi */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    ...goldGradientText,
                  }}
                >
                  <IdentificationIcon className="h-6 w-6 mr-3" />
                  Data Verifikasi
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-2 flex items-center gap-2">
                      <UserCircleIcon className="h-5 w-5" /> Pengrajin
                    </p>
                    <p className="text-white font-semibold">{product.pengrajinName}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-2 flex items-center gap-2">
                      <UserCircleIcon className="h-5 w-5" /> Agen
                    </p>
                    <p className="text-white font-semibold">0xD940...6e37 (Demo)</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-2">
                      <GlobeAltIcon className="h-5 w-5" /> Kode Wilayah
                    </p>
                    <p className="font-semibold text-white">{product.region}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-2">
                      <CubeIcon className="h-5 w-5" /> Kategori
                    </p>
                    <p className="font-semibold text-white capitalize">{product.category}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5" /> Tanggal Submit
                    </p>
                    <p className="font-semibold text-white">{new Date().toLocaleDateString("id-ID")}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-2">
                      <ClockIcon className="h-5 w-5" /> Request ID
                    </p>
                    <p className="font-semibold text-white text-xs break-all">#{product.id}</p>
                  </div>
                </div>
              </div>

              {/* Box Media */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    ...goldGradientText,
                  }}
                >
                  <PhotoIcon className="h-6 w-6 mr-3" />
                  Media (Foto & Video)
                </h2>
                {/* Foto */}
                <p className="text-white/80 font-semibold mb-3">Foto Produk ({product.images?.length || 3})</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {(product.images || ["/parangrusak.png", "/parangrusak.png", "/parangrusak.png"]).map((img: string, index: number) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Foto produk ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-white/10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/keris.png";
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Tindakan */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    ...goldGradientText,
                  }}
                >
                  <ShieldCheckIcon className="h-6 w-6 mr-3" />
                  Tindakan Kurator
                </h2>

                <div className="space-y-4">
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="w-full px-6 py-4 rounded-lg font-bold text-lg bg-green-500 hover:bg-green-600 text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isApproving ? (
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                    ) : (
                      <CheckCircleIcon className="h-6 w-6 inline-block mr-2" />
                    )}
                    APPROVE & MINT NFT
                  </button>

                  <div className="divider text-white/70">ATAU</div>

                  <div>
                    <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                      Alasan Penolakan (Wajib jika menolak)
                    </label>
                    <textarea
                      name="rejectionReason"
                      placeholder="Contoh: Foto produk tidak jelas, cerita produk kurang lengkap..."
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 h-28"
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      disabled={isApproving}
                    />
                  </div>
                  <button
                    onClick={handleReject}
                    disabled={isApproving || !rejectionReason}
                    className="w-full px-6 py-3 rounded-lg font-bold text-lg bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <XCircleIcon className="h-6 w-6 inline-block mr-2" />
                    REJECT
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DemoKuratorDetail;