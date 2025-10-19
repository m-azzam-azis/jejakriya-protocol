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
      {/* Hero Section */}
      <div className="flex items-center flex-col grow">
        <div className="w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20 px-5">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <SparklesIcon className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="text-primary">Jejak</span>
                <span className="text-secondary">Kriya</span>
              </h1>
            </div>

            <p className="text-2xl md:text-3xl font-semibold text-base-content/80 mb-4">
              Protokol Fundamental untuk Aset Kreatif Indonesia
            </p>

            <p className="text-lg md:text-xl text-base-content/60 max-w-3xl mx-auto mb-8">
              Membuka nilai ekonomi karya kriya, seni, dan produk kreatif melalui verifikasi terdesentralisasi,
              pembiayaan mikro DeFi, dan data transparan untuk pembuat kebijakan.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/agen" className="btn btn-primary btn-lg gap-2">
                Portal Agen
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link href="/kurator" className="btn btn-secondary btn-lg gap-2">
                Portal Kurator
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link href="/pemilik" className="btn btn-accent btn-lg gap-2">
                Portal Pemilik Aset
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Three Pillars Section */}
        <div className="w-full px-8 py-16 bg-base-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Tiga Pilar Strategis</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pillar 1: Trust Protocol */}
              <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body items-center text-center">
                  <ShieldCheckIcon className="h-16 w-16 text-primary mb-4" />
                  <h3 className="card-title text-2xl mb-3">Protokol Kepercayaan</h3>
                  <p className="text-base-content/70">
                    Standar emas untuk keaslian aset kreatif melalui verifikasi berlapis oleh kurator terdesentralisasi
                    dan standarisasi metadata on-chain (ICAS-721).
                  </p>
                  <div className="card-actions mt-4">
                    <Link href="/kurator" className="btn btn-sm btn-primary">
                      Pelajari Lebih Lanjut
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Liquidity Engine */}
              <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body items-center text-center">
                  <CurrencyDollarIcon className="h-16 w-16 text-secondary mb-4" />
                  <h3 className="card-title text-2xl mb-3">Mesin Likuiditas</h3>
                  <p className="text-base-content/70">
                    Mengubah aset kreatif terverifikasi menjadi aset produktif yang dapat dijaminkan untuk pembiayaan
                    mikro melalui protokol DeFi yang sesuai Regulatory Sandbox OJK.
                  </p>
                  <div className="card-actions mt-4">
                    <Link href="/pemilik" className="btn btn-sm btn-secondary">
                      Akses Pembiayaan
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pillar 3: National Data Asset */}
              <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body items-center text-center">
                  <ChartBarIcon className="h-16 w-16 text-accent mb-4" />
                  <h3 className="card-title text-2xl mb-3">Aset Data Nasional</h3>
                  <p className="text-base-content/70">
                    Buku Besar Ekonomi Kreatif Nasional yang real-time dan transparan, menyediakan data agregat untuk
                    Kemenparekraf/Ekraf dalam pembuatan kebijakan.
                  </p>
                  <div className="card-actions mt-4">
                    <Link href="/analytics" className="btn btn-sm btn-accent">
                      Lihat Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full px-8 py-16 bg-base-300">
          <div className="max-w-6xl mx-auto">
            <div className="stats stats-vertical md:stats-horizontal shadow w-full">
              <div className="stat place-items-center">
                <div className="stat-title">NFT Terverifikasi</div>
                <div className="stat-value text-primary">0</div>
                <div className="stat-desc">Total aset terdaftar</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Kurator Aktif</div>
                <div className="stat-value text-secondary">0</div>
                <div className="stat-desc">Penjaga kualitas</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Total Pinjaman</div>
                <div className="stat-value text-accent">0 USDC</div>
                <div className="stat-desc">Modal tersalurkan</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full px-8 py-16 bg-gradient-to-br from-primary to-secondary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-content mb-6">
              Siap Bergabung dengan Ekosistem JejaKriya?
            </h2>
            <p className="text-lg text-primary-content/80 mb-8">
              Daftarkan karya kreatif Anda, verifikasi keasliannya, dan akses pembiayaan untuk mengembangkan usaha
              kreatif Anda.
            </p>
            <Link href="/agen" className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 gap-2">
              Mulai Sekarang
              <ArrowRightIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
