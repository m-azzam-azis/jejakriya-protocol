"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useProductStore } from "~~/services/store/productStore";

// Mock pengrajin ID - in real app, get from auth/session
const CURRENT_PENGRAJIN_ID = "1"; // Ibu Lastri

export default function BerandaPengrajin() {
  const [showNew, setShowNew] = useState(false);
  const allProducts = useProductStore((state) => state.products);
  
  // Filter products for current pengrajin
  const products = allProducts.filter((p) => p.pengrajinId === CURRENT_PENGRAJIN_ID);
  const mintedNFTs = products.filter((p) => p.status === "minted");
  const pendingProducts = products.filter((p) => p.status === "pending");
  const approvedProducts = products.filter((p) => p.status === "approved");

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

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">Beranda Saya</h1>
          <button className="btn btn-primary btn-lg" onClick={() => setShowNew(true)}>
            Ajukan Produk Baru
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card bg-white/10 backdrop-blur-sm p-4 shadow">
            <div className="text-sm text-white/70">Total Produk</div>
            <div className="text-xl font-bold mt-2 text-white">{products.length}</div>
          </div>
          <div className="card bg-white/10 backdrop-blur-sm p-4 shadow">
            <div className="text-sm text-white/70">Menunggu Verifikasi</div>
            <div className="text-xl font-bold mt-2 text-white">{pendingProducts.length}</div>
          </div>
          <div className="card bg-white/10 backdrop-blur-sm p-4 shadow">
            <div className="text-sm text-white/70">Disetujui</div>
            <div className="text-xl font-bold mt-2 text-white">{approvedProducts.length}</div>
          </div>
          <div className="card bg-white/10 backdrop-blur-sm p-4 shadow">
            <div className="text-sm text-white/70">NFT Ter-mint</div>
            <div className="text-xl font-bold mt-2 text-white">{mintedNFTs.length}</div>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-3 text-white">NFT Saya (Ter-mint)</h2>
        {mintedNFTs.length === 0 ? (
          <div className="card bg-white/10 backdrop-blur-sm p-8 text-center mb-6">
            <p className="text-white/70">Belum ada NFT yang ter-mint. Ajukan produk baru untuk memulai!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {mintedNFTs.map((nft) => (
              <div key={nft.id} className="card bg-white/10 backdrop-blur-sm p-2 shadow">
                <Image src={nft.imageUrl} alt={nft.name} width={300} height={200} className="w-full object-cover rounded" />
                <div className="p-2">
                  <div className="font-semibold text-white text-sm">{nft.name}</div>
                  <div className="text-xs text-white/70">{nft.category}</div>
                  <div className="text-xs text-green-400 mt-1">✓ NFT Ter-mint</div>
                  <div className="text-xs text-white/50 mt-1">Token: {nft.nftTokenId?.slice(0, 8)}...</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pendingProducts.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-3 text-white">Menunggu Verifikasi</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {pendingProducts.map((product) => (
                <div key={product.id} className="card bg-white/10 backdrop-blur-sm p-2 shadow border-2 border-yellow-400">
                  <Image src={product.imageUrl} alt={product.name} width={300} height={200} className="w-full object-cover rounded" />
                  <div className="p-2">
                    <div className="font-semibold text-white text-sm">{product.name}</div>
                    <div className="text-xs text-white/70">{product.category}</div>
                    <div className="text-xs text-yellow-400 mt-1">⏳ Pending Review</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showNew && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-[#3D2C88] rounded-lg p-6 w-full max-w-xl border border-white/20">
              <h2 className="text-lg font-semibold mb-4 text-white">Ajukan Produk Baru</h2>
              <form className="grid grid-cols-1 gap-3">
                <input className="input input-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30" placeholder="Nama Produk" />
                <textarea className="textarea textarea-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30" placeholder="Cerita / Deskripsi" />
                <input type="file" className="file-input file-input-bordered bg-white/10 text-white border-white/30" />
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="btn btn-outline border-white text-white hover:bg-white/10" onClick={() => setShowNew(false)}>
                    Batal
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setShowNew(false)}>
                    Ajukan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
