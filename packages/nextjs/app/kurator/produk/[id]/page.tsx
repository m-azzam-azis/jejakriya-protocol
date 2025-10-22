"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProductStore } from "~~/services/store/productStore";

interface Props {
  params: { id: string };
}

export default function KuratorProductDetail({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const products = useProductStore((s) => s.products);
  const approveProduct = useProductStore((s) => s.approveProduct);
  const rejectProduct = useProductStore((s) => s.rejectProduct);

  const product = products.find((p) => p.id === id);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Produk tidak ditemukan</div>
      </div>
    );
  }

  const handleApprove = () => {
    if (confirm("Setujui produk ini? NFT akan otomatis di-mint.")) {
      approveProduct(product.id, "Kurator Demo");
      router.back();
    }
  };

  const handleReject = () => {
    if (reason.trim()) {
      rejectProduct(product.id, "Kurator Demo", reason.trim());
      setShowRejectModal(false);
      router.back();
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "url('/Overlay.png')", backgroundRepeat: "repeat-y", backgroundSize: "100% auto", opacity: 0.7 }} />
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="card bg-white/10 backdrop-blur-sm p-6">
          <div className="flex gap-6">
            <div className="w-48 h-48 flex-shrink-0">
              <Image src={product.imageUrl || "/logo.png"} alt={product.name} width={192} height={192} className="rounded-lg object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-white/90 mb-2">Pengrajin: {product.pengrajinName}</p>
              <p className="text-white/90 mb-2">Diajukan oleh: {product.submittedBy}</p>
              <p className="text-white/90 mb-2">Kategori: {product.category}</p>
              <p className="text-white/90 mb-4">Deskripsi: {product.description}</p>

              <div className="flex gap-3 mt-4">
                <button className="btn btn-success" onClick={handleApprove}>Setujui & Mint NFT</button>
                <button className="btn btn-error" onClick={() => setShowRejectModal(true)}>Tolak</button>
                <button className="btn btn-outline ml-auto" onClick={() => router.back()}>Kembali</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#3D2C88] rounded-lg p-6 w-full max-w-lg border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-white">Alasan Penolakan</h2>
            <textarea className="textarea textarea-bordered w-full bg-white/10 text-white placeholder:text-white/50 border-white/30" rows={4} value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className="flex gap-3 mt-4">
              <button className="btn btn-outline border-white text-white" onClick={() => setShowRejectModal(false)}>Batal</button>
              <button className="btn btn-error flex-1" onClick={handleReject} disabled={!reason.trim()}>Konfirmasi Penolakan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
