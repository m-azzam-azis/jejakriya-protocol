"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatEther, parseEther } from "viem";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  UserCircleIcon,
  EyeIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { fetchFromIPFS } from "~~/utils/ipfs";
import { notification } from "~~/utils/scaffold-eth";
import { useDemoStore } from "~~/services/store/demoStore";

type LoanInfo = {
  loanId: string;
  tokenId: string;
  nftName: string;
  nftImage: string;
  amount: bigint;
  startTime: bigint;
  duration: bigint;
  interestRate: bigint;
  isActive: boolean;
  isRepaid: boolean;
  totalRepayment: bigint;
  daysRemaining: number;
  isOverdue: boolean;
};

const CombinedProfilePage = () => {
  const router = useRouter();
  const { address: connectedAddress, chain } = useAccount();
  const [userLoans, setUserLoans] = useState<LoanInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRepaying, setIsRepaying] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<bigint>(BigInt(0));
  const [loadingUSDC, setLoadingUSDC] = useState(false);

  // Demo store and state from first version
  const ownedNFTs = useDemoStore(state => state.ownedNFTs);
  const resetDemo = useDemoStore(state => state.resetDemo);
  const [product, setProduct] = useState<any>(null);
  const [showQRIS, setShowQRIS] = useState(false);
  const [showUSDCPayment, setShowUSDCPayment] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [nftData, setNftData] = useState<any>(null);
  const [usdcBalance, setUsdcBalance] = useState(100000); // Demo balance in USDC (100k)

  const USDC_TO_IDR = 16000; // 1 USDC = Rp 16.000

  const { writeContractAsync: writeLendingPool } = useScaffoldWriteContract("LendingPool");
  const { writeContractAsync: writeUSDC } = useScaffoldWriteContract("MockUSDC");

  // Get user's USDC balance
  const { data: usdcBalanceOnChain, refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  // Get all loan request events
  const { data: loanRequestEvents } = useScaffoldEventHistory({
    contractName: "LendingPool",
    eventName: "LoanRequested",
    fromBlock: 0n,
  });

  // Get loan repaid events
  const { data: loanRepaidEvents } = useScaffoldEventHistory({
    contractName: "LendingPool",
    eventName: "LoanRepaid",
    fromBlock: 0n,
  });

  // Get approved NFT events for metadata
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

  // Load product from localStorage (from first version)
  useEffect(() => {
    const storedProduct = localStorage.getItem("demoProduct");
    if (storedProduct) {
      const prod = JSON.parse(storedProduct);
      setProduct(prod);
      
      // Always create NFT data (either pending payment or minted)
      const baseNftData = {
        tokenId: "1",
        name: prod.name,
        image: prod.images?.[0] || "/keris.png",
        owner: "0xD940...6e37",
        price: prod.price || 100,
        status: prod.status || "pending_payment", // pending_payment or minted
      };

      if (prod.status === "minted") {
        setNftData({
          ...baseNftData,
          mintedAt: prod.mintedAt || new Date().toISOString(),
          collateralValue: Math.floor((prod.price || 100) * 0.7),
        });
      } else {
        // NFT exists but pending payment
        setNftData(baseNftData);
      }
    }
  }, []);

  // Fetch user's loans (from second version)
  useEffect(() => {
    const loadUserLoans = async () => {
      if (!connectedAddress || !loanRequestEvents || !approvedEvents || !requestEvents) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Filter loans for current user
        const userLoanEvents = loanRequestEvents.filter(
          (event: any) => event.args?.borrower?.toLowerCase() === connectedAddress.toLowerCase(),
        );

        if (userLoanEvents.length === 0) {
          setUserLoans([]);
          setIsLoading(false);
          return;
        }

        // Get repaid loan IDs
        const repaidLoanIds = new Set(
          (loanRepaidEvents || [])
            .filter((event: any) => event.args?.borrower?.toLowerCase() === connectedAddress.toLowerCase())
            .map((event: any) => event.args.loanId?.toString()),
        );

        // Process each loan
        const loansWithMetadata = await Promise.all(
          userLoanEvents.map(async (event: any) => {
            const { loanId, tokenId, amount, startTime, duration, interestRate } = event.args;
            const loanIdStr = loanId?.toString() || "";

            // Find the approved event for this tokenId
            const approvedEvent = approvedEvents.find((e: any) => e.args?.tokenId?.toString() === tokenId?.toString());

            let nftName = "Unknown NFT";
            let nftImage = "/placeholder-nft.png";

            if (approvedEvent) {
              const requestId = approvedEvent.args?.requestId;
              const requestEvent = requestEvents.find((e: any) => e.args?.requestId === requestId);

              if (requestEvent) {
                const ipfsHash = requestEvent.args?.ipfsHash;
                if (ipfsHash) {
                  const metadata = await fetchFromIPFS(ipfsHash);
                  if (metadata) {
                    nftName = metadata.name || nftName;
                    if (metadata.photos && metadata.photos.length > 0) {
                      nftImage = metadata.photos[0];
                    }
                  }
                }
              }
            }

            // Calculate total repayment and days remaining
            const principal = BigInt(amount);
            const rate = BigInt(interestRate);
            const interest = (principal * rate) / BigInt(10000);
            const totalRepayment = principal + interest;

            const startTimeNum = Number(startTime);
            const durationNum = Number(duration);
            const endTime = startTimeNum + durationNum;
            const currentTime = Math.floor(Date.now() / 1000);
            const daysRemaining = Math.ceil((endTime - currentTime) / 86400);

            const isRepaid = repaidLoanIds.has(loanIdStr);
            const isOverdue = !isRepaid && currentTime > endTime;

            return {
              loanId: loanIdStr,
              tokenId: tokenId?.toString() || "",
              nftName,
              nftImage,
              amount: BigInt(amount),
              startTime: BigInt(startTime),
              duration: BigInt(duration),
              interestRate: BigInt(interestRate),
              isActive: !isRepaid,
              isRepaid,
              totalRepayment,
              daysRemaining,
              isOverdue,
            };
          }),
        );

        setUserLoans(loansWithMetadata);
      } catch (error) {
        console.error("Error loading loans:", error);
        notification.error("Gagal memuat data pinjaman");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserLoans();
  }, [connectedAddress, loanRequestEvents, loanRepaidEvents, approvedEvents, requestEvents]);

  // Update balance when usdcBalance changes
  useEffect(() => {
    if (usdcBalanceOnChain) {
      setUserBalance(usdcBalanceOnChain);
    }
  }, [usdcBalanceOnChain]);

  // Payment functions from first version
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
    if (usdcBalance < (product?.price || 100)) {
      alert("Saldo USDC tidak cukup!");
      return;
    }
    await processPayment();
  };

  const processPayment = async () => {
    if (!product) return;
    
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
      image: product.images?.[0] || "/keris.png",
      owner: "0xD940...6e37",
      price: product.price,
      status: "minted",
      mintedAt: new Date().toISOString(),
      collateralValue: Math.floor(product.price * 0.7),
    });

    setIsPaying(false);
  };

  // Functions from second version
  const handleGetFreeUSDC = async () => {
    if (!connectedAddress) {
      notification.error("Silakan connect wallet terlebih dahulu");
      return;
    }

    try {
      setLoadingUSDC(true);
      notification.info("Meminta USDC gratis...");

      await writeUSDC({
        functionName: "mint",
        args: [connectedAddress, parseEther("1000")],
      });

      notification.success("Berhasil mendapatkan 1000 USDC!");

      // Refetch balance
      setTimeout(() => {
        refetchBalance();
      }, 2000);
    } catch (error) {
      console.error("Error getting free USDC:", error);
      notification.error("Gagal mendapatkan USDC gratis");
    } finally {
      setLoadingUSDC(false);
    }
  };

  const handleRepayLoan = async (loan: LoanInfo) => {
    if (!connectedAddress) {
      notification.error("Silakan connect wallet terlebih dahulu");
      return;
    }

    if (userBalance < loan.totalRepayment) {
      notification.error("Saldo USDC tidak cukup untuk melunasi pinjaman");
      return;
    }

    try {
      setIsRepaying(loan.loanId);
      notification.info("Memproses pembayaran...");

      // Step 1: Approve USDC spending
      notification.info("Menyetujui penggunaan USDC...");
      const lendingPoolAddress =
        chain?.id === hardhat.id
          ? deployedContracts[hardhat.id].LendingPool.address
          : deployedContracts[hardhat.id].LendingPool.address;

      await writeUSDC({
        functionName: "approve",
        args: [lendingPoolAddress, loan.totalRepayment],
      });

      // Step 2: Repay loan
      notification.info("Melunasi pinjaman...");
      await writeLendingPool({
        functionName: "repayLoan",
        args: [BigInt(loan.loanId)],
      });

      notification.success(`Pinjaman #${loan.loanId} berhasil dilunasi! NFT sudah kembali ke wallet Anda.`);

      // Refetch data
      setTimeout(() => {
        refetchBalance();
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      console.error("Error repaying loan:", error);
      notification.error(`Gagal melunasi pinjaman: ${error.message}`);
    } finally {
      setIsRepaying(null);
    }
  };

  // Toggle payment status (for demo testing) from first version
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
        image: product.images?.[0] || "/keris.png",
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
        image: product.images?.[0] || "/keris.png",
        owner: "0xD940...6e37",
        price: product.price,
        status: "pending_payment",
      });
    }
  };

  // Styling
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

  // Split active and repaid loans
  const activeLoans = userLoans.filter(loan => loan.isActive);
  const repaidLoans = userLoans.filter(loan => loan.isRepaid);

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
              Kelola dana, NFT, dan pinjaman Anda
            </p>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-md mx-auto">
              <p className="text-white/70 text-sm mb-2">Wallet Address:</p>
              {connectedAddress ? (
                <Address address={connectedAddress} />
              ) : (
                <p className="text-white font-mono font-semibold">0xD940...6e37</p>
              )}
            </div>
          </div>

          {/* Balance & Stats */}
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
              
              {/* Show both demo and real balance */}
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold mb-1" style={{ ...goldGradientText }}>
                    {usdcBalance.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                  </div>
                  <p className="text-white/60 text-sm mb-2">≈ Rp {(usdcBalance * USDC_TO_IDR).toLocaleString("id-ID")}</p>
                  <p className="text-white/60 text-xs">Demo Balance</p>
                </div>

                {connectedAddress && (
                  <div className="border-t border-white/20 pt-4">
                    <div className="text-xl font-bold mb-1 text-blue-400">
                      {connectedAddress
                        ? (Number(userBalance) / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : "0.00"} USDC
                    </div>
                    <p className="text-white/60 text-xs">On-chain Balance</p>
                    
                    {/* Tombol Get USDC - hanya muncul di localhost */}
                    {chain?.id === hardhat.id && (
                      <button
                        onClick={handleGetFreeUSDC}
                        disabled={loadingUSDC}
                        className="btn btn-sm w-full mt-2 border-0 font-bold"
                        style={{
                          background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #2563eb 100%)",
                          color: "white",
                        }}
                      >
                        {loadingUSDC ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <BanknotesIcon className="h-4 w-4" />
                            Get 1,000 USDC
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <LockClosedIcon className="h-8 w-8 text-blue-400" />
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
                >
                  Statistik
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Total NFT:</span>
                  <span className="font-bold text-white">{(nftData ? 1 : 0) + ownedNFTs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Sudah Minted:</span>
                  <span className="font-bold text-green-400">{(nftData?.status === "minted" ? 1 : 0) + ownedNFTs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Menunggu Pembayaran:</span>
                  <span className="font-bold text-yellow-400">{nftData?.status === "pending_payment" ? 1 : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Pinjaman Aktif:</span>
                  <span className="font-bold text-blue-400">{activeLoans.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NFT yang Dimiliki dari Demo Store */}
          {ownedNFTs.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-3xl font-bold"
                  style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
                >
                  NFT yang Dimiliki ({ownedNFTs.length})
                </h2>
                <button onClick={resetDemo} className="btn btn-outline btn-sm text-white border-white/30 hover:bg-white/10">
                  <ArrowPathIcon className="h-4 w-4" />
                  Reset Demo
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedNFTs.map(nft => (
                  <Link href={`/demo/nft/${nft.id}`} key={nft.id}>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
                      <div className="relative h-48 mb-3 rounded-lg overflow-hidden">
                        <Image src={nft.imageUrl} alt={nft.name} fill className="object-cover" />
                        {nft.verified && (
                          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                            <CheckBadgeIcon className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>

                      <h3
                        className="text-lg font-bold mb-1"
                        style={{
                          fontFamily: "'Mileast', sans-serif",
                          ...goldGradientText,
                        }}
                      >
                        {nft.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-1">Oleh: {nft.pengrajinName}</p>
                      <p className="text-white/50 text-xs mb-1">Kategori: {nft.category}</p>
                      <p className="text-white/50 text-xs">
                        Minted: {new Date(nft.mintedAt).toLocaleDateString("id-ID")}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: "#E9A507" }}>
                        <EyeIcon className="h-4 w-4" />
                        <span>Lihat Detail</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Demo NFT dari localStorage */}
          {nftData && (
            <div className="mb-8">
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
              >
                Demo NFT Produk
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
                        Bayar dengan USDC ({nftData.price.toLocaleString("id-ID")} USDC)
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

              {/* Demo Testing Controls */}
              <div className="mt-6 text-center">
                <p className="text-white/50 text-sm mb-4">
                  {nftData.status === "pending_payment" 
                    ? "💡 Demo: Bayar dengan USDC atau QRIS untuk mint NFT" 
                    : "💡 Demo: NFT berhasil di-mint dan siap digunakan untuk pinjaman"
                  }
                </p>
                
                {/* Demo Testing Button */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleTogglePaymentStatus}
                    className="btn btn-sm bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30"
                  >
                    🔄 Toggle Status (Testing)
                  </button>
                  
                  {!product && (
                    <button
                      onClick={() => {
                        const demoProduct = {
                          name: "Keris Majapahit Kuno",
                          images: ["/keris.png"],
                          price: 100,
                          status: "pending_payment"
                        };
                        localStorage.setItem("demoProduct", JSON.stringify(demoProduct));
                        setProduct(demoProduct);
                        setNftData({
                          tokenId: "1",
                          name: demoProduct.name,
                          image: demoProduct.images[0],
                          owner: "0xD940...6e37",
                          price: demoProduct.price,
                          status: "pending_payment",
                        });
                      }}
                      className="btn btn-sm bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30"
                    >
                      🎨 Create Demo Product
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Loans Section */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
            >
              Pinjaman Aktif
            </h2>

            {!connectedAddress ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
                <UserCircleIcon className="h-16 w-16 mx-auto mb-4" style={{ color: "#E9A507" }} />
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                  Silakan Connect Wallet
                </h3>
                <p className="text-white/70">Connect wallet Anda untuk melihat status pinjaman dan mengelola NFT.</p>
              </div>
            ) : isLoading ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
                <span className="loading loading-spinner loading-lg" style={{ color: "#E9A507" }}></span>
                <p className="text-white/70 mt-4">Memuat data pinjaman...</p>
              </div>
            ) : activeLoans.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
                <CheckCircleIcon className="h-16 w-16 mx-auto mb-4" style={{ color: "#E9A507" }} />
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                  Tidak Ada Pinjaman Aktif
                </h3>
                <p className="text-white/70 mb-6">
                  Anda belum memiliki pinjaman aktif. Gunakan NFT Anda sebagai jaminan untuk mendapatkan pinjaman.
                </p>
                <Link href="/lending" className="btn border-0 font-bold" style={goldGradientButton}>
                  Ajukan Pinjaman
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeLoans.map(loan => (
                  <div
                    key={loan.loanId}
                    className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border ${loan.isOverdue ? "border-red-500/50" : "border-white/10"}`}
                  >
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      {loan.isOverdue ? (
                        <>
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                          <span className="text-red-400 font-bold text-sm">TERLAMBAT</span>
                        </>
                      ) : (
                        <>
                          <ClockIcon className="h-6 w-6 text-yellow-400" />
                          <span className="text-yellow-400 font-bold text-sm">AKTIF</span>
                        </>
                      )}
                    </div>

                    {/* NFT Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={loan.nftImage}
                        alt={loan.nftName}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-nft.png";
                        }}
                      />
                      <h3 className="text-lg font-bold text-white flex-1">{loan.nftName}</h3>
                    </div>

                    {/* Loan Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Loan ID:</span>
                        <span className="text-white font-semibold">#{loan.loanId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Dipinjam:</span>
                        <span className="text-white font-semibold">
                          {(Number(loan.amount) / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2 })} USDC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Bunga:</span>
                        <span className="text-white font-semibold">{Number(loan.interestRate) / 100}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Total Bayar:</span>
                        <span className="text-yellow-400 font-bold">
                          {(Number(loan.totalRepayment) / 1_000_000).toLocaleString("id-ID", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          USDC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Sisa Waktu:</span>
                        <span
                          className={`font-semibold ${loan.isOverdue ? "text-red-400" : loan.daysRemaining < 7 ? "text-yellow-400" : "text-green-400"}`}
                        >
                          {loan.isOverdue
                            ? `Terlambat ${Math.abs(loan.daysRemaining)} hari`
                            : `${loan.daysRemaining} hari`}
                        </span>
                      </div>
                    </div>

                    {/* Repay Button */}
                    <button
                      onClick={() => handleRepayLoan(loan)}
                      disabled={isRepaying === loan.loanId || userBalance < loan.totalRepayment}
                      className="w-full btn border-0 font-bold disabled:opacity-50"
                      style={goldGradientButton}
                    >
                      {isRepaying === loan.loanId ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Memproses...
                        </>
                      ) : userBalance < loan.totalRepayment ? (
                        <>
                          <ExclamationTriangleIcon className="h-5 w-5" />
                          Saldo Tidak Cukup
                        </>
                      ) : (
                        <>
                          <ArrowPathIcon className="h-5 w-5" />
                          Lunasi & Ambil NFT
                        </>
                      )}
                    </button>

                    {userBalance < loan.totalRepayment && (
                      <p className="text-red-400 text-xs mt-2 text-center">
                        Kurang{" "}
                        {(Number(loan.totalRepayment - userBalance) / 1_000_000).toLocaleString("id-ID", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        USDC
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Repaid Loans History */}
          {repaidLoans.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                Riwayat Pinjaman Selesai
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repaidLoans.map(loan => (
                  <div
                    key={loan.loanId}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 opacity-60"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircleIcon className="h-6 w-6 text-green-400" />
                      <span className="text-green-400 font-bold text-sm">LUNAS</span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={loan.nftImage}
                        alt={loan.nftName}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-nft.png";
                        }}
                      />
                      <h3 className="text-lg font-bold text-white/80 flex-1">{loan.nftName}</h3>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Loan ID:</span>
                        <span className="text-white/70">#{loan.loanId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Dibayar:</span>
                        <span className="text-white/70">
                          {(Number(loan.totalRepayment) / 1_000_000).toLocaleString("id-ID", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          USDC
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                
                {/* QR Code Image */}
                <div 
                  className="bg-white rounded-xl p-4 mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handleQRISClick}
                >
                  <img
                    src="/JejaKriyaQris.png"
                    alt="QRIS Payment"
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-blue-900 font-bold text-center text-xl">
                    Rp {((nftData?.price || 100) * USDC_TO_IDR).toLocaleString("id-ID")}
                  </p>
                  <p className="text-blue-700 text-sm text-center">
                    Pembayaran Produk - JejaKriya ({(nftData?.price || 100).toLocaleString("id-ID")} USDC)
                  </p>
                </div>

                <p className="text-gray-600 text-sm text-center mb-4">
                  💡 Klik QR Code untuk simulasi pembayaran berhasil
                </p>

                <button
                  onClick={() => setShowQRIS(false)}
                  className="w-full btn bg-red-600 hover:bg-red-700 text-white border-none"
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Harga NFT:</span>
                    <div className="text-right">
                      <p className="text-gray-900 font-bold text-xl">{(nftData?.price || 100).toLocaleString("id-ID")} USDC</p>
                      <p className="text-gray-500 text-sm">≈ Rp {((nftData?.price || 100) * USDC_TO_IDR).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Saldo Anda:</span>
                    <div className="text-right">
                      <p className="text-gray-900 font-bold">{usdcBalance.toLocaleString("id-ID")} USDC</p>
                      <p className="text-gray-500 text-sm">≈ Rp {(usdcBalance * USDC_TO_IDR).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 pt-4 flex items-center justify-between">
                    <span className="text-gray-600">Sisa Saldo:</span>
                    <div className="text-right">
                      <p className="text-green-600 font-bold text-xl">
                        {(usdcBalance - (nftData?.price || 100)).toLocaleString("id-ID")} USDC
                      </p>
                      <p className="text-green-600 text-sm">≈ Rp {((usdcBalance - (nftData?.price || 100)) * USDC_TO_IDR).toLocaleString("id-ID")}</p>
                    </div>
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

export default CombinedProfilePage;