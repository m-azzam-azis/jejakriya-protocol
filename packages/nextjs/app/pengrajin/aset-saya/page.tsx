"use client";

import React, { useState } from "react";
import Image from "next/image";

const mockAssets = [
  { id: "a1", name: "Tas Anyam", value: 0.5, image: "/logo.png" },
  { id: "a2", name: "Kain Tenun", value: 1.2, image: "/logo.png" },
  { id: "a3", name: "Keramik", value: 0.8, image: "/logo.png" },
];

export default function AsetSaya() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockAssets.find((a) => a.id === selectedId) || null;

  function calcLoan(valueEth: number, ltv = 0.5) {
    return valueEth * ltv;
  }

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
          <h1 className="text-3xl font-semibold text-white">Aset Saya & Kolateral</h1>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline border-white text-white hover:bg-white/10">Hubungkan Wallet Pribadi</button>
            <button className="btn btn-primary">Ajukan Pinjaman</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockAssets.map((a) => (
                <div 
                  key={a.id} 
                  className={`card bg-white/10 backdrop-blur-sm p-2 cursor-pointer transition-all hover:bg-white/20 ${selectedId === a.id ? "border-2 border-[#E9A507]" : ""}`} 
                  onClick={() => setSelectedId(a.id)}
                >
                  <Image src={a.image} alt={a.name} width={300} height={200} className="object-cover rounded" />
                  <div className="p-2">
                    <div className="font-semibold text-white">{a.name}</div>
                    <div className="text-sm text-white/70">{a.value} ETH</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="card bg-white/10 backdrop-blur-sm p-4 shadow">
              <h2 className="font-semibold mb-2 text-white">Kalkulator Pinjaman</h2>
              {selected ? (
                <>
                  <div className="mb-2 text-white">Aset: {selected.name}</div>
                  <div className="mb-2 text-white">Nilai: {selected.value} ETH</div>
                  <div className="mb-2 text-white">Perkiraan Pinjaman (LTV 50%): {calcLoan(selected.value, 0.5)} ETH</div>
                  <div className="mt-4">
                    <button className="btn btn-primary">Ajukan Pinjaman</button>
                  </div>
                </>
              ) : (
                <div className="text-white/70">Pilih aset untuk melihat estimasi pinjaman.</div>
              )}

              <div className="mt-4 text-sm text-white/70">Jika Anda mahir, Anda bisa menghubungkan wallet eksternal seperti MetaMask sebelum mengajukan.</div>
              <div className="mt-2">
                <button className="btn btn-outline border-white text-white hover:bg-white/10">Hubungkan Wallet Pribadi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
