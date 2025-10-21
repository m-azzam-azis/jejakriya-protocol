"use client";

import Link from "next/link";
import type { NextPage } from "next";
import {
  ArrowRightIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
      `}</style>

      {/* Full Page Gradient Background */}
      <div
        className="flex items-center flex-col min-h-screen relative"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Overlay image (repeating horizontally) positioned above the gradient but below page content */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-full"
          style={{
            backgroundImage: "url('/Overlay.png')",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top left",
            // force each tile to span full viewport width, then repeat vertically
            backgroundSize: "100% auto",
            zIndex: 0,
            opacity: 0.7,
          }}
        />
        {/* Hero Section */}
        <div className="w-full py-20 px-5">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <SparklesIcon className="h-12 w-12 text-white mr-3" />
              <h1
                className="text-5xl md:text-6xl font-bold"
                style={{
                  fontFamily: "'Aldo', sans-serif",
                  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                JejakKriya
              </h1>
            </div>

            <p className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Protokol Fundamental untuk Aset Kreatif Indonesia
            </p>

            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Membuka nilai ekonomi karya kriya, seni, dan produk kreatif melalui verifikasi terdesentralisasi,
              pembiayaan mikro DeFi, dan data transparan untuk pembuat kebijakan.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/agen"
                className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                  color: "#060606",
                }}
              >
                Portal Agen
                <ArrowRightIcon className="h-5 w-5 inline-block ml-2" />
              </Link>
              <Link
                href="/kurator"
                className="px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white/30 text-white transition-all hover:bg-white/10 hover:scale-105"
              >
                Portal Kurator
                <ArrowRightIcon className="h-5 w-5 inline-block ml-2" />
              </Link>
              <Link
                href="/pemilik"
                className="px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white/30 text-white transition-all hover:bg-white/10 hover:scale-105"
              >
                Portal Pemilik Aset
                <ArrowRightIcon className="h-5 w-5 inline-block ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Three Pillars Section */}
        <div className="w-full px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              style={{
                fontFamily: "'Aldo', sans-serif",
                background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Tiga Pilar Strategis
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pillar 1: Trust Protocol */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:bg-white/10 border border-white/10">
                <div className="flex flex-col items-center text-center">
                  <ShieldCheckIcon className="h-16 w-16 mb-4" style={{ color: "#E9A507" }} />
                  <h3
                    className="text-2xl mb-3 font-bold"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Protokol Kepercayaan
                  </h3>
                  <p className="text-white/80 mb-4">
                    Standar emas untuk keaslian aset kreatif melalui verifikasi berlapis oleh kurator terdesentralisasi
                    dan standarisasi metadata on-chain (ICAS-721).
                  </p>
                  <Link
                    href="/kurator"
                    className="mt-4 px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                      color: "#060606",
                    }}
                  >
                    Pelajari Lebih Lanjut
                  </Link>
                </div>
              </div>

              {/* Pillar 2: Liquidity Engine */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:bg-white/10 border border-white/10">
                <div className="flex flex-col items-center text-center">
                  <CurrencyDollarIcon className="h-16 w-16 mb-4" style={{ color: "#E9A507" }} />
                  <h3
                    className="text-2xl mb-3 font-bold"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Mesin Likuiditas
                  </h3>
                  <p className="text-white/80 mb-4">
                    Mengubah aset kreatif terverifikasi menjadi aset produktif yang dapat dijaminkan untuk pembiayaan
                    mikro melalui protokol DeFi yang sesuai Regulatory Sandbox OJK.
                  </p>
                  <Link
                    href="/pemilik"
                    className="mt-4 px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                      color: "#060606",
                    }}
                  >
                    Akses Pembiayaan
                  </Link>
                </div>
              </div>

              {/* Pillar 3: National Data Asset */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:bg-white/10 border border-white/10">
                <div className="flex flex-col items-center text-center">
                  <ChartBarIcon className="h-16 w-16 mb-4" style={{ color: "#E9A507" }} />
                  <h3
                    className="text-2xl mb-3 font-bold"
                    style={{
                      fontFamily: "'Aldo', sans-serif",
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Aset Data Nasional
                  </h3>
                  <p className="text-white/80 mb-4">
                    Buku Besar Ekonomi Kreatif Nasional yang real-time dan transparan, menyediakan data agregat untuk
                    Kemenparekraf/Ekraf dalam pembuatan kebijakan.
                  </p>
                  <Link
                    href="/analytics"
                    className="mt-4 px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                      color: "#060606",
                    }}
                  >
                    Lihat Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
                <div className="text-white/60 mb-2 text-lg">NFT Terverifikasi</div>
                <div
                  className="text-5xl font-bold mb-2"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  0
                </div>
                <div className="text-white/50">Total aset terdaftar</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
                <div className="text-white/60 mb-2 text-lg">Kurator Aktif</div>
                <div
                  className="text-5xl font-bold mb-2"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  0
                </div>
                <div className="text-white/50">Penjaga kualitas</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
                <div className="text-white/60 mb-2 text-lg">Total Pinjaman</div>
                <div
                  className="text-5xl font-bold mb-2"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  0
                </div>
                <div className="text-white/50">USDC Modal tersalurkan</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full px-8 py-16">
          <div className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{
                fontFamily: "'Aldo', sans-serif",
                background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Siap Bergabung dengan Ekosistem JejakKriya?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Daftarkan karya kreatif Anda, verifikasi keasliannya, dan akses pembiayaan untuk mengembangkan usaha
              kreatif Anda.
            </p>
            <Link
              href="/agen"
              className="inline-block px-10 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                color: "#060606",
              }}
            >
              Mulai Sekarang
              <ArrowRightIcon className="h-6 w-6 inline-block ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
