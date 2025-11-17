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
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { fetchFromIPFS } from "~~/utils/ipfs";
import { notification } from "~~/utils/scaffold-eth";
import { useDemoStore } from "~~/services/store/demoStore";
import QRCode from "qrcode.react";

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

const DemoProfilePage = () => {
  const router = useRouter();
  const { address: connectedAddress, chain } = useAccount();
  const [userLoans, setUserLoans] = useState<LoanInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRepaying, setIsRepaying] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<bigint>(BigInt(0));
  const [loadingUSDC, setLoadingUSDC] = useState(false);

  // Demo store
  const ownedNFTs = useDemoStore(state => state.ownedNFTs);
  const resetDemo = useDemoStore(state => state.resetDemo);

  const { writeContractAsync: writeLendingPool } = useScaffoldWriteContract("LendingPool");
  const { writeContractAsync: writeUSDC } = useScaffoldWriteContract("MockUSDC");

  // Get user's USDC balance
  const { data: usdcBalance, refetch: refetchBalance } = useScaffoldReadContract({
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

  // Fetch user's loans
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
    if (usdcBalance) {
      setUserBalance(usdcBalance);
    }
  }, [usdcBalance]);

  // Handle Get Free USDC
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

  // Handle Repay Loan
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
        className="flex items-center flex-col min-h-screen relative"
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

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <UserCircleIcon className="h-12 w-12" style={{ color: "#E9A507" }} />
                <div>
                  <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                    Profile Demo
                  </h1>
                  <p className="text-white/80 text-lg">Kelola NFT dan pinjaman Anda</p>
                </div>
              </div>

              <button onClick={resetDemo} className="btn btn-outline btn-sm text-white border-white/30 hover:bg-white/10">
                <ArrowPathIcon className="h-4 w-4" />
                Reset Demo
              </button>
            </div>

            {connectedAddress && (
              <div className="mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-white/70 text-sm mb-2">Your Wallet:</p>
                <Address address={connectedAddress} />
              </div>
            )}
          </div>

          {/* USDC Balance & Get Free USDC */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* USDC Balance */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <BanknotesIcon className="h-8 w-8" style={{ color: "#E9A507" }} />
                <h2 className="text-xl font-bold text-white">Saldo USDC</h2>
              </div>

              <div className="text-4xl font-bold mb-2" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                {connectedAddress
                  ? (Number(userBalance) / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2 })
                  : "0.00"}
              </div>
              <p className="text-white/60 text-sm">USDC</p>
            </div>

            {/* Get Free USDC */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <BanknotesIcon className="h-8 w-8 text-green-400" />
                <h2 className="text-xl font-bold text-white">Dapatkan USDC Gratis</h2>
              </div>

              <p className="text-white/70 text-sm mb-4">Untuk keperluan testing dan demo, Anda bisa mendapatkan 1000 USDC gratis.</p>

              <button
                onClick={handleGetFreeUSDC}
                disabled={!connectedAddress || loadingUSDC}
                className="btn w-full border-0 font-bold disabled:opacity-50"
                style={goldGradientButton}
              >
                {loadingUSDC ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Memproses...
                  </>
                ) : (
                  <>
                    <BanknotesIcon className="h-5 w-5" />
                    Dapatkan 1000 USDC
                  </>
                )}
              </button>
            </div>
          </div>

          {/* NFT yang Dimiliki - NEW SECTION */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                NFT yang Dimiliki ({ownedNFTs.length})
              </h2>
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
                        background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
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

          {/* QR Code for Demo Transfer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
              QR Code untuk Demo Transfer
            </h2>
            <p className="text-white/70 mb-6">
              Scan QR Code ini untuk melakukan demo transfer NFT "Tenun Ikat NTT"
            </p>

            <div className="inline-block bg-white p-6 rounded-xl">
              <QRCode value="https://jejakriya.vercel.app/demo/verify/4" size={256} level="H" />
            </div>

            <p className="text-white/60 text-sm mt-4">
              URL: <span className="font-mono text-xs">https://jejakriya.vercel.app/demo/verify/4</span>
            </p>
          </div>

          {/* Lending Statistics */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <LockClosedIcon className="h-10 w-10 mx-auto mb-3" style={{ color: "#E9A507" }} />
              <div className="text-white/60 mb-2">Total Dipinjam</div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                {activeLoans.reduce((sum, loan) => sum + Number(loan.amount), 0).toLocaleString("id-ID")}
              </div>
              <div className="text-white/50 text-sm">USDC</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <ClockIcon className="h-10 w-10 mx-auto mb-3 text-yellow-400" />
              <div className="text-white/60 mb-2">Pinjaman Aktif</div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                {activeLoans.length}
              </div>
              <div className="text-white/50 text-sm">Loan</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <CheckCircleIcon className="h-10 w-10 mx-auto mb-3 text-green-400" />
              <div className="text-white/60 mb-2">Total Lunas</div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                {repaidLoans.length}
              </div>
              <div className="text-white/50 text-sm">Loan</div>
            </div>
          </div>

          {/* Active Loans */}
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
          ) : (
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}>
                Status Lending ({activeLoans.length})
              </h2>

              {activeLoans.length === 0 ? (
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
                      <h3 className="text-lg font-bold mb-2 text-white">{loan.nftName}</h3>

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
          )}

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

                    <h3 className="text-lg font-bold mb-2 text-white/80">{loan.nftName}</h3>

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
        </div>
      </div>
    </>
  );
};

export default DemoProfilePage;
