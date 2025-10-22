"use client";

import React, { useState } from "react";
import { useProductStore, Product } from "~~/services/store/productStore";
import Image from "next/image";

export default function KuratorReviewPage() {
  const products = useProductStore((state) => state.products);
  const approveProduct = useProductStore((state) => state.approveProduct);
  const rejectProduct = useProductStore((state) => state.rejectProduct);
  
  const pendingProducts = products.filter((p) => p.status === "pending");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (productId: string) => {
    if (confirm("Apakah Anda yakin ingin menyetujui produk ini? NFT akan otomatis di-mint.")) {
      approveProduct(productId, "Kurator Demo"); // In real app, get from auth
      setSelectedProduct(null);
    }
  };

  const handleReject = () => {
    if (selectedProduct && rejectionReason.trim()) {
      rejectProduct(selectedProduct.id, "Kurator Demo", rejectionReason);
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedProduct(null);
    }
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/Overlay.png')",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
          zIndex: 0,
          opacity: 0.7,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-white">Review Produk Pending</h1>
          <div className="badge badge-warning badge-lg">{pendingProducts.length} menunggu</div>
        </div>

        {pendingProducts.length === 0 ? (
          <div className="card bg-white/10 backdrop-blur-sm p-12 text-center">
            <p className="text-xl text-white/70">Tidak ada produk yang menunggu review</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingProducts.map((product) => (
              <div key={product.id} className="card bg-white/10 backdrop-blur-sm p-6 shadow-lg">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-48 h-48 flex-shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                    <div className="space-y-2 text-white/90">
                      <p>
                        <span className="font-semibold">Pengrajin:</span> {product.pengrajinName}
                      </p>
                      <p>
                        <span className="font-semibold">Kategori:</span> {product.category}
                      </p>
                      <p>
                        <span className="font-semibold">Diajukan oleh:</span> {product.submittedBy}
                      </p>
                      <p>
                        <span className="font-semibold">Tanggal:</span>{" "}
                        {new Date(product.submittedAt).toLocaleDateString("id-ID")}
                      </p>
                      <div className="mt-4">
                        <p className="font-semibold mb-1">Deskripsi:</p>
                        <p className="text-white/80">{product.description}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(product.id)}
                      >
                        ✓ Setujui & Mint NFT
                      </button>
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowRejectModal(true);
                        }}
                      >
                        ✗ Tolak
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#3D2C88] rounded-lg p-6 w-full max-w-lg border border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-white">Alasan Penolakan</h2>
              <p className="text-white/90 mb-4">Produk: {selectedProduct.name}</p>
              <textarea
                className="textarea textarea-bordered w-full bg-white/10 text-white placeholder:text-white/50 border-white/30"
                placeholder="Jelaskan alasan penolakan..."
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex gap-3 mt-4">
                <button
                  className="btn btn-outline border-white text-white hover:bg-white/10"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedProduct(null);
                  }}
                >
                  Batal
                </button>
                <button
                  className="btn btn-error flex-1"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  Konfirmasi Penolakan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
