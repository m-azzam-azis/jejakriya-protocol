"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { ArrowLeftIcon, CheckIcon, DocumentTextIcon, PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline";

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

    // Create preview URLs
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

    // TODO: Implement actual submission logic
    // 1. Upload media to IPFS
    // 2. Create draft in backend
    // 3. Show success message

    console.log("Form Data:", formData);
    console.log("Media Files:", mediaFiles);

    alert("Produk berhasil disimpan sebagai draf!");
    router.push("/agen");
  };

  const handleSaveDraft = () => {
    // Save as draft without validation
    console.log("Saving draft...", formData);
    alert("Draf berhasil disimpan!");
  };

  return (
    <div className="min-h-screen bg-base-200 pb-10">
      {/* Header */}
      <div className="bg-primary text-primary-content py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="btn btn-ghost btn-circle">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
            <p className="text-primary-content/80">Dokumentasikan karya pengrajin</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ul className="steps steps-horizontal w-full">
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Data Produk</li>
          <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Media</li>
          <li className={`step ${step >= 3 ? "step-primary" : ""}`}>Review</li>
        </ul>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Step 1: Data Produk */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Informasi Produk</h2>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Pilih Pengrajin</span>
                  </label>
                  <select
                    name="pengrajinId"
                    className="select select-bordered w-full"
                    value={formData.pengrajinId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Pilih Pengrajin --</option>
                    <option value="1">Ibu Lastri - Sumba Timur</option>
                    <option value="2">Pak Wayan - Ubud, Bali</option>
                    <option value="3">Ibu Siti - Yogyakarta</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Nama Produk</span>
                  </label>
                  <input
                    type="text"
                    name="namaProduk"
                    placeholder="Contoh: Kain Tenun Sumba Motif Mamuli"
                    className="input input-bordered w-full"
                    value={formData.namaProduk}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Jenis Produk</span>
                    </label>
                    <select
                      name="jenisProduk"
                      className="select select-bordered w-full"
                      value={formData.jenisProduk}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Jenis --</option>
                      <option value="tenun">Kain Tenun</option>
                      <option value="batik">Batik</option>
                      <option value="anyaman">Anyaman</option>
                      <option value="ukir">Ukiran</option>
                      <option value="keramik">Keramik</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Kode Wilayah</span>
                    </label>
                    <input
                      type="text"
                      name="regionCode"
                      placeholder="Contoh: SUMBA-TIMUR"
                      className="input input-bordered w-full"
                      value={formData.regionCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Deskripsi Singkat</span>
                  </label>
                  <textarea
                    name="deskripsi"
                    placeholder="Deskripsikan produk ini..."
                    className="textarea textarea-bordered h-24"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Bahan Baku Utama</span>
                    </label>
                    <input
                      type="text"
                      name="bahanBaku"
                      placeholder="Contoh: Kapas lokal, pewarna alami"
                      className="input input-bordered w-full"
                      value={formData.bahanBaku}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Waktu Pembuatan</span>
                    </label>
                    <input
                      type="text"
                      name="waktuPembuatan"
                      placeholder="Contoh: 2 minggu"
                      className="input input-bordered w-full"
                      value={formData.waktuPembuatan}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Harga Estimasi (Rp)</span>
                  </label>
                  <input
                    type="number"
                    name="hargaEstimasi"
                    placeholder="500000"
                    className="input input-bordered w-full"
                    value={formData.hargaEstimasi}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Cerita di Balik Produk</span>
                  </label>
                  <textarea
                    name="ceritaProduk"
                    placeholder="Ceritakan tentang proses pembuatan, makna motif, atau cerita unik lainnya..."
                    className="textarea textarea-bordered h-32"
                    value={formData.ceritaProduk}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <button type="button" className="btn btn-ghost" onClick={handleSaveDraft}>
                    Simpan Draf
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                    Lanjut ke Upload Media
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Media Upload */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Upload Foto & Video</h2>

                {/* Photo Upload */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Foto Produk (Minimal 3)</span>
                  </label>
                  <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center hover:border-primary transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <PhotoIcon className="h-16 w-16 mx-auto text-base-content/50 mb-4" />
                      <p className="text-lg font-semibold">Klik untuk upload foto</p>
                      <p className="text-sm text-base-content/70">atau drag & drop foto di sini</p>
                    </label>
                  </div>

                  {/* Photo Previews */}
                  {previewUrls.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {previewUrls.photos.map((url, index) => (
                        <div key={index} className="relative group">
                          <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Video Proses Pembuatan (Opsional)</span>
                  </label>
                  <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center hover:border-secondary transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <VideoCameraIcon className="h-16 w-16 mx-auto text-base-content/50 mb-4" />
                      <p className="text-lg font-semibold">Klik untuk upload video</p>
                      <p className="text-sm text-base-content/70">Format MP4, maksimal 100MB</p>
                    </label>
                  </div>

                  {/* Video Preview */}
                  {previewUrls.video && (
                    <div className="mt-4">
                      <video src={previewUrls.video} controls className="w-full max-h-96 rounded-lg" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-between mt-6">
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                    Kembali
                  </button>
                  <div className="flex gap-3">
                    <button type="button" className="btn btn-ghost" onClick={handleSaveDraft}>
                      Simpan Draf
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
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
                <h2 className="text-2xl font-bold mb-4">Review Data Produk</h2>

                <div className="alert alert-info">
                  <DocumentTextIcon className="h-6 w-6" />
                  <span>Pastikan semua data sudah benar sebelum mengirim untuk kurasi</span>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-base-content/70">Nama Produk</p>
                      <p className="font-semibold">{formData.namaProduk}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Jenis Produk</p>
                      <p className="font-semibold">{formData.jenisProduk}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Bahan Baku</p>
                      <p className="font-semibold">{formData.bahanBaku}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Waktu Pembuatan</p>
                      <p className="font-semibold">{formData.waktuPembuatan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Harga Estimasi</p>
                      <p className="font-semibold">
                        Rp {parseInt(formData.hargaEstimasi || "0").toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Kode Wilayah</p>
                      <p className="font-semibold">{formData.regionCode}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-base-content/70">Deskripsi</p>
                    <p className="font-semibold">{formData.deskripsi}</p>
                  </div>

                  <div>
                    <p className="text-sm text-base-content/70">Cerita Produk</p>
                    <p className="font-semibold">{formData.ceritaProduk}</p>
                  </div>

                  <div>
                    <p className="text-sm text-base-content/70 mb-2">Foto ({previewUrls.photos.length})</p>
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
                    <div>
                      <p className="text-sm text-base-content/70 mb-2">Video</p>
                      <video src={previewUrls.video} controls className="w-full max-h-64 rounded" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-between mt-6">
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                    Kembali
                  </button>
                  <div className="flex gap-3">
                    <button type="button" className="btn btn-outline" onClick={handleSaveDraft}>
                      Simpan Draf
                    </button>
                    <button type="submit" className="btn btn-success gap-2">
                      <CheckIcon className="h-5 w-5" />
                      Ajukan untuk Kurasi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahProdukBaru;
