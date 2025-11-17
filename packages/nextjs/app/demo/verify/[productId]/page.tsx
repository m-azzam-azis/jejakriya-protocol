"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDemoStore } from "~~/services/store/demoStore";
import { ArrowRightIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";

export default function DemoVerifyPage({ params }: { params: { productId: string } }) {
  const router = useRouter();
  const pendingNFT = useDemoStore(state => state.pendingNFT);
  const verifyTransfer = useDemoStore(state => state.verifyTransfer);

  const [sliderValue, setSliderValue] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Validasi productId (harus '4' untuk demo)
  useEffect(() => {
    if (params.productId !== "4") {
      alert("Demo hanya tersedia untuk Product ID: 4");
      router.push("/demo/profile");
    }
  }, [params.productId, router]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);

    // Auto-verify ketika slider mencapai 90%
    if (value >= 90 && !isVerifying) {
      handleVerify();
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);

    // Simulasi loading
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Panggil store action
    verifyTransfer(params.productId);

    // Redirect ke profile
    router.push("/demo/profile");
  };

  const goldGradientText = {
    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
        @import url("https://fonts.cdnfonts.com/css/mileast");
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Overlay */}
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

        <div className="relative z-10 max-w-3xl w-full mx-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            {/* Product Info */}
            <div className="text-center mb-8">
              <div className="relative h-80 mb-6 rounded-xl overflow-hidden border-4 border-white/10">
                <Image src={pendingNFT.imageUrl} alt={pendingNFT.name} fill className="object-cover" />
              </div>

              <h2
                className="text-4xl font-bold mb-3"
                style={{
                  fontFamily: "'Mileast', sans-serif",
                  ...goldGradientText,
                }}
              >
                {pendingNFT.name}
              </h2>
              <p className="text-white/80 text-xl mb-2">Karya: {pendingNFT.pengrajinName}</p>
              <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                <span className="bg-white/10 px-4 py-1 rounded-full">{pendingNFT.category}</span>
                <span className="bg-white/10 px-4 py-1 rounded-full">{pendingNFT.price}</span>
              </div>

              <p className="text-white/70 mt-4 max-w-2xl mx-auto">{pendingNFT.description}</p>
            </div>

            {/* Ownership History */}
            <div className="mb-8 bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ClockIcon className="h-6 w-6" style={{ color: "#E9A507" }} />
                Riwayat Kepemilikan
              </h3>

              <div className="space-y-3">
                {pendingNFT.ownershipHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)",
                        }}
                      >
                        <UserIcon className="h-5 w-5 text-black" />
                      </div>
                      {index < pendingNFT.ownershipHistory.length - 1 && (
                        <div className="w-0.5 h-8 bg-gradient-to-b from-[#E9A507] to-transparent mt-2"></div>
                      )}
                    </div>

                    <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white font-semibold">{history.ownerName}</p>
                      {history.ownerAddress && <p className="text-white/50 text-xs font-mono">{history.ownerAddress}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/60">
                          {new Date(history.transferredAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background:
                              history.transferMethod === "mint"
                                ? "rgba(34, 197, 94, 0.2)"
                                : history.transferMethod === "purchase"
                                  ? "rgba(59, 130, 246, 0.2)"
                                  : "rgba(251, 191, 36, 0.2)",
                            color:
                              history.transferMethod === "mint"
                                ? "#4ade80"
                                : history.transferMethod === "purchase"
                                  ? "#60a5fa"
                                  : "#fbbf24",
                          }}
                        >
                          {history.transferMethod === "mint"
                            ? "Minted"
                            : history.transferMethod === "purchase"
                              ? "Purchased"
                              : "Transferred"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Verification */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-white text-center mb-4 font-semibold text-lg">
                {isVerifying ? "Memverifikasi Kepemilikan..." : "Geser untuk Verifikasi Kepemilikan"}
              </p>

              <div className="relative mb-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  disabled={isVerifying}
                  className="w-full h-16 appearance-none rounded-full cursor-pointer disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(to right, #E9A507 ${sliderValue}%, rgba(255,255,255,0.1) ${sliderValue}%)`,
                  }}
                />

                <div
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100"
                  style={{ left: `calc(${sliderValue}% - 24px)` }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)",
                    }}
                  >
                    <ArrowRightIcon className="h-6 w-6 text-black" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/70 text-lg font-bold">{sliderValue}%</p>
                <p className="text-white/50 text-sm mt-1">
                  {sliderValue < 90 ? "Geser ke kanan untuk memverifikasi" : "Verifikasi..."}
                </p>
              </div>
            </div>

            {isVerifying && (
              <div className="mt-6 text-center">
                <div className="loading loading-spinner loading-lg" style={{ color: "#E9A507" }}></div>
                <p className="text-white mt-3 text-lg">Sedang memverifikasi kepemilikan NFT...</p>
                <p className="text-white/60 text-sm">Mohon tunggu sebentar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
