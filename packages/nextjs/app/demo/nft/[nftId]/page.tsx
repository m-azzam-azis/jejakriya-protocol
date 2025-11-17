"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon, UserIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useDemoStore } from "~~/services/store/demoStore";

export default function DemoNFTDetailPage({ params }: { params: { nftId: string } }) {
  const router = useRouter();
  const getNFTById = useDemoStore(state => state.getNFTById);
  const [nft, setNft] = useState<ReturnType<typeof getNFTById>>(undefined);

  useEffect(() => {
    const foundNFT = getNFTById(params.nftId);
    if (!foundNFT) {
      alert("NFT tidak ditemukan");
      router.push("/demo/profile");
      return;
    }
    setNft(foundNFT);
  }, [params.nftId, getNFTById, router]);

  if (!nft) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)" }}
      >
        <div className="loading loading-spinner loading-lg" style={{ color: "#E9A507" }}></div>
      </div>
    );
  }

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
        className="min-h-screen pt-24"
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

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/demo/profile"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Kembali ke Profile</span>
          </Link>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Image */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="relative h-96 rounded-xl overflow-hidden mb-4">
                <Image src={nft.imageUrl} alt={nft.name} fill className="object-cover" />
                {nft.verified && (
                  <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                    <CheckBadgeIcon className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="text-white/60 text-sm mb-1">NFT ID</p>
                <p className="text-white font-mono text-lg">#{nft.id}</p>
              </div>
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              {/* Title & Category */}
              <div>
                <h1
                  className="text-4xl font-bold mb-3"
                  style={{
                    fontFamily: "'Mileast', sans-serif",
                    ...goldGradientText,
                  }}
                >
                  {nft.name}
                </h1>
                <p className="text-white/80 text-xl mb-2">Karya: {nft.pengrajinName}</p>
                <div className="flex items-center gap-3">
                  <span
                    className="px-4 py-1.5 rounded-full font-semibold text-sm"
                    style={{
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                      color: "#060606",
                    }}
                  >
                    {nft.category}
                  </span>
                  <span className="text-white/70 text-lg font-bold">{nft.price}</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <TagIcon className="h-5 w-5" style={{ color: "#E9A507" }} />
                  Deskripsi
                </h3>
                <p className="text-white/70 leading-relaxed">{nft.description}</p>
              </div>

              {/* Metadata */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" style={{ color: "#E9A507" }} />
                  Informasi Minting
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Tanggal Minting:</span>
                    <span className="text-white font-semibold">
                      {new Date(nft.mintedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Status:</span>
                    <span className="text-green-400 font-semibold flex items-center gap-2">
                      <CheckBadgeIcon className="h-5 w-5" />
                      Verified
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Kepemilikan:</span>
                    <span className="text-white font-semibold">{nft.ownershipHistory.length} kali transfer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ownership History Section */}
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2
              className="text-3xl font-bold mb-6"
              style={{
                fontFamily: "'Mileast', sans-serif",
                ...goldGradientText,
              }}
            >
              Riwayat Kepemilikan
            </h2>

            <div className="space-y-4">
              {nft.ownershipHistory.map((history, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{
                        background: "linear-gradient(135deg, #C48A04 0%, #E9A507 100%)",
                        color: "#060606",
                      }}
                    >
                      {index + 1}
                    </div>
                    {index < nft.ownershipHistory.length - 1 && (
                      <div
                        className="w-1 h-full bg-gradient-to-b from-[#E9A507] to-transparent mt-2"
                        style={{ minHeight: "40px" }}
                      ></div>
                    )}
                  </div>

                  {/* History Card */}
                  <div className="flex-1 bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-white/70" />
                        <p className="text-white font-bold text-lg">{history.ownerName}</p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
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

                    {history.ownerAddress && (
                      <p className="text-white/50 text-sm font-mono mb-2">{history.ownerAddress}</p>
                    )}

                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        {new Date(history.transferredAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/demo/profile"
              className="btn btn-lg border-0 font-bold"
              style={{
                background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                color: "#060606",
              }}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Kembali ke Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
