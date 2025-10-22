"use client";

import React, { useState } from "react";
import Image from "next/image";

const mockPengrajin = [
  { id: "1", name: "Ibu Lastri", location: "Banyuwangi", products: 12, status: "Terverifikasi", avatar: "/logo.png" },
  { id: "2", name: "Budi", location: "Yogyakarta", products: 5, status: "Pending", avatar: "/logo.png" },
  { id: "3", name: "Siti", location: "Bali", products: 23, status: "Terverifikasi", avatar: "/logo.png" },
];

export default function PengrajinList() {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = mockPengrajin.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase())
  );

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
          <h1 className="text-2xl font-semibold text-white">Daftar Pengrajin</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari nama atau lokasi"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input input-bordered bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 border-white/30"
            />
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Tambah Pengrajin Baru
            </button>
          </div>
        </div>

        <div className="card bg-white/10 backdrop-blur-sm p-4 shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-white/70"></th>
                <th className="text-white/70">Nama</th>
                <th className="text-white/70">Lokasi</th>
                <th className="text-white/70">Produk</th>
                <th className="text-white/70">Status</th>
                <th className="text-white/70">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Image src={p.avatar} alt={p.name} width={48} height={48} className="rounded-full" />
                  </td>
                  <td className="text-white">{p.name}</td>
                  <td className="text-white/70">{p.location}</td>
                  <td className="text-white">{p.products}</td>
                  <td>
                    <span className={`badge ${p.status === "Terverifikasi" ? "badge-success" : "badge-warning"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <a className="btn btn-ghost btn-sm text-white hover:bg-white/10" href={`/agen/pengrajin/${p.id}`}>
                      Lihat
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-[#3D2C88] rounded-lg p-6 w-full max-w-lg border border-white/20">
              <h2 className="text-lg font-semibold mb-4 text-white">Tambah Pengrajin Baru</h2>
              <form className="grid grid-cols-1 gap-3">
                <input className="input input-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30" placeholder="Nama" />
                <input className="input input-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30" placeholder="Lokasi" />
                <textarea className="textarea textarea-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30" placeholder="Bio singkat" />
                <input className="input input-bordered bg-white/10 text-white placeholder:text-white/50 border-white/30" placeholder="Kontak (Whatsapp / Email)" />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button type="button" className="btn btn-outline border-white text-white hover:bg-white/10" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>
                    Simpan
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
