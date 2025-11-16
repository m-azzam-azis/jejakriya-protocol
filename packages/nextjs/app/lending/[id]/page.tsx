"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { fetchFromIPFS } from "~~/utils/ipfs";
import { parseEther, formatEther } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";

type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  curator: string;
  artisan: string;
  estimatedPrice: number;
  attributes?: Array<{ trait_type: string; value: any }>;
  properties?: {
    images?: string[];
    estimatedPrice?: number;
  };
};

const LendingDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  
  const [loanAmount, setLoanAmount] = useState("");
  const [loanDuration, setLoanDuration] = useState("30"); // days
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNFTLocked, setIsNFTLocked] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const tokenId = params.id as string;
  const maxLTV = 70; // 70% LTV
  const interestRate = 12; // 12% APY
  const protocolFee = 2; // 2% APY
  const lpRate = 10; // 10% APY for liquidity providers

  // Get LendingPool address from deployedContracts
  const lendingPoolAddress = deployedContracts[31337]?.LendingPool?.address as `0x${string}` | undefined;

  // Check if NFT is locked in lending pool
  const { data: isLocked } = useScaffoldReadContract({
    contractName: "LendingPool",
    functionName: "isNFTLocked",
    args: [BigInt(tokenId || "0")],
  });

  // Get NFT owner
  const { data: nftOwner } = useScaffoldReadContract({
    contractName: "ICAS721",
    functionName: "ownerOf",
    args: [BigInt(tokenId || "0")],
  });

  // Check if NFT is approved for LendingPool
  const { data: approvedAddress, refetch: refetchApproval } = useScaffoldReadContract({
    contractName: "ICAS721",
    functionName: "getApproved",
    args: [BigInt(tokenId || "0")],
  });

  const { writeContractAsync: writeLendingPool } = useScaffoldWriteContract("LendingPool");
  const { writeContractAsync: writeICAS721 } = useScaffoldWriteContract("ICAS721");

  // Get approved events to find metadata
  const { data: approvedEvents } = useScaffoldEventHistory({
    contractName: "ICAS721",
    eventName: "MintApproved",
    fromBlock: 0n,
  });

  const { data: requestEvents } = useScaffoldEventHistory({
    contractName: "ICAS721",
    eventName: "MintRequested",
    fromBlock: 0n,
  });

  // Fetch NFT metadata
  useEffect(() => {
    const loadNFTData = async () => {
      if (!approvedEvents || !requestEvents || !tokenId) return;

      try {
        setIsLoading(true);

        // Find the approved event for this token ID
        const approvedEvent = approvedEvents.find(
          (event: any) => event.args?.tokenId?.toString() === tokenId
        );

        if (!approvedEvent) {
          console.error("NFT not found");
          setIsLoading(false);
          return;
        }

        const requestId = approvedEvent.args?.requestId;
        
        // Find the corresponding request event
        const requestEvent = requestEvents.find(
          (event: any) => event.args?.requestId === requestId
        );

        if (!requestEvent) {
          console.error("Request event not found");
          setIsLoading(false);
          return;
        }

        const ipfsHash = requestEvent.args?.ipfsHash;
        const artisan = requestEvent.args?.artisan;

        if (!ipfsHash) {
          console.error("IPFS hash not found");
          setIsLoading(false);
          return;
        }

        // Fetch metadata from IPFS
        const metadata = await fetchFromIPFS(ipfsHash);
        
        if (!metadata) {
          console.error("Failed to fetch metadata");
          setIsLoading(false);
          return;
        }

        // Extract image URL
        let imageUrl = "/keris.png";
        if (metadata.properties?.images?.[0]) {
          const img = metadata.properties.images[0];
          if (img.startsWith('ipfs://')) {
            imageUrl = img.replace('ipfs://', 'https://ipfs.io/ipfs/');
          } else if (img.startsWith('Qm') || img.startsWith('bafy')) {
            imageUrl = `https://ipfs.io/ipfs/${img}`;
          } else {
            imageUrl = img;
          }
        } else if (metadata.image) {
          const img = metadata.image;
          if (img.startsWith('ipfs://')) {
            imageUrl = img.replace('ipfs://', 'https://ipfs.io/ipfs/');
          } else if (img.startsWith('Qm') || img.startsWith('bafy')) {
            imageUrl = `https://ipfs.io/ipfs/${img}`;
          } else {
            imageUrl = img;
          }
        }

        // Extract estimated price
        const estimatedPrice = 
          metadata.attributes?.find((a: any) => a.trait_type === "Estimated Price")?.value ||
          metadata.properties?.estimatedPrice ||
          5000;

        setNftMetadata({
          name: metadata.name || `NFT #${tokenId}`,
          description: metadata.description || metadata.ceritaProduk || "",
          image: imageUrl,
          curator: "Ibu Wati", // Default curator
          artisan: artisan || "Unknown Artisan",
          estimatedPrice: parseInt(String(estimatedPrice)),
          attributes: metadata.attributes,
          properties: metadata.properties,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading NFT data:", error);
        setIsLoading(false);
      }
    };

    loadNFTData();
  }, [tokenId, approvedEvents?.length, requestEvents?.length]); // Only re-run when counts change

  // Update locked status
  useEffect(() => {
    if (isLocked !== undefined) {
      setIsNFTLocked(!!isLocked);
    }
  }, [isLocked]);

  // Check if NFT is approved
  useEffect(() => {
    if (approvedAddress && lendingPoolAddress) {
      setIsApproved(approvedAddress.toLowerCase() === lendingPoolAddress.toLowerCase());
    } else {
      setIsApproved(false);
    }
  }, [approvedAddress, lendingPoolAddress]);

  const collateralValue = nftMetadata?.estimatedPrice || 5000;
  const maxLoanAmount = (collateralValue * maxLTV) / 100;

  // Calculate interest
  const calculateInterest = () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) return 0;
    const principal = parseFloat(loanAmount);
    const days = parseInt(loanDuration);
    const dailyRate = interestRate / 365 / 100;
    return principal * dailyRate * days;
  };

  const totalRepayment = () => {
    const principal = parseFloat(loanAmount) || 0;
    return principal + calculateInterest();
  };

  const currentLTV = () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) return 0;
    return (parseFloat(loanAmount) / collateralValue) * 100;
  };

  const handleApproveNFT = async () => {
    if (!connectedAddress) {
      notification.error("Please connect your wallet");
      return;
    }

    if (!lendingPoolAddress) {
      notification.error("LendingPool contract not found");
      return;
    }

    if (nftOwner?.toLowerCase() !== connectedAddress.toLowerCase()) {
      notification.error("You don't own this NFT");
      return;
    }

    try {
      setIsApproving(true);

      await writeICAS721({
        functionName: "approve",
        args: [lendingPoolAddress, BigInt(tokenId)],
      });

      notification.success("NFT approved successfully! You can now request a loan.");
      
      // Refetch approval status
      setTimeout(() => {
        refetchApproval();
      }, 2000);
    } catch (error: any) {
      console.error("Error approving NFT:", error);
      notification.error(error?.message || "Failed to approve NFT");
    } finally {
      setIsApproving(false);
    }
  };

    const handleSubmitLoan = async () => {
    if (!connectedAddress) {
      notification.error("Please connect your wallet");
      return;
    }

    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      notification.error("Please enter a valid loan amount");
      return;
    }

    if (parseFloat(loanAmount) > maxLoanAmount) {
      notification.error(`Maximum loan amount is ${maxLoanAmount} USDC (${maxLTV}% LTV)`);
      return;
    }

    if (isNFTLocked) {
      notification.error("This NFT is already locked in an active loan");
      return;
    }

    if (nftOwner?.toLowerCase() !== connectedAddress.toLowerCase()) {
      notification.error("You don't own this NFT");
      return;
    }

    if (!isApproved) {
      notification.error("Please approve NFT first");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert USDC amount to proper format (6 decimals)
      const amountInUSDC = BigInt(Math.floor(parseFloat(loanAmount) * 1_000_000));
      const durationInDays = BigInt(loanDuration);

      // Call smart contract function
      await writeLendingPool({
        functionName: "requestLoan",
        args: [BigInt(tokenId), amountInUSDC, durationInDays],
      });

      notification.success("Loan request submitted successfully! NFT is now locked.");
      
      // Redirect after success
      setTimeout(() => {
        router.push("/lending");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting loan:", error);
      notification.error(error?.message || "Failed to submit loan request");
    } finally {
      setIsSubmitting(false);
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

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
      `}</style>

      <div
        className="flex flex-col min-h-screen relative text-white"
        style={{
          background: "#0D0D0D",
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
            backgroundSize: "100% auto",
            zIndex: 0,
            opacity: 0.7,
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 pt-[120px]">
          {/* Back Button */}
          <button
            onClick={() => router.push("/lending")}
            className="flex items-center gap-2 text-white/70 hover:text-yellow-400 transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali ke Galeri
          </button>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="loading loading-spinner loading-lg text-yellow-400"></div>
                <p className="mt-4 text-white/70">Loading NFT data...</p>
              </div>
            </div>
          ) : !nftMetadata ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-xl text-white/70">NFT not found</p>
                <button
                  onClick={() => router.push("/lending")}
                  className="mt-4 px-6 py-2 rounded-lg font-bold"
                  style={goldGradientButton}
                >
                  Back to Gallery
                </button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - NFT Info */}
            <div className="space-y-6">
              {/* NFT Image */}
              <div className="bg-purple-950/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-800/50">
                {isNFTLocked && (
                  <div className="bg-red-500/90 text-white px-4 py-2 flex items-center gap-2">
                    <LockClosedIcon className="h-5 w-5" />
                    <span className="font-semibold">NFT Terkunci - Sedang dalam Pinjaman Aktif</span>
                  </div>
                )}
                <img
                  src={nftMetadata.image}
                  alt={nftMetadata.name}
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* NFT Details */}
              <div className="bg-purple-950/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/50">
                <h2 className="text-2xl font-bold mb-4" style={goldGradientText}>
                  Detail NFT Kolateral
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Nama Aset</span>
                    <span className="font-semibold">{nftMetadata.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Token ID</span>
                    <span className="font-semibold">#{tokenId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Kurator</span>
                    <span className="font-semibold">{nftMetadata.curator}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Pengrajin</span>
                    <span className="font-semibold">{nftMetadata.artisan}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Nilai Kolateral</span>
                    <span className="font-bold text-xl" style={goldGradientText}>
                      {collateralValue.toLocaleString()} USDC
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Max LTV</span>
                    <span className="font-semibold text-green-400">{maxLTV}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/60">Status</span>
                    <span className={`font-semibold flex items-center gap-2 ${isNFTLocked ? 'text-red-400' : 'text-green-400'}`}>
                      {isNFTLocked ? (
                        <>
                          <LockClosedIcon className="h-4 w-4" />
                          Terkunci
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-4 w-4" />
                          Tersedia
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold mb-1">NFT sebagai Jaminan</p>
                    <p className="text-blue-200/80">
                      {isNFTLocked 
                        ? "NFT ini sedang terkunci dalam pinjaman aktif. Tidak dapat digunakan untuk pinjaman baru sampai pinjaman sebelumnya dilunasi."
                        : "NFT Anda akan dikunci sebagai kolateral sampai pinjaman dilunasi. Jika gagal membayar, NFT dapat dilikuidasi."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Loan Form */}
            <div className="space-y-6">
              <div className="bg-purple-950/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-800/50">
                <h1 className="text-3xl font-bold mb-2" style={goldGradientText}>
                  Ajukan Pinjaman
                </h1>
                <p className="text-white/70 mb-6">
                  Gunakan NFT Anda sebagai jaminan untuk mendapatkan pinjaman dengan bunga rendah
                </p>

                {/* Loan Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/70 mb-2">Jumlah Pinjaman (USDC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={e => setLoanAmount(e.target.value)}
                      placeholder="0.00"
                      max={maxLoanAmount}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">USDC</div>
                  </div>
                  <div className="mt-2 text-sm text-white/50">
                    Maximum: {maxLoanAmount.toLocaleString()} USDC ({maxLTV}% LTV)
                  </div>
                </div>

                {/* Duration Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/70 mb-2">Durasi Pinjaman (Hari)</label>
                  <select
                    value={loanDuration}
                    onChange={e => setLoanDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:ring-yellow-400"
                  >
                    <option value="7">7 Hari</option>
                    <option value="14">14 Hari</option>
                    <option value="30">30 Hari</option>
                    <option value="60">60 Hari</option>
                    <option value="90">90 Hari</option>
                  </select>
                </div>

                {/* LTV Indicator */}
                {loanAmount && parseFloat(loanAmount) > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white/70">Current LTV</span>
                      <span
                        className={`text-sm font-semibold ${
                          currentLTV() <= maxLTV ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {currentLTV().toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          currentLTV() <= maxLTV
                            ? "bg-gradient-to-r from-green-500 to-green-400"
                            : "bg-gradient-to-r from-red-500 to-red-400"
                        }`}
                        style={{ width: `${Math.min(currentLTV(), 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Loan Summary */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
                  <h3 className="font-semibold text-lg mb-3" style={goldGradientText}>
                    Ringkasan Pinjaman
                  </h3>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Jumlah Pinjaman</span>
                    <span className="font-semibold">{parseFloat(loanAmount || "0").toLocaleString()} USDC</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Bunga ({interestRate}% APY)</span>
                    <span className="font-semibold">{calculateInterest().toFixed(2)} USDC</span>
                  </div>

                  <div className="flex justify-between items-center text-sm text-white/50">
                    <span>• LP Mendapat ({lpRate}% APY)</span>
                    <span>{((calculateInterest() * lpRate) / interestRate).toFixed(2)} USDC</span>
                  </div>

                  <div className="flex justify-between items-center text-sm text-white/50">
                    <span>• Biaya Protokol ({protocolFee}% APY)</span>
                    <span>{((calculateInterest() * protocolFee) / interestRate).toFixed(2)} USDC</span>
                  </div>

                  <div className="flex justify-between items-center text-sm border-t border-white/10 pt-2">
                    <span className="text-white/60">Durasi</span>
                    <span className="font-semibold">{loanDuration} Hari</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="font-semibold">Total Pelunasan</span>
                    <span className="font-bold text-xl" style={goldGradientText}>
                      {totalRepayment().toFixed(2)} USDC
                    </span>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-200">
                      <p className="font-semibold mb-2">Proses Pengajuan Pinjaman (2 Step):</p>
                      <ol className="space-y-1 text-yellow-200/80 list-decimal list-inside">
                        <li>Approve NFT untuk LendingPool contract</li>
                        <li>Ajukan pinjaman dengan jumlah dan durasi yang diinginkan</li>
                      </ol>
                      <p className="mt-2 font-semibold">Syarat & Ketentuan:</p>
                      <ul className="space-y-1 text-yellow-200/80 list-disc list-inside">
                        <li>NFT akan dikunci sebagai kolateral</li>
                        <li>Bunga 12% APY (10% untuk LP, 2% biaya protokol)</li>
                        <li>Pembayaran harus dilakukan sebelum jatuh tempo</li>
                        <li>Gagal bayar dapat mengakibatkan likuidasi NFT</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                {!isApproved && connectedAddress && nftOwner?.toLowerCase() === connectedAddress?.toLowerCase() && !isNFTLocked ? (
                  <button
                    onClick={handleApproveNFT}
                    disabled={isApproving}
                    className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-3"
                    style={goldGradientButton}
                  >
                    {isApproving ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        Approving NFT...
                      </span>
                    ) : (
                      "1. Approve NFT untuk Lending Pool"
                    )}
                  </button>
                ) : null}

                <button
                  onClick={handleSubmitLoan}
                  disabled={
                    isSubmitting ||
                    !connectedAddress ||
                    !loanAmount ||
                    parseFloat(loanAmount) <= 0 ||
                    currentLTV() > maxLTV ||
                    isNFTLocked ||
                    nftOwner?.toLowerCase() !== connectedAddress?.toLowerCase() ||
                    !isApproved
                  }
                  className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={goldGradientButton}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Memproses...
                    </span>
                  ) : !connectedAddress ? (
                    "Hubungkan Wallet"
                  ) : isNFTLocked ? (
                    "NFT Sudah Terkunci"
                  ) : nftOwner?.toLowerCase() !== connectedAddress?.toLowerCase() ? (
                    "Anda Bukan Pemilik NFT"
                  ) : !isApproved ? (
                    "2. Ajukan Pinjaman (Approve NFT Dulu)"
                  ) : currentLTV() > maxLTV ? (
                    "LTV Melebihi Maksimum"
                  ) : (
                    isApproved ? "2. Ajukan Pinjaman" : "Ajukan Pinjaman"
                  )}
                </button>

                {!connectedAddress && (
                  <p className="text-center text-sm text-white/50 mt-3">
                    Silakan hubungkan wallet untuk melanjutkan
                  </p>
                )}
                {isNFTLocked && (
                  <p className="text-center text-sm text-red-400 mt-3">
                    NFT ini sedang digunakan dalam pinjaman aktif
                  </p>
                )}
                {connectedAddress && nftOwner && nftOwner.toLowerCase() !== connectedAddress.toLowerCase() && (
                  <p className="text-center text-sm text-red-400 mt-3">
                    Hanya pemilik NFT yang dapat mengajukan pinjaman
                  </p>
                )}
                {!isApproved && connectedAddress && nftOwner?.toLowerCase() === connectedAddress?.toLowerCase() && !isNFTLocked && (
                  <p className="text-center text-sm text-yellow-400 mt-3">
                    ⚠️ Anda harus approve NFT terlebih dahulu sebelum bisa mengajukan pinjaman
                  </p>
                )}
                {isApproved && connectedAddress && nftOwner?.toLowerCase() === connectedAddress?.toLowerCase() && (
                  <p className="text-center text-sm text-green-400 mt-3">
                    ✅ NFT sudah di-approve. Anda bisa mengajukan pinjaman sekarang!
                  </p>
                )}
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-950/20 backdrop-blur-sm rounded-xl p-4 border border-purple-800/50">
                  <BanknotesIcon className="h-8 w-8 text-yellow-400 mb-2" />
                  <p className="text-sm font-semibold mb-1">Bunga Rendah</p>
                  <p className="text-xs text-white/60">Hanya 12% APY</p>
                </div>
                <div className="bg-purple-950/20 backdrop-blur-sm rounded-xl p-4 border border-purple-800/50">
                  <ClockIcon className="h-8 w-8 text-yellow-400 mb-2" />
                  <p className="text-sm font-semibold mb-1">Fleksibel</p>
                  <p className="text-xs text-white/60">Durasi 7-90 hari</p>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LendingDetailPage;
