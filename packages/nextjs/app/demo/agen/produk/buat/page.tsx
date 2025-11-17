"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import {
  ArrowLeftIcon,
  CheckIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

const DemoBuatProduk: NextPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hardcoded form data
  const formData = {
    pengrajinId: "3",
    namaProduk: "Batik Tulis Jogja Motif Parang",
    jenisProduk: "batik",
    deskripsi:
      "Batik tulis premium dengan motif Parang Rusak yang dibuat secara tradisional menggunakan teknik canting.",
    bahanBaku: "Kain Mori, Pewarna Alami, Malam",
    waktuPembuatan: "3 bulan",
    hargaEstimasi: "12121212",
    regionCode: "YOGYAKARTA",
    ceritaProduk:
      "Batik tulis premium dengan motif Parang Rusak. Proses pembuatan 3 bulan dengan teknik canting tradisional. Motif Parang memiliki makna filosofis tentang kekuatan dan keteguhan hati.",
  };

  // Hardcoded preview images
  const previewUrls = {
    photos: ["/parangrusak.png", "/parangrusak.png", "/parangrusak.png"],
    video: null,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simpan data ke localStorage untuk demo
    const demoProduct = {
      id: "demo-001",
      name: formData.namaProduk,
      description: formData.ceritaProduk,
      price: parseInt(formData.hargaEstimasi),
      region: formData.regionCode,
      pengrajinName: "Ibu Siti Rahma",
      pengrajinId: formData.pengrajinId,
      category: formData.jenisProduk,
      images: ["/parangrusak.png"],
      status: "pending",
      submittedAt: new Date().toISOString(),
      bahanBaku: formData.bahanBaku,
      waktuPembuatan: formData.waktuPembuatan,
      deskripsi: formData.deskripsi,
    };

    localStorage.setItem("demoProduct", JSON.stringify(demoProduct));

    // Simulasi loading
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Pindah ke halaman kurator
    router.push("/demo/kurator");
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

  return (
    <div>
      <div
        className="min-h-screen relative pt-[150px]"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-full"
          style={{
            backgroundImage: "url('/Overlay.png')",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top left",
            backgroundSize: "100% auto",
            zIndex: 0,
            opacity: 0.7,
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 py-6 px-4">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <button
                onClick={() => router.push("/demo/agen/produk/buat")}
                className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1
                  className="text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background:
                      "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Tambah Produk Baru (Demo)
                </h1>
                <p className="text-white/80">Dokumentasikan karya pengrajin - Mode Demo</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              {[
                { num: 1, label: "Data Produk" },
                { num: 2, label: "Media" },
                { num: 3, label: "Review" },
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${
                        step >= s.num ? "border-transparent text-black" : "border-white/30 text-white/50"
                      }`}
                      style={
                        step >= s.num
                          ? {
                              background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)",
                            }
                          : {}
                      }
                    >
                      {step > s.num ? <CheckIcon className="h-6 w-6" /> : s.num}
                    </div>
                    <span className={`mt-2 text-sm font-semibold ${step >= s.num ? "text-white" : "text-white/50"}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${step > s.num ? "bg-gradient-to-r from-yellow-600 to-yellow-400" : "bg-white/20"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
            >
              {/* Demo Info Banner */}
              <div className="mb-6 bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 flex items-start gap-3">
                <DocumentTextIcon className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/90 font-semibold mb-1">Mode Demo - Data Sudah Diisi Otomatis</p>
                  <p className="text-white/70 text-sm">
                    Semua form sudah terisi dengan data contoh. Klik tombol untuk melanjutkan ke tahap berikutnya.
                  </p>
                </div>
              </div>

              {/* Step 1: Data Produk */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Informasi Produk
                  </h2>

                  <div>
                    <label className="block text-white font-semibold mb-2">Pilih Pengrajin</label>
                    <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white">
                      Ibu Siti - Yogyakarta
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Nama Produk</label>
                    <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white">
                      {formData.namaProduk}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Jenis Produk</label>
                      <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white capitalize">
                        {formData.jenisProduk}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Kode Wilayah</label>
                      <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white">
                        {formData.regionCode}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Deskripsi Singkat</label>
                    <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white">
                      {formData.deskripsi}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Bahan Baku Utama</label>
                      <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white">
                        {formData.bahanBaku}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Waktu Pembuatan</label>
                      <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white">
                        {formData.waktuPembuatan}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Harga Estimasi (Rp)</label>
                    <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-bold">
                      Rp {parseInt(formData.hargaEstimasi).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Cerita di Balik Produk</label>
                    <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white min-h-[120px]">
                      {formData.ceritaProduk}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-8">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                      style={goldGradientButton}
                      onClick={() => setStep(2)}
                    >
                      Lanjut ke Upload Media
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Media Upload */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Upload Foto & Video
                  </h2>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Foto Produk (3 foto)</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center bg-white/5">
                      <PhotoIcon className="h-16 w-16 mx-auto text-white/50 mb-4" />
                      <p className="text-lg font-semibold text-white">Foto sudah diupload</p>
                      <p className="text-sm text-white/70">Mode Demo - 3 foto produk batik</p>
                    </div>

                    {/* Photo Previews */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {previewUrls.photos.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/keris.png";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Video Proses Pembuatan (Opsional)</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center bg-white/5">
                      <VideoCameraIcon className="h-16 w-16 mx-auto text-white/50 mb-4" />
                      <p className="text-lg font-semibold text-white">Tidak ada video</p>
                      <p className="text-sm text-white/70">Mode Demo - Video opsional</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-between mt-8">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10"
                      onClick={() => setStep(1)}
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                      style={goldGradientButton}
                      onClick={() => setStep(3)}
                    >
                      Review Data
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Review Data Produk
                  </h2>

                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 flex items-start gap-3">
                    <DocumentTextIcon className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">Pastikan semua data sudah benar sebelum mengirim untuk kurasi</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Nama Produk</p>
                        <p className="font-semibold text-white">{formData.namaProduk}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Jenis Produk</p>
                        <p className="font-semibold text-white capitalize">{formData.jenisProduk}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Bahan Baku</p>
                        <p className="font-semibold text-white">{formData.bahanBaku}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Waktu Pembuatan</p>
                        <p className="font-semibold text-white">{formData.waktuPembuatan}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Harga Estimasi</p>
                        <p className="font-semibold text-white">
                          Rp {parseInt(formData.hargaEstimasi).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Kode Wilayah</p>
                        <p className="font-semibold text-white">{formData.regionCode}</p>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Deskripsi</p>
                      <p className="font-semibold text-white">{formData.deskripsi}</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Cerita Produk</p>
                      <p className="font-semibold text-white">{formData.ceritaProduk}</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-3">Foto ({previewUrls.photos.length})</p>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {previewUrls.photos.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/keris.png";
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-between mt-8">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10"
                      onClick={() => setStep(2)}
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm mr-2"></span>
                          Mengirim ke Kurator...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-5 w-5 inline-block mr-2" />
                          Ajukan untuk Kurasi
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBuatProduk;
