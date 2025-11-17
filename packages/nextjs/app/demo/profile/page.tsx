"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  QrCodeIcon,
  UserCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const DemoProfile: NextPage = () => {
  const [product, setProduct] = useState<any>(null);
  const [showQRIS, setShowQRIS] = useState(false);
  const [showUSDCPayment, setShowUSDCPayment] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [nftData, setNftData] = useState<any>(null);
  const [usdcBalance, setUsdcBalance] = useState(100000); // Demo balance in USDC (100k)

  useEffect(() => {
    // Load product from localStorage
    const storedProduct = localStorage.getItem("demoProduct");
    if (storedProduct) {
      const prod = JSON.parse(storedProduct);
      setProduct(prod);
      
      // Always create NFT data (either pending payment or minted)
      const baseNftData = {
        tokenId: "1",
        name: prod.name,
        image: prod.images[0],
        owner: "0xD940...6e37",
        price: prod.price,
        status: prod.status || "pending_payment", // pending_payment or minted
      };

      if (prod.status === "minted") {
        setNftData({
          ...baseNftData,
          mintedAt: prod.mintedAt || new Date().toISOString(),
          collateralValue: Math.floor(prod.price * 0.7),
        });
      } else {
        // NFT exists but pending payment
        setNftData(baseNftData);
      }
    }
  }, []);

  const handlePayWithQRIS = () => {
    setShowQRIS(true);
    setShowUSDCPayment(false);
  };

  const handlePayWithUSDC = () => {
    setShowUSDCPayment(true);
    setShowQRIS(false);
  };

  const handleQRISClick = async () => {
    await processPayment();
  };

  const handleUSDCPayment = async () => {
    if (usdcBalance < product.price) {
      alert("Saldo USDC tidak cukup!");
      return;
    }
    await processPayment();
  };

  const processPayment = async () => {
    setIsPaying(true);
    setShowQRIS(false);
    setShowUSDCPayment(false);

    // Simulasi pembayaran
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Deduct USDC balance
    setUsdcBalance(prev => prev - product.price);

    // Update status to minted
    const updatedProduct = {
      ...product,
      status: "minted",
      mintedAt: new Date().toISOString(),
      nftTokenId: "1",
    };

    localStorage.setItem("demoProduct", JSON.stringify(updatedProduct));

    // Update NFT data to minted status
    setNftData({
      tokenId: "1",
      name: product.name,
      image: product.images[0],
      owner: "0xD940...6e37",
      price: product.price,
      status: "minted",
      mintedAt: new Date().toISOString(),
      collateralValue: Math.floor(product.price * 0.7),
    });

    setIsPaying(false);
  };

  const handleRepayLoan = async () => {
    // Simulate repayment
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Demo: Loan repaid successfully!");
  };

  // Toggle payment status (for demo testing)
  const handleTogglePaymentStatus = () => {
    if (!product) return;

    const newStatus = nftData?.status === "pending_payment" ? "minted" : "pending_payment";
    
    const updatedProduct = {
      ...product,
      status: newStatus,
      mintedAt: newStatus === "minted" ? new Date().toISOString() : null,
    };

    localStorage.setItem("demoProduct", JSON.stringify(updatedProduct));

    if (newStatus === "minted") {
      setNftData({
        tokenId: "1",
        name: product.name,
        image: product.images[0],
        owner: "0xD940...6e37",
        price: product.price,
        status: "minted",
        mintedAt: new Date().toISOString(),
        collateralValue: Math.floor(product.price * 0.7),
      });
    } else {
      setNftData({
        tokenId: "1",
        name: product.name,
        image: product.images[0],
        owner: "0xD940...6e37",
        price: product.price,
        status: "pending_payment",
      });
    }
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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
        @import url("https://fonts.cdnfonts.com/css/mileast");
      `}</style>

      <div
        className="flex flex-col min-h-screen relative text-white"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full"
          style={{
            backgroundImage: "url('/Overlay.png')",
            backgroundRepeat: "repeat-y",
            backgroundPosition: "top left",
            backgroundSize: "100% auto",
            zIndex: 0,
            opacity: 0.7,
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 pt-[150px]">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <UserCircleIcon className="h-16 w-16" style={{ color: "#E9A507" }} />
              <h1
                className="text-5xl md:text-6xl font-bold"
                style={{
                  fontFamily: "'Mileast', sans-serif",
                  ...goldGradientText,
                }}
              >
                Profile Saya
              </h1>
            </div>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-6">
              Kelola dana dan pinjaman NFT Anda
            </p>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-md mx-auto">
              <p className="text-white/70 text-sm mb-2">Wallet Address:</p>
              <p className="text-white font-mono font-semibold">0xD940...6e37</p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <BanknotesIcon className="h-8 w-8" style={{ color: "#E9A507" }} />
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
                >
                  Saldo Dana
                </h2>
              </div>
              <div className="text-5xl font-bold mb-2" style={{ ...goldGradientText }}>
                {usdcBalance.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
              </div>
              <p className="text-white/60 text-sm mb-4">Available for loan repayment</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <LockClosedIcon className="h-8 w-8 text-blue-400" />
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
                >
                  Statistik NFT
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Total NFT:</span>
                  <span className="font-bold text-white">{nftData ? 1 : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Sudah Minted:</span>
                  <span className="font-bold text-green-400">{nftData?.status === "minted" ? 1 : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Menunggu Pembayaran:</span>
                  <span className="font-bold text-yellow-400">{nftData?.status === "pending_payment" ? 1 : 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Loans Section */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
            >
              NFT yang Dipinjam (Aktif)
            </h2>

            {/* Empty state - no active loans */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
              <CheckCircleIcon className="h-16 w-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-2xl font-bold mb-2" style={{ ...goldGradientText }}>
                Tidak Ada Pinjaman Aktif
              </h3>
              <p className="text-white/70 mb-6">Anda tidak memiliki pinjaman NFT yang aktif saat ini.</p>
            </div>
          </div>

          {/* Owned NFTs Section */}
          {nftData && (
            <div className="mb-8">
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
              >
                NFT yang Dimiliki
              </h2>

              {/* Success Banner - shown after payment */}
              {isPaying && (
                <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 mb-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="loading loading-spinner loading-lg text-blue-400"></div>
                    <h3 className="text-2xl font-bold text-white">Memproses Pembayaran...</h3>
                    <p className="text-white/70 text-center">
                      Produk Anda sedang di-mint menjadi NFT
                    </p>
                  </div>
                </div>
              )}

              {!isPaying && nftData.status === "minted" && (
                <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 mb-8">
                  <div className="flex items-center gap-4">
                    <CheckCircleIcon className="h-12 w-12 text-green-400" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Pembayaran Berhasil!</h3>
                      <p className="text-green-300">
                        Produk Anda telah berhasil di-mint menjadi NFT
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* NFT Card */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  {/* NFT Image */}
                  <div className="relative mb-4">
                    <img
                      src={nftData.image}
                      alt={nftData.name}
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/keris.png";
                      }}
                    />
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full ${
                      nftData.status === "minted" 
                        ? "bg-green-500" 
                        : "bg-yellow-500"
                    }`}>
                      <span className="text-white text-xs font-bold">
                        {nftData.status === "minted" ? "MINTED" : "PENDING"}
                      </span>
                    </div>
                  </div>

                  {/* NFT Info */}
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
                  >
                    {nftData.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Token ID:</span>
                      <span className="text-white font-semibold">#{nftData.tokenId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Nilai Produk:</span>
                      <span className="text-white font-semibold">{nftData.price.toLocaleString("id-ID")} USDC</span>
                    </div>
                    {nftData.status === "minted" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Nilai Kolateral (70%):</span>
                          <span className="text-white font-semibold">{nftData.collateralValue.toLocaleString("id-ID")} USDC</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Minted At:</span>
                          <span className="text-white font-semibold text-xs">
                            {new Date(nftData.mintedAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </>
                    )}
                    {nftData.status === "pending_payment" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Status:</span>
                        <span className="text-yellow-400 font-semibold">Menunggu Pembayaran</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {nftData.status === "pending_payment" ? (
                    <div className="space-y-2">
                      <button
                        onClick={handlePayWithUSDC}
                        disabled={usdcBalance < nftData.price}
                        className="w-full btn border-0 font-bold disabled:opacity-50"
                        style={goldGradientButton}
                      >
                        <BanknotesIcon className="h-5 w-5" />
                        Bayar dengan USDC ({nftData.price.toLocaleString("id-ID")})
                      </button>
                      <button
                        onClick={handlePayWithQRIS}
                        className="w-full btn bg-white/10 text-white border border-white/20 hover:bg-white/20 font-bold"
                      >
                        <QrCodeIcon className="h-5 w-5" />
                        Bayar dengan QRIS
                      </button>
                      {usdcBalance < nftData.price && (
                        <p className="text-red-400 text-xs mt-2 text-center">
                          Saldo tidak cukup. Kurang {(nftData.price - usdcBalance).toLocaleString("id-ID")} USDC
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      className="w-full btn border-0 font-bold"
                      style={{
                        background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #2563eb 100%)",
                        color: "white",
                      }}
                    >
                      <BanknotesIcon className="h-5 w-5" />
                      Ajukan Pinjaman
                    </button>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 text-center">
                <p className="text-white/50 text-sm">
                  {nftData.status === "pending_payment" 
                    ? "💡 Demo: Bayar dengan USDC atau QRIS untuk mint NFT" 
                    : "💡 Demo: NFT berhasil di-mint dan siap digunakan untuk pinjaman"
                  }
                </p>
                
                {/* Demo Testing Button */}
                <div className="mt-4">
                  <button
                    onClick={handleTogglePaymentStatus}
                    className="btn btn-sm bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30"
                  >
                    🔄 Toggle Status (Testing)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QRIS Modal */}
          {showQRIS && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Scan QRIS untuk Bayar
                </h3>
                
                {/* QR Code Placeholder */}
                <div 
                  className="bg-gray-100 rounded-xl p-8 mb-4 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={handleQRISClick}
                >
                  <div className="aspect-square bg-white rounded-lg flex items-center justify-center border-4 border-gray-300">
                    <QrCodeIcon className="h-48 w-48 text-gray-400" />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-blue-900 font-bold text-center text-xl">
                    {nftData.price.toLocaleString("id-ID")} USDC
                  </p>
                  <p className="text-blue-700 text-sm text-center">
                    Pembayaran Produk - JejaKriya
                  </p>
                </div>

                <p className="text-gray-600 text-sm text-center mb-4">
                  💡 Klik QR Code untuk simulasi pembayaran berhasil
                </p>

                <button
                  onClick={() => setShowQRIS(false)}
                  className="w-full btn btn-outline"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* USDC Payment Modal */}
          {showUSDCPayment && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Konfirmasi Pembayaran USDC
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Harga NFT:</span>
                    <span className="text-gray-900 font-bold text-xl">{nftData.price.toLocaleString("id-ID")} USDC</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Saldo Anda:</span>
                    <span className="text-gray-900 font-bold">{usdcBalance.toLocaleString("id-ID")} USDC</span>
                  </div>
                  <div className="border-t border-gray-300 pt-4 flex items-center justify-between">
                    <span className="text-gray-600">Sisa Saldo:</span>
                    <span className="text-green-600 font-bold text-xl">
                      {(usdcBalance - nftData.price).toLocaleString("id-ID")} USDC
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm text-center mb-6">
                  Apakah Anda yakin ingin membayar dengan USDC?
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowUSDCPayment(false)}
                    className="btn btn-outline"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUSDCPayment}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                  >
                    Bayar Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DemoProfile;
