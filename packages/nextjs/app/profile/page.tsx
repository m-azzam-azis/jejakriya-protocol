"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import {
  UserCircleIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { formatEther, parseEther } from "viem";
import { fetchFromIPFS } from "~~/utils/ipfs";
import deployedContracts from "~~/contracts/deployedContracts";
import { hardhat } from "viem/chains";

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

const ProfilePage = () => {
  const router = useRouter();
  const { address: connectedAddress, chain } = useAccount();
  const [userLoans, setUserLoans] = useState<LoanInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRepaying, setIsRepaying] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<bigint>(BigInt(0));
  const [loadingUSDC, setLoadingUSDC] = useState(false);

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
          (event: any) => event.args?.borrower?.toLowerCase() === connectedAddress.toLowerCase()
        );

        // Get repaid loan IDs
        const repaidLoanIds = new Set(
          loanRepaidEvents?.map((e: any) => e.args?.loanId?.toString()) || []
        );

        const loans: LoanInfo[] = [];

        for (const event of userLoanEvents) {
          const loanId = event.args?.loanId?.toString();
          const tokenId = event.args?.tokenId?.toString();
          const amount = event.args?.amount;
          const duration = event.args?.duration;

          if (!loanId || !tokenId) continue;

          // Check if loan is repaid
          const isRepaid = repaidLoanIds.has(loanId);

          // Get NFT metadata
          const approvedEvent = approvedEvents.find(
            (e: any) => e.args?.tokenId?.toString() === tokenId
          );

          let nftName = `NFT #${tokenId}`;
          let nftImage = "/keris.png";

          if (approvedEvent) {
            const requestId = approvedEvent.args?.requestId;
            const requestEvent = requestEvents.find(
              (e: any) => e.args?.requestId === requestId
            );

            if (requestEvent) {
              const ipfsHash = requestEvent.args?.ipfsHash;
              if (ipfsHash) {
                const metadata = await fetchFromIPFS(ipfsHash);
                if (metadata) {
                  nftName = metadata.name || nftName;
                  
                  // Extract image
                  if (metadata.properties?.images?.[0]) {
                    const img = metadata.properties.images[0];
                    if (img.startsWith('ipfs://')) {
                      nftImage = img.replace('ipfs://', 'https://ipfs.io/ipfs/');
                    } else if (img.startsWith('Qm') || img.startsWith('bafy')) {
                      nftImage = `https://ipfs.io/ipfs/${img}`;
                    } else {
                      nftImage = img;
                    }
                  } else if (metadata.image) {
                    const img = metadata.image;
                    if (img.startsWith('ipfs://')) {
                      nftImage = img.replace('ipfs://', 'https://ipfs.io/ipfs/');
                    } else if (img.startsWith('Qm') || img.startsWith('bafy')) {
                      nftImage = `https://ipfs.io/ipfs/${img}`;
                    } else {
                      nftImage = img;
                    }
                  }
                }
              }
            }
          }

          // Calculate repayment amount
          // Handle both old format (18 decimals) and new format (6 decimals)
          const principal = amount || BigInt(0);
          
          // If amount is very large (> 1 trillion), it's in old ETH format (18 decimals)
          // Convert to USDC format (6 decimals) by dividing by 10^12
          const adjustedPrincipal = principal > BigInt(1_000_000_000_000) 
            ? principal / BigInt(1_000_000_000_000) 
            : principal;
          
          const interestRate = BigInt(1200); // 12% APY in basis points
          const days = duration || BigInt(30);
          const interest = (adjustedPrincipal * interestRate * days) / BigInt(365 * 10000);
          const totalRepayment = adjustedPrincipal + interest;

          // Calculate days remaining (using current time as estimate since we don't have exact start time from event)
          const now = Math.floor(Date.now() / 1000);
          const durationDays = Number(duration || 30);
          const durationSeconds = durationDays * 24 * 60 * 60;
          // Estimate: assume loan was just made recently for demo purposes
          const estimatedStartTime = now - (5 * 24 * 60 * 60); // 5 days ago
          const endTime = estimatedStartTime + durationSeconds;
          const daysRemaining = Math.ceil((endTime - now) / (24 * 60 * 60));
          const isOverdue = daysRemaining < 0;

          loans.push({
            loanId,
            tokenId,
            nftName,
            nftImage,
            amount: adjustedPrincipal,
            startTime: BigInt(estimatedStartTime),
            duration: days,
            interestRate,
            isActive: !isRepaid,
            isRepaid,
            totalRepayment,
            daysRemaining,
            isOverdue,
          });
        }

        setUserLoans(loans);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading user loans:", error);
        setIsLoading(false);
      }
    };

    loadUserLoans();
  }, [
    connectedAddress,
    loanRequestEvents?.length,
    loanRepaidEvents?.length,
    approvedEvents?.length,
    requestEvents?.length,
  ]);

  // Update user balance from contract
  useEffect(() => {
    if (usdcBalance !== undefined) {
      setUserBalance(usdcBalance);
    }
  }, [usdcBalance]);

  const getUSDC = async () => {
    if (!connectedAddress) {
      notification.error("Please connect your wallet");
      return;
    }

    try {
      setLoadingUSDC(true);
      await writeUSDC({
        functionName: "faucet",
      });
      notification.success("You received 10,000 USDC!");
      setTimeout(() => {
        refetchBalance();
      }, 2000);
    } catch (error: any) {
      console.error("Error getting USDC:", error);
      
      // Check if error is about insufficient funds for gas
      if (error?.message?.includes("doesn't have enough funds") || 
          error?.message?.includes("insufficient funds") ||
          error?.details?.includes("doesn't have enough funds")) {
        notification.error("Insufficient ETH for gas fee. Please get ETH first from the Faucet button in the header.");
      } else {
        notification.error(error?.message || "Failed to get USDC");
      }
    } finally {
      setLoadingUSDC(false);
    }
  };

  const handleRepayLoan = async (loan: LoanInfo) => {
    if (!connectedAddress) {
      notification.error("Please connect your wallet");
      return;
    }

    // Check if user has enough balance
    if (userBalance < loan.totalRepayment) {
      notification.error("Insufficient balance to repay loan");
      return;
    }

    try {
      setIsRepaying(loan.loanId);

      // Get LendingPool address from deployedContracts
      const lendingPoolAddress = deployedContracts[31337]?.LendingPool?.address;
      
      if (!lendingPoolAddress) {
        throw new Error("LendingPool contract not found");
      }

      // Step 1: Approve USDC spending
      notification.info("Approving USDC...");
      
      await writeUSDC({
        functionName: "approve",
        args: [lendingPoolAddress, loan.totalRepayment],
      });

      notification.info("Repaying loan...");

      // Step 2: Repay the loan
      await writeLendingPool({
        functionName: "repayLoan",
        args: [BigInt(loan.loanId)],
      });

      notification.success("Loan repaid successfully! NFT unlocked and returned.");
      
      // Refetch balance from contract
      await refetchBalance();

      // Reload loans after a delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error repaying loan:", error);
      notification.error(error?.message || "Failed to repay loan");
    } finally {
      setIsRepaying(null);
    }
  };

  const activeLoans = userLoans.filter(l => l.isActive);
  const repaidLoans = userLoans.filter(l => l.isRepaid);

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

  if (!connectedAddress) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen text-white"
        style={{ background: "#0D0D0D" }}
      >
        <UserCircleIcon className="h-20 w-20 mb-4 text-white/50" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-white/70">Please connect your wallet to view your profile</p>
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
              <Address address={connectedAddress} />
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
                {usdcBalance ? (Number(usdcBalance) / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"} USDC
              </div>
              <p className="text-white/60 text-sm mb-4">Available for loan repayment</p>
              
              {/* Tombol Get USDC - hanya muncul di localhost */}
              {chain?.id === hardhat.id && (
                <>
                  <button
                    onClick={getUSDC}
                    disabled={loadingUSDC}
                    className="btn btn-sm w-full border-0 font-bold"
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
                        <BanknotesIcon className="h-5 w-5" />
                        Get 10,000 USDC (Test)
                      </>
                    )}
                  </button>
                  <p className="text-white/50 text-xs mt-2 text-center">
                    💡 Need ETH for gas? Click "Faucet" button in header first
                  </p>
                </>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <LockClosedIcon className="h-8 w-8 text-blue-400" />
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
                >
                  Statistik Pinjaman
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Pinjaman:</span>
                  <span className="font-bold text-white">{userLoans.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Aktif:</span>
                  <span className="font-bold text-blue-400">{activeLoans.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Selesai:</span>
                  <span className="font-bold text-green-400">{repaidLoans.length}</span>
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

            {isLoading ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
                <div className="loading loading-spinner loading-lg text-yellow-400 mb-4"></div>
                <p className="text-white/70">Memuat data pinjaman...</p>
              </div>
            ) : activeLoans.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
                <CheckCircleIcon className="h-16 w-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-2xl font-bold mb-2" style={{ ...goldGradientText }}>
                  Tidak Ada Pinjaman Aktif
                </h3>
                <p className="text-white/70 mb-6">Anda tidak memiliki pinjaman NFT yang aktif saat ini.</p>
                <Link
                  href="/lending"
                  className="btn border-0 font-bold"
                  style={goldGradientButton}
                >
                  Ajukan Pinjaman Baru
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeLoans.map((loan) => (
                  <div
                    key={loan.loanId}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    {/* NFT Image */}
                    <div className="relative mb-4">
                      <img
                        src={loan.nftImage}
                        alt={loan.nftName}
                        className="w-full h-48 object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/keris.png";
                        }}
                      />
                      {loan.isOverdue && (
                        <div className="absolute top-2 right-2 bg-red-500 px-3 py-1 rounded-full">
                          <span className="text-white text-xs font-bold">OVERDUE</span>
                        </div>
                      )}
                    </div>

                    {/* Loan Info */}
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
                    >
                      {loan.nftName}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Loan ID:</span>
                        <span className="text-white font-semibold">#{loan.loanId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Pinjaman:</span>
                        <span className="text-white font-semibold">{(Number(loan.amount) / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2 })} USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Bunga (12% APY):</span>
                        <span className="text-white font-semibold">
                          {(Number(loan.totalRepayment - loan.amount) / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2 })} USDC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-white/10 pt-2">
                        <span className="text-white/70 font-bold">Total Pelunasan:</span>
                        <span className="text-yellow-400 font-bold text-lg">
                          {(Number(loan.totalRepayment) / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2 })} USDC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Sisa Waktu:</span>
                        <span className={`font-semibold ${loan.isOverdue ? 'text-red-400' : loan.daysRemaining < 7 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {loan.isOverdue ? `Terlambat ${Math.abs(loan.daysRemaining)} hari` : `${loan.daysRemaining} hari`}
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
                        Kurang {(Number(loan.totalRepayment - userBalance) / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2 })} USDC
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
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "'Mileast', sans-serif", ...goldGradientText }}
              >
                Riwayat Pinjaman Selesai
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repaidLoans.map((loan) => (
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
                        <span className="text-white/70">{(Number(loan.totalRepayment) / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2 })} USDC</span>
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

export default ProfilePage;
