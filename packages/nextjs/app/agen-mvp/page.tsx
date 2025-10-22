"use client";

import { useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { CheckCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

/**
 * MVP Simple Form - Halaman Agen untuk Submit Mint Request
 * Flow: Input data → Upload foto ke IPFS (mock dulu) → Call requestMint
 */
const AgenMVPPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    artisanAddress: "",
    regionCode: "",
    category: "",
    productName: "",
    story: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Hook untuk call smart contract
  const { writeContractAsync } = useScaffoldWriteContract("ICAS721");

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock IPFS upload (untuk MVP, nanti diganti dengan real IPFS)
  const uploadToIPFS = async (): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock IPFS metadata JSON
    const metadata = {
      name: formData.productName,
      description: formData.story,
      image: "ipfs://QmMockHash12345/image.jpg", // Mock image hash
      attributes: [
        {
          trait_type: "Region",
          value: formData.regionCode,
        },
        {
          trait_type: "Category",
          value: formData.category,
        },
        {
          trait_type: "Artisan",
          value: formData.artisanAddress,
        },
      ],
    };

    // Mock IPFS hash for metadata JSON
    const mockMetadataHash = `QmMock${Date.now()}${Math.random().toString(36).substring(7)}`;
    console.log("📦 Mock IPFS Metadata:", metadata);
    console.log("📝 Mock IPFS Hash:", mockMetadataHash);

    return mockMetadataHash;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connectedAddress) {
      notification.error("Please connect your wallet first");
      return;
    }

    if (!formData.artisanAddress || !formData.regionCode || !formData.category || !formData.productName) {
      notification.error("Please fill all required fields");
      return;
    }

    if (!selectedImage) {
      notification.error("Please select a product image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload to IPFS (mock untuk MVP)
      notification.info("📤 Uploading to IPFS...");
      const ipfsHash = await uploadToIPFS();
      console.log("✅ IPFS Upload complete:", ipfsHash);

      // Step 2: Submit mint request to smart contract
      notification.info("📝 Submitting mint request...");
      await writeContractAsync({
        functionName: "requestMint",
        args: [formData.artisanAddress, formData.regionCode, formData.category, ipfsHash],
      });

      notification.success("🎉 Mint request submitted successfully!");

      // Reset form
      setFormData({
        artisanAddress: "",
        regionCode: "",
        category: "",
        productName: "",
        story: "",
      });
      setSelectedImage(null);
      setImagePreview("");
    } catch (error: any) {
      console.error("❌ Submission error:", error);
      notification.error(error?.message || "Failed to submit mint request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-content p-8 rounded-t-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Daftarkan Produk Kriya Baru</h1>
          <p className="text-primary-content/80">
            Ajukan produk pengrajin untuk diverifikasi kurator dan di-mint sebagai NFT
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-base-100 p-8 rounded-b-xl shadow-xl space-y-6">
          {/* Artisan Address */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Alamat Wallet Pengrajin <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="artisanAddress"
              placeholder="0x..."
              className="input input-bordered w-full"
              value={formData.artisanAddress}
              onChange={handleInputChange}
              required
            />
            <label className="label">
              <span className="label-text-alt">NFT akan di-mint ke alamat ini setelah disetujui kurator</span>
            </label>
          </div>

          {/* Region Code */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Kode Wilayah <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="regionCode"
              className="select select-bordered w-full"
              value={formData.regionCode}
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Wilayah</option>
              <option value="JT-SMG">Jawa Tengah - Semarang</option>
              <option value="JT-SOLO">Jawa Tengah - Solo</option>
              <option value="BALI">Bali</option>
              <option value="JE-SBY">Jawa Timur - Surabaya</option>
              <option value="NTT-SUMBA">NTT - Sumba</option>
              <option value="YOGYA">Yogyakarta</option>
              <option value="JB-CIREBON">Jawa Barat - Cirebon</option>
              <option value="KALSEL">Kalimantan Selatan</option>
            </select>
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Kategori Produk <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="category"
              className="select select-bordered w-full"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Tenun">Tenun</option>
              <option value="Batik">Batik</option>
              <option value="Anyaman">Anyaman</option>
              <option value="Ukiran">Ukiran Kayu</option>
              <option value="Keramik">Keramik</option>
              <option value="Perak">Kerajinan Perak</option>
              <option value="Wayang">Wayang</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Product Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Nama Produk <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              name="productName"
              placeholder="Contoh: Kain Tenun Sumba Motif Kuda"
              className="input input-bordered w-full"
              value={formData.productName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Story */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Cerita & Deskripsi Produk</span>
            </label>
            <textarea
              name="story"
              placeholder="Ceritakan tentang produk ini, teknik pembuatan, makna motif, dll..."
              className="textarea textarea-bordered h-32"
              value={formData.story}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Foto Produk <span className="text-error">*</span>
              </span>
            </label>

            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-base-300 border-dashed rounded-lg cursor-pointer bg-base-200 hover:bg-base-300 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <PhotoIcon className="h-12 w-12 text-base-content/50 mb-3" />
                  <p className="mb-2 text-sm text-base-content/70">
                    <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs text-base-content/50">PNG, JPG atau JPEG (Max 10MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} required />
              </label>
            ) : (
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-64 object-cover rounded-lg"
                  width={256}
                  height={256}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview("");
                  }}
                  className="btn btn-sm btn-circle btn-error absolute top-2 right-2"
                >
                  ✕
                </button>
                <div className="absolute bottom-2 left-2 bg-success text-success-content px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  Foto berhasil dipilih
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !connectedAddress}
              className="btn btn-primary btn-lg w-full"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Submitting...
                </>
              ) : !connectedAddress ? (
                "Hubungkan Wallet Terlebih Dahulu"
              ) : (
                "🚀 Ajukan untuk Verifikasi"
              )}
            </button>

            {connectedAddress && (
              <p className="text-sm text-base-content/60 mt-3 text-center">
                Submitted by: <span className="font-mono">{connectedAddress.slice(0, 10)}...</span>
              </p>
            )}
          </div>

          {/* Info Alert */}
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h4 className="font-bold">Catatan Penting</h4>
              <div className="text-sm">
                <p>• Request akan masuk ke antrian kurator untuk diverifikasi</p>
                <p>• NFT akan di-mint otomatis ke alamat pengrajin setelah approved</p>
                <p>• Pastikan data yang dimasukkan sudah benar sebelum submit</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgenMVPPage;
