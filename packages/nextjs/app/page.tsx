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
        @import url("https://fonts.cdnfonts.com/css/mileast");
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
<div className="w-full min-h-screen flex items-center justify-center px-5">
  <div className="max-w-6xl mx-auto text-center">
    <div className="flex items-center justify-center mb-6">
      <SparklesIcon className="h-16 w-16 text-white mr-4" />
      <h1
        className="text-6xl md:text-7xl font-bold"
        style={{
          fontFamily: "'Mileast', sans-serif",
          background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        JejakKriya
      </h1>
    </div>

    <p
      className="text-3xl md:text-4xl font-semibold text-white mb-6"
      style={{ fontFamily: "Poppins', sans-serif" }}
    >
      Protokol Fundamental untuk Aset Kreatif Indonesia
    </p>

    <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12">
  Membuka nilai ekonomi karya kriya, seni, dan produk kreatif melalui verifikasi terdesentralisasi, pembiayaan mikro DeFi, dan data transparan untuk pembuat kebijakan.
    </p>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link
        href="/agen"
        className="inline-block px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
        style={{
          background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
          color: "#060606",
        }}
      >
        Gabung Ekosistem
        <ArrowRightIcon className="h-5 w-5 inline-block ml-2" />
      </Link>
      
      <button
        onClick={() => document.getElementById('tiga-pilar')?.scrollIntoView({ behavior: 'smooth' })}
        className="inline-block px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 border-2 border-[#E9A507] text-white hover:bg-[#E9A507] hover:text-black"
      >
        Pelajari Selengkapnya
      </button>
    </div>
  </div>
</div>

        {/* Three Pillars Section */}
        <div id="tiga-pilar" className="w-full px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-4xl md:text-5xl font-bold text-center mb-12"
              style={{
                fontFamily: "'Mileast', sans-serif",
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
                    className="text-2xl md:text-3xl mb-3 font-bold"
                    style={{
                      fontFamily: "'Mileast', sans-serif",
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
                    className="text-2xl md:text-3xl mb-3 font-bold"
                    style={{
                      fontFamily: "'Mileast', sans-serif",
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
                    className="text-2xl md:text-3xl mb-3 font-bold"
                    style={{
                      fontFamily: "'Mileast', sans-serif",
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

        {/* Journey Timeline Section */}
        <div className="w-full px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-4xl md:text-5xl font-bold text-center mb-8"
              style={{
                fontFamily: "'Mileast', sans-serif",
                background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Perjalanan di JejakKriya
            </h2>
            <p className="text-xl text-white/80 text-center mb-16 max-w-3xl mx-auto">
              Dari pendataan hingga pemanfaatan ekonomi — ikuti langkah demi langkah bagaimana karya kriya
              bertransformasi menjadi aset digital yang bernilai.
            </p>

            <div className="relative">
              {/* Timeline Steps */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative flex items-start gap-8">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl z-10 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                        color: "#060606",
                      }}
                    >
                      1
                    </div>
                    <div className="w-1 h-full bg-gradient-to-b from-[#E9A507] to-transparent mt-4"></div>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Mileast', sans-serif" }}
                    >
                      Pendataan oleh Agen
                    </h3>
                    <p className="text-white/80">
                      Jejak Kriya memfasilitasi Agen untuk membantu pengrajin mendokumentasikan karya mereka dan
                      menginput data kerajinan ke sistem sebagai langkah awal digitalisasi.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-8">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl z-10 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                        color: "#060606",
                      }}
                    >
                      2
                    </div>
                    <div className="w-1 h-full bg-gradient-to-b from-[#E9A507] to-transparent mt-4"></div>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Mileast', sans-serif" }}
                    >
                      Pengajuan ke Kurator
                    </h3>
                    <p className="text-white/80">
                      Data kerajinan diajukan ke Kurator melalui platform untuk dinilai dari segi kualitas, keaslian,
                      dan nilai budaya.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-8">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl z-10 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                        color: "#060606",
                      }}
                    >
                      3
                    </div>
                    <div className="w-1 h-full bg-gradient-to-b from-[#E9A507] to-transparent mt-4"></div>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Mileast', sans-serif" }}
                    >
                      Kurasi dan Persetujuan
                    </h3>
                    <p className="text-white/80">
                      Kurator meninjau setiap pengajuan dan memberikan keputusan. Jika disetujui, sistem otomatis
                      melanjutkan ke proses minting NFT.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-start gap-8">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl z-10 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                        color: "#060606",
                      }}
                    >
                      4
                    </div>
                    <div className="w-1 h-full bg-gradient-to-b from-[#E9A507] to-transparent mt-4"></div>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Mileast', sans-serif" }}
                    >
                      Minting NFT Otomatis
                    </h3>
                    <p className="text-white/80">
                      Sistem Jejak Kriya mengubah kerajinan yang lolos kurasi menjadi NFT di blockchain, lengkap dengan
                      sertifikasi digital yang unik dan terverifikasi.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex items-start gap-8">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl z-10 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                        color: "#060606",
                      }}
                    >
                      5
                    </div>
                    <div className="w-1 h-full bg-gradient-to-b from-[#E9A507] to-transparent mt-4"></div>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Mileast', sans-serif" }}
                    >
                      NFT Tersimpan di Akun Pengrajin
                    </h3>
                    <p className="text-white/80">
                      NFT yang telah diterbitkan muncul di dashboard pengrajin sebagai bukti kepemilikan digital dan
                      aset bernilai ekonomi.
                    </p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="relative flex items-start gap-8">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl z-10 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                        color: "#060606",
                      }}
                    >
                      6
                    </div>
                    <div className="w-1 h-full bg-gradient-to-b from-[#E9A507] to-transparent mt-4"></div>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Mileast', sans-serif" }}
                    >
                      Pemanfaatan NFT untuk Lending
                    </h3>
                    <p className="text-white/80">
                      NFT dapat digunakan sebagai agunan dalam lending pool, memungkinkan pengrajin memperoleh
                      pembiayaan berbasis blockchain.
                    </p>
                  </div>
                </div>

                {/* Step 7 */}
                <div className="relative flex items-start gap-8">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl z-10 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                        color: "#060606",
                      }}
                    >
                      7
                    </div>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                    <h3
                      className="text-2xl md:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Mileast', sans-serif" }}
                    >
                      Pemantauan oleh Admin dan Ekraf
                    </h3>
                    <p className="text-white/80">
                      Semua aktivitas dan transaksi tercatat otomatis di dashboard Admin dan Kemenparekraf untuk
                      memastikan transparansi dan akuntabilitas ekosistem ekonomi kreatif.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ecosystem Section */}
        <div className="w-full px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              style={{
                fontFamily: "'Mileast', sans-serif",
                background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Ekosistem JejakKriya
            </h2>

            {/* Section 0 - Pengrajin */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-1">
                <h3
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{
                    fontFamily: "'Mileast', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Pengrajin
                </h3>
                <p
                  className="text-white/80 text-lg leading-relaxed mb-6 text-justify font-medium"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Jejak Kriya memberikan ruang bagi pengrajin untuk bertransformasi di era digital tanpa kehilangan akar
                  budaya mereka. Melalui akun pribadi, pengrajin dapat melihat koleksi NFT dari karya mereka yang telah
                  di-mint, serta memanfaatkannya untuk mengajukan pinjaman atau agunan melalui lending pool berbasis
                  blockchain. Dengan demikian, pengrajin tidak hanya memperoleh apresiasi atas karya mereka, tetapi juga
                  dukungan finansial untuk terus berkarya dan memperkuat keberlanjutan ekonomi kreatif nasional.
                </p>
                <Link
                  href="/pengrajin"
                  className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    color: "#060606",
                  }}
                >
                  Portal Pengrajin
                  <ArrowRightIcon className="h-5 w-5 inline-block ml-2" />
                </Link>
              </div>
              <div className="order-2">
                <img
                  src="/pengrajin.png"
                  alt="Pengrajin"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  style={{ opacity: 1 }}
                />
              </div>
            </div>

            {/* Section 1 - Agen */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1">
                <img src="/agen.png" alt="Agen" className="w-full h-auto rounded-2xl shadow-2xl" />
              </div>
              <div className="order-1 md:order-2">
                <h3
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{
                    fontFamily: "'Mileast', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Agen
                </h3>
                <p
                  className="text-white/80 text-lg leading-relaxed text-justify font-medium mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Sebagai ujung tombak Jejak Kriya, Agen berperan penting dalam menjembatani dunia kerajinan tradisional
                  dengan inovasi blockchain. Melalui platform ini, Agen dapat menginput data kerajinan fisik hasil karya
                  pengrajin lokal untuk diajukan kepada kurator. Setelah disetujui, sistem secara otomatis akan
                  melakukan proses minting NFT sebagai bentuk digitalisasi karya tersebut. Dengan peran Agen, setiap
                  karya kriya tidak hanya memiliki nilai budaya, tetapi juga nilai aset digital yang dapat berkontribusi
                  pada pertumbuhan ekonomi kreatif Indonesia.
                </p>
                <Link
                  href="/agen"
                  className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    color: "#060606",
                  }}
                >
                  Portal Agen
                  <ArrowRightIcon className="h-5 w-5 inline-block ml-2" />
                </Link>
              </div>
            </div>

            {/* Section 2 - Kurator */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-1">
                <h3
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{
                    fontFamily: "'Mileast', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Kurator
                </h3>
                <p
                  className="text-white/80 text-lg leading-relaxed text-justify font-medium mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Kurator berperan sebagai garda terdepan dalam menjaga nilai dan orisinalitas karya budaya Indonesia.
                  Di Jejak Kriya, kurator memiliki wewenang untuk menilai dan memutuskan apakah kerajinan yang diajukan
                  layak untuk diakui sebagai aset digital. Dengan proses kurasi yang ketat dan transparan di atas
                  blockchain, kurator membantu memastikan bahwa setiap NFT yang terbit merepresentasikan karya yang
                  autentik, berkualitas, dan membawa identitas budaya Indonesia ke ranah global.
                </p>
                <Link
                  href="/kurator"
                  className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    color: "#060606",
                  }}
                >
                  Portal Kurator
                  <ArrowRightIcon className="h-5 w-5 inline-block ml-2" />
                </Link>
              </div>
              <div className="order-2">
                <img src="/kurator.png" alt="Kurator" className="w-full h-auto rounded-2xl shadow-2xl" />
              </div>
            </div>

            {/* Section 3 - Kemenparekraf */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1">
                <img src="/ekraf.png" alt="Kemenparekraf" className="w-full h-auto rounded-2xl shadow-2xl" />
              </div>
              <div className="order-1 md:order-2">
                <h3
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{
                    fontFamily: "'Mileast', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Kemenparekraf
                </h3>
                <p
                  className="text-white/80 text-lg leading-relaxed text-justify font-medium mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Bagi Kementerian Pariwisata dan Ekonomi Kreatif, Jejak Kriya menjadi jendela baru untuk memahami
                  potensi besar ekonomi kreatif Indonesia. Melalui dashboard interaktif berbasis blockchain,
                  Kemenparekraf dapat memantau data transaksi, pertumbuhan nilai karya, serta pergerakan aset digital di
                  seluruh nusantara. Platform ini menjadi langkah nyata dalam membangun transparansi, efisiensi, dan
                  keberlanjutan ekonomi kreatif berbasis teknologi yang mendukung visi Indonesia Emas 2045.
                </p>
                <Link
                  href="/ekraf"
                  className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    color: "#060606",
                  }}
                >
                  Portal Kemenparekraf
                  <ArrowRightIcon className="h-5 w-5 inline-block ml-2" />
                </Link>
              </div>
            </div>

            {/* Section 4 - Admin */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-1">
                <h3
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{
                    fontFamily: "'Mileast', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Admin
                </h3>
                <p
                  className="text-white/80 text-lg leading-relaxed text-justify font-medium mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Admin berperan sebagai pengelola utama yang memastikan seluruh sistem Jejak Kriya berjalan dengan
                  aman, efisien, dan transparan. Melalui dashboard manajemen, admin dapat memantau total transaksi,
                  aktivitas pengguna, serta performa ekosistem secara keseluruhan. Dengan peran ini, admin membantu
                  menjaga integritas platform agar setiap interaksi antara Agen, Kurator, Pengrajin, dan Kemenparekraf
                  berlangsung harmonis — menciptakan ekosistem ekonomi kreatif digital yang tangguh dan berkelanjutan.
                </p>
                <Link
                  href="/admin"
                  className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    color: "#060606",
                  }}
                >
                  Portal Admin
                  <ArrowRightIcon className="h-5 w-5 inline-block ml-2" />
                </Link>
              </div>
              <div className="order-2">
                <img src="/admin.png" alt="Admin" className="w-full h-auto rounded-2xl shadow-2xl" />
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
                fontFamily: "'Mileast', sans-serif",
                background: "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Siap Bergabung dengan Ekosistem JejakKriya?
            </h2>
            <p className="text-xl text-white/80 mb-8">
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
