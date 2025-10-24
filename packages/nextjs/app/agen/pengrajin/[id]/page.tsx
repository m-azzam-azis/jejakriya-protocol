"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const mockPengrajin = {
  id: "1",
  name: "Ibu Lastri",
  location: "Banyuwangi",
  bio: "Pengrajin tenun tradisional dengan motif khas lokal.",
  products: [
    { id: "p1", name: "Kain Tenun Merah", verified: true, price: "0.1 ETH" },
    { id: "p2", name: "Selendang Anyam", verified: false, price: "0.05 ETH" },
  ],
};

export default function PengrajinDetail({ params }: { params: { id: string } }) {
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
        <div className="flex items-center gap-6 mb-6">
          <Image src="/logo.png" alt={mockPengrajin.name} width={96} height={96} className="rounded-full" />
          <div>
            <h1 className="text-2xl font-semibold text-white">{mockPengrajin.name}</h1>
            <div className="text-sm text-white/70">{mockPengrajin.location}</div>
            <div className="mt-2 text-white/90">{mockPengrajin.bio}</div>
          </div>
          <div className="ml-auto">
            <Link href="/agen/pengrajin/1/tambah-produk" className="btn btn-primary">
              Tambah Produk Baru
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="card bg-white/10 backdrop-blur-sm p-4 shadow mb-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Statistik Produk (placeholder)</h2>
              <div className="h-64 flex items-center justify-center bg-white/5 rounded">
                <span className="text-white/70">Grafik produk - nanti pakai chart</span>
              </div>
            </div>

            <div className="card bg-white/10 backdrop-blur-sm p-4 shadow">
              <h2 className="text-lg font-semibold mb-4 text-white">Produk</h2>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-white/70">Nama</th>
                    <th className="text-white/70">Terverifikasi</th>
                    <th className="text-white/70">Harga</th>
                    <th className="text-white/70">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPengrajin.products.map((prod) => (
                    <tr key={prod.id}>
                      <td className="text-white">{prod.name}</td>
                      <td className="text-white">{prod.verified ? "Ya" : "Belum"}</td>
                      <td className="text-white">{prod.price}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm text-white hover:bg-white/10">Lihat</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="card bg-white/10 backdrop-blur-sm p-4 shadow">
              <h3 className="font-semibold mb-2 text-white">Detail Kontak</h3>
              <div className="text-white/90">WhatsApp: 0812-xxxx-xxxx</div>
              <div className="text-white/90">Email: ibu.lastri@example.com</div>

              <div className="mt-4">
                <h4 className="font-semibold text-white">Status Verifikasi</h4>
                <div className="badge badge-success mt-2">Terverifikasi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
