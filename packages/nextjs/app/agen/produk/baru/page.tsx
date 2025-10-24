"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { ArrowLeftIcon, CheckIcon, DocumentTextIcon, PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { useProductStore } from "~~/services/store/productStore";

const TambahProdukBaru: NextPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    pengrajinId: "",
    namaProduk: "",
    jenisProduk: "",
    deskripsi: "",
    bahanBaku: "",
    waktuPembuatan: "",
    hargaEstimasi: "",
    regionCode: "",
    ceritaProduk: "",
  });

  const [mediaFiles, setMediaFiles] = useState<{
    photos: File[];
    video: File | null;
  }>({
    photos: [],
    video: null,
  });

  const [previewUrls, setPreviewUrls] = useState<{
    photos: string[];
    video: string | null;
  }>({
    photos: [],
    video: null,
  });

  // Mock pengrajin list (UI uses these ids in the select)
  const mockPengrajin = [
    { id: "1", name: "Ibu Lastri", location: "Sumba Timur" },
    { id: "2", name: "Pak Wayan", location: "Ubud, Bali" },
    { id: "3", name: "Ibu Siti", location: "Yogyakarta" },
  ];

  const addProduct = useProductStore((s) => s.addProduct);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(prev => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => ({
      ...prev,
      photos: [...prev.photos, ...urls],
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFiles(prev => ({
        ...prev,
        video: file,
      }));
      setPreviewUrls(prev => ({
        ...prev,
        video: URL.createObjectURL(file),
      }));
    }
  };

  const removePhoto = (index: number) => {
    setMediaFiles(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPreviewUrls(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Find pengrajin info from mock list
    const pengrajin = mockPengrajin.find((p) => p.id === formData.pengrajinId);
    if (!pengrajin) {
      alert("Pilih pengrajin terlebih dahulu");
      return;
    }

    // Map form data to store shape
    addProduct({
      pengrajinId: formData.pengrajinId,
      pengrajinName: pengrajin.name,
      name: formData.namaProduk || "(Tanpa Nama)",
      description: formData.deskripsi || formData.ceritaProduk || "",
      category: formData.jenisProduk || "Lainnya",
      imageUrl: previewUrls.photos[0] || "/logo.png",
      submittedBy: "Agen Demo",
    });

    // Feedback and redirect to Agen dashboard
    alert("Produk berhasil diajukan! Menunggu verifikasi kurator.");
    router.push("/agen/dashboard");
  };

  const handleSaveDraft = () => {
    console.log("Saving draft...", formData);
    alert("Draf berhasil disimpan!");
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
        @import url("https://fonts.cdnfonts.com/css/aldo");
      `}</style>

      <div
        className="min-h-screen relative"
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
                onClick={() => router.back()}
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
                  Tambah Produk Baru
                </h1>
                <p className="text-white/80">Dokumentasikan karya pengrajin</p>
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
                    <select
                      name="pengrajinId"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                      value={formData.pengrajinId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" className="bg-gray-800">
                        -- Pilih Pengrajin --
                      </option>
                      <option value="1" className="bg-gray-800">
                        Ibu Lastri - Sumba Timur
                      </option>
                      <option value="2" className="bg-gray-800">
                        Pak Wayan - Ubud, Bali
                      </option>
                      <option value="3" className="bg-gray-800">
                        Ibu Siti - Yogyakarta
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Nama Produk</label>
                    <input
                      type="text"
                      name="namaProduk"
                      placeholder="Contoh: Kain Tenun Sumba Motif Mamuli"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      value={formData.namaProduk}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Jenis Produk</label>
                      <select
                        name="jenisProduk"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                        value={formData.jenisProduk}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" className="bg-gray-800">
                          -- Pilih Jenis --
                        </option>
                        <option value="tenun" className="bg-gray-800">
                          Kain Tenun
                        </option>
                        <option value="batik" className="bg-gray-800">
                          Batik
                        </option>
                        <option value="anyaman" className="bg-gray-800">
                          Anyaman
                        </option>
                        <option value="ukir" className="bg-gray-800">
                          Ukiran
                        </option>
                        <option value="keramik" className="bg-gray-800">
                          Keramik
                        </option>
                        <option value="lainnya" className="bg-gray-800">
                          Lainnya
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Kode Wilayah</label>
                      <input
                        type="text"
                        name="regionCode"
                        placeholder="Contoh: SUMBA-TIMUR"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                        value={formData.regionCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Deskripsi Singkat</label>
                    <textarea
                      name="deskripsi"
                      placeholder="Deskripsikan produk ini..."
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 h-24"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Bahan Baku Utama</label>
                      <input
                        type="text"
                        name="bahanBaku"
                        placeholder="Contoh: Kapas lokal, pewarna alami"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                        value={formData.bahanBaku}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Waktu Pembuatan</label>
                      <input
                        type="text"
                        name="waktuPembuatan"
                        placeholder="Contoh: 2 minggu"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                        value={formData.waktuPembuatan}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Harga Estimasi (Rp)</label>
                    <input
                      type="number"
                      name="hargaEstimasi"
                      placeholder="500000"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      value={formData.hargaEstimasi}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Cerita di Balik Produk</label>
                    <textarea
                      name="ceritaProduk"
                      placeholder="Ceritakan tentang proses pembuatan, makna motif, atau cerita unik lainnya..."
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 h-32"
                      value={formData.ceritaProduk}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex gap-3 justify-end mt-8">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10"
                      onClick={handleSaveDraft}
                    >
                      Simpan Draf
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                        color: "#060606",
                      }}
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
                    <label className="block text-white font-semibold mb-2">Foto Produk (Minimal 3)</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-yellow-500/50 transition-all cursor-pointer bg-white/5">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <PhotoIcon className="h-16 w-16 mx-auto text-white/50 mb-4" />
                        <p className="text-lg font-semibold text-white">Klik untuk upload foto</p>
                        <p className="text-sm text-white/70">atau drag & drop foto di sini</p>
                      </label>
                    </div>

                    {/* Photo Previews */}
                    {previewUrls.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {previewUrls.photos.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Video Proses Pembuatan (Opsional)</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-yellow-500/50 transition-all cursor-pointer bg-white/5">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <VideoCameraIcon className="h-16 w-16 mx-auto text-white/50 mb-4" />
                        <p className="text-lg font-semibold text-white">Klik untuk upload video</p>
                        <p className="text-sm text-white/70">Format MP4, maksimal 100MB</p>
                      </label>
                    </div>

                    {/* Video Preview */}
                    {previewUrls.video && (
                      <div className="mt-4">
                        <video src={previewUrls.video} controls className="w-full max-h-96 rounded-lg" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 justify-between mt-8">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10"
                      onClick={() => setStep(1)}
                    >
                      Kembali
                    </button>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="px-6 py-3 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10"
                        onClick={handleSaveDraft}
                      >
                        Simpan Draf
                      </button>
                      <button
                        type="button"
                        className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                          color: "#060606",
                        }}
                        onClick={() => setStep(3)}
                        disabled={previewUrls.photos.length < 3}
                      >
                        Review Data
                      </button>
                    </div>
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
                        <p className="font-semibold text-white">{formData.jenisProduk}</p>
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
                          Rp {parseInt(formData.hargaEstimasi || "0").toLocaleString("id-ID")}
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
                          />
                        ))}
                      </div>
                    </div>

                    {previewUrls.video && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-white/60 mb-3">Video</p>
                        <video src={previewUrls.video} controls className="w-full max-h-64 rounded" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 justify-between mt-8">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10"
                      onClick={() => setStep(2)}
                    >
                      Kembali
                    </button>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="px-6 py-3 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10"
                        onClick={handleSaveDraft}
                      >
                        Simpan Draf
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-all hover:scale-105"
                      >
                        <CheckIcon className="h-5 w-5 inline-block mr-2" />
                        Ajukan untuk Kurasi
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TambahProdukBaru;
