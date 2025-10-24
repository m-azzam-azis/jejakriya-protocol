"use client";

import React, { useState } from "react";

const mockCatalog = [
  { id: "c1", name: "Batik Motif A", description: "Motif klasik", example: "/logo.png" },
  { id: "c2", name: "Tenun Motif B", description: "Motif lokal", example: "/logo.png" },
];

export default function KatalogPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

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
          <h1 className="text-2xl font-semibold text-white">Katalog</h1>
          <div />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCatalog.map((c) => (
            <div key={c.id} className="card bg-white/10 backdrop-blur-sm p-4 shadow">
              <div className="flex items-center gap-4">
                <img src={c.example} alt={c.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="text-sm text-white/70">{c.description}</div>
                  <div className="mt-3">
                    <button
                      className="btn btn-outline btn-sm border-white text-white hover:bg-white/10"
                      onClick={() => {
                        setSelected(c.id);
                        setShowAdd(true);
                      }}
                    >
                      Tambah Produksi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-[#3D2C88] rounded-lg p-6 w-full max-w-lg border border-white/20">
              <h2 className="text-lg font-semibold mb-4 text-white">Tambah Produksi untuk katalog</h2>
              <form className="grid grid-cols-1 gap-3">
                <input className="input input-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30" placeholder="Nomor Seri (optional)" />
                <input type="file" className="file-input file-input-bordered bg-white/10 text-white border-white/30" />
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="btn btn-outline border-white text-white hover:bg-white/10" onClick={() => setShowAdd(false)}>
                    Batal
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setShowAdd(false)}>
                    Tambah
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
