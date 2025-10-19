"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const AgenDashboard: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"pengrajin" | "produk">("pengrajin");

  // Mock data - nanti diganti dengan data real dari backend
  const pengrajinList = [
    { id: 1, nama: "Ibu Lastri", desa: "Sumba Timur", jumlahProduk: 5, status: "aktif" },
    { id: 2, nama: "Pak Wayan", desa: "Ubud, Bali", jumlahProduk: 3, status: "aktif" },
    { id: 3, nama: "Ibu Siti", desa: "Yogyakarta", jumlahProduk: 8, status: "aktif" },
  ];

  const produkList = [
    { id: 1, nama: "Kain Tenun Sumba", pengrajin: "Ibu Lastri", status: "terverifikasi", tanggal: "2025-10-15" },
    { id: 2, nama: "Tas Anyaman Rotan", pengrajin: "Pak Wayan", status: "menunggu_kurasi", tanggal: "2025-10-14" },
    { id: 3, nama: "Batik Tulis Jogja", pengrajin: "Ibu Siti", status: "draf", tanggal: "2025-10-13" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "terverifikasi":
        return (
          <div className="badge badge-success gap-2">
            <CheckCircleIcon className="h-4 w-4" />
            Terverifikasi
          </div>
        );
      case "menunggu_kurasi":
        return (
          <div className="badge badge-warning gap-2">
            <ClockIcon className="h-4 w-4" />
            Menunggu Kurasi
          </div>
        );
      case "draf":
        return (
          <div className="badge badge-info gap-2">
            <DocumentTextIcon className="h-4 w-4" />
            Draf
          </div>
        );
      default:
        return <div className="badge badge-ghost">{status}</div>;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-base-200">
        {/* Header */}
        <div className="bg-primary text-primary-content py-6 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Portal Agen Digital</h1>
            <p className="text-primary-content/80">Selamat datang, Doni! Kelola pengrajin dan produk dari sini.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              href="/agen/pengrajin/baru"
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            >
              <div className="card-body flex-row items-center gap-4">
                <UserGroupIcon className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="card-title">Tambah Pengrajin Baru</h3>
                  <p className="text-sm text-base-content/70">Daftarkan pengrajin baru ke sistem</p>
                </div>
              </div>
            </Link>

            <Link
              href="/agen/produk/baru"
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            >
              <div className="card-body flex-row items-center gap-4">
                <PlusCircleIcon className="h-12 w-12 text-secondary" />
                <div>
                  <h3 className="card-title">Tambah Produk Baru</h3>
                  <p className="text-sm text-base-content/70">Dokumentasikan karya pengrajin</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="stats stats-vertical md:stats-horizontal shadow w-full mb-8">
            <div className="stat">
              <div className="stat-figure text-primary">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <div className="stat-title">Total Pengrajin</div>
              <div className="stat-value text-primary">{pengrajinList.length}</div>
              <div className="stat-desc">Yang Anda kelola</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <DocumentTextIcon className="h-8 w-8" />
              </div>
              <div className="stat-title">Produk Terdaftar</div>
              <div className="stat-value text-secondary">{produkList.length}</div>
              <div className="stat-desc">Total produk</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-success">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
              <div className="stat-title">Terverifikasi</div>
              <div className="stat-value text-success">
                {produkList.filter(p => p.status === "terverifikasi").length}
              </div>
              <div className="stat-desc">Sudah di-mint</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs tabs-boxed mb-4">
            <a
              className={`tab ${activeTab === "pengrajin" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("pengrajin")}
            >
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Daftar Pengrajin
            </a>
            <a className={`tab ${activeTab === "produk" ? "tab-active" : ""}`} onClick={() => setActiveTab("produk")}>
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Daftar Produk
            </a>
          </div>

          {/* Content */}
          <div className="bg-base-100 rounded-lg shadow-xl p-6">
            {activeTab === "pengrajin" && (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Pengrajin</th>
                      <th>Desa/Kota</th>
                      <th>Jumlah Produk</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengrajinList.map((pengrajin, index) => (
                      <tr key={pengrajin.id}>
                        <td>{index + 1}</td>
                        <td className="font-semibold">{pengrajin.nama}</td>
                        <td>{pengrajin.desa}</td>
                        <td>{pengrajin.jumlahProduk}</td>
                        <td>
                          <div className="badge badge-success">{pengrajin.status}</div>
                        </td>
                        <td>
                          <Link href={`/agen/pengrajin/${pengrajin.id}`} className="btn btn-sm btn-ghost">
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "produk" && (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Produk</th>
                      <th>Pengrajin</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produkList.map((produk, index) => (
                      <tr key={produk.id}>
                        <td>{index + 1}</td>
                        <td className="font-semibold">{produk.nama}</td>
                        <td>{produk.pengrajin}</td>
                        <td>{new Date(produk.tanggal).toLocaleDateString("id-ID")}</td>
                        <td>{getStatusBadge(produk.status)}</td>
                        <td>
                          <Link href={`/agen/produk/${produk.id}`} className="btn btn-sm btn-ghost">
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AgenDashboard;
