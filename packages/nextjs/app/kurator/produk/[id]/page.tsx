"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  IdentificationIcon,
  PhotoIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  VideoCameraIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { fetchFromIPFS } from "~~/utils/ipfs";
import { notification } from "~~/utils/scaffold-eth";

// Tipe data untuk metadata IPFS
type IPFSMetadata = {
  name: string;
  description: string;
  ceritaProduk?: string;
  attributes: { trait_type: string; value: string | number }[];
  properties: {
    images: string[];
    video: string | null;
    materials: string;
    productionTime: string;
    estimatedPrice: string;
  };
};

// Tipe data untuk hasil return dari getMintRequest (tuple)
type MintRequestTuple = readonly [
  string, // artisan (address)
  string, // regionCode (string)
  string, // category (string)
  string, // ipfsHash (string)
  string, // submittedBy (address)
  bigint, // submittedAt (uint256)
];

const ReviewDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const requestId = params.id; // Ini adalah bytes32 requestId

  const [metadata, setMetadata] = useState<IPFSMetadata | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isFetchingIpfs, setIsFetchingIpfs] = useState(true);

  // Helper untuk mengubah 'ipfs://' menjadi URL yang bisa diakses
  const getIpfsUrl = (ipfsPath: string) => {
    if (!ipfsPath) return "";
    return ipfsPath.replace("ipfs://", "https://ipfs.io/ipfs/");
  };

  const {
    data: mintRequest,
    isLoading: isLoadingRequest,
    isError: isRequestError, // Kita perlukan ini
  } = useScaffoldReadContract({
    contractName: "ICAS721",
    functionName: "getMintRequest",
    args: [requestId as `0x${string}`],
    query: {
      // <-- TAMBAHKAN OBJEK INI
      enabled: !!requestId, // <-- PINDAHKAN KE DALAM
    },
  }) as { data: MintRequestTuple | undefined; isLoading: boolean; isError: boolean };

  // === 2. AMBIL DATA OFF-CHAIN (IPFS) ===
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (isLoadingRequest) return;

      if (!mintRequest || !mintRequest[3] || isRequestError) {
        if (mounted) setIsFetchingIpfs(false);
        return;
      }

      const ipfsHash = mintRequest[3];
      try {
        if (mounted) setIsFetchingIpfs(true);
        const data = await fetchFromIPFS(ipfsHash);
        if (mounted) {
          setMetadata(data as IPFSMetadata | null);
          setIsFetchingIpfs(false);
        }
      } catch (error) {
        console.error("Error fetching IPFS:", error);
        if (mounted) setIsFetchingIpfs(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [mintRequest, isLoadingRequest, isRequestError]); // <-- Tambahkan dependency

  // === 3. FUNGSI WRITE (APPROVE & REJECT) ===
  // (Kode ini sudah benar)
  // --- KODE BARU (BENAR) ---
  // Hook untuk Approve
  const { writeContractAsync: approveMintAsync, isPending: isApproving } = useScaffoldWriteContract("ICAS721");

  // Hook untuk Reject
  const { writeContractAsync: rejectMintAsync, isPending: isRejecting } = useScaffoldWriteContract("ICAS721");

  const isSubmitting = isApproving || isRejecting;

  // (const isSubmitting = isApproving || isRejecting; <-- Ini masih berfungsi)

  const handleApprove = async () => {
    try {
      notification.info("Mengirim transaksi approval...");

      // Panggil 'approveMintAsync' (bukan 'approveMint')
      await approveMintAsync({
        functionName: "approveMint", // <-- TAMBAHKAN FUNCTION NAME DI SINI
        args: [requestId as `0x${string}`],
      });

      notification.success("Produk berhasil disetujui! Mengarahkan kembali ke dashboard...");
      setTimeout(() => router.push("/kurator"), 2000);
    } catch (e) {
      console.error("Error approving:", e);
      notification.error("Gagal menyetujui produk.");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      notification.error("Silakan isi alasan penolakan di kolom yang tersedia.");
      return;
    }
    try {
      notification.info("Mengirim transaksi rejection...");

      // Panggil 'rejectMintAsync' (bukan 'rejectMint')
      await rejectMintAsync({
        functionName: "rejectMint", // <-- TAMBAHKAN FUNCTION NAME DI SINI
        args: [requestId as `0x${string}`, rejectionReason],
      });

      notification.success("Produk berhasil ditolak. Mengarahkan kembali ke dashboard...");
      setTimeout(() => router.push("/kurator"), 2000);
    } catch (e) {
      console.error("Error rejecting:", e);
      notification.error("Gagal menolak produk.");
    }
  };

  // Tampilkan loading spinner jika data on-chain atau off-chain belum siap
  if (isLoadingRequest || isFetchingIpfs) {
    return (
      <div
        className="flex flex-col min-h-screen relative text-white items-center justify-center"
        style={{ background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)" }}
      >
        <span className="loading loading-spinner loading-lg text-yellow-400"></span>
        <p className="text-white/70 mt-4 text-lg">Memuat data detail dari blockchain & IPFS...</p>
      </div>
    );
  }

  // Tampilkan error jika data tidak ditemukan (LOGIKA INI SEKARANG AKAN BERJALAN)
  if (!mintRequest || !metadata) {
    return (
      <div
        className="flex flex-col min-h-screen relative text-white items-center justify-center"
        style={{ background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)" }}
      >
        <XCircleIcon className="h-24 w-24 text-red-500" />
        <h1 className="text-3xl font-bold mt-4">Data Tidak Ditemukan</h1>
        <p className="text-white/70 mt-2">Request ID ini mungkin sudah diproses atau tidak valid.</p>
        <button
          onClick={() => router.back()}
          className="mt-8 px-6 py-3 rounded-lg font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10"
        >
          <ArrowLeftIcon className="h-5 w-5 inline-block mr-2" />
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  // Helper untuk mengambil data (Sekarang sudah type-safe)
  const artisan = mintRequest[0];
  const regionCode = mintRequest[1];
  const category = mintRequest[2];
  const submittedBy = mintRequest[4];
  // PERBAIKAN: mintRequest[5] adalah 'bigint', ubah ke 'Number'
  const submittedAt = new Date(Number(mintRequest[5]) * 1000).toLocaleDateString("id-ID");
  const price = metadata.attributes.find(a => a.trait_type === "Estimated Price")?.value || "0";
  const materials = metadata.attributes.find(a => a.trait_type === "Materials")?.value || "N/A";
  const productionTime = metadata.attributes.find(a => a.trait_type === "Production Time")?.value || "N/A";

  return (
    <div>
      <div
        className="min-h-screen relative"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #3D2C88 50%, #0D0D0D 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
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

        <div className="relative z-10 text-white">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 py-6 px-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1
                  className="text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background:
                      "linear-gradient(90deg, #C48A04 0%, #E9A507 25%, #F2C14D 50%, #E9A507 75%, #C48A04 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Review Detail Produk
                </h1>
                <p className="text-white/80">Verifikasi data on-chain dan off-chain</p>
              </div>
            </div>
          </div>

          {/* Konten Utama */}
          <main className="w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kolom Kiri: Detail Data */}
            <div className="lg:col-span-2 space-y-6">
              {/* Box Detail Produk */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <DocumentTextIcon className="h-6 w-6 mr-3" />
                  Detail Produk (dari IPFS)
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">Nama Produk</p>
                    <p className="font-semibold text-white text-lg">{metadata.name}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Harga Estimasi</p>
                      <p className="font-semibold text-white">Rp {parseInt(price as string).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Bahan Baku</p>
                      <p className="font-semibold text-white">{materials as string}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Waktu Pembuatan</p>
                      <p className="font-semibold text-white">{productionTime as string}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">Deskripsi Singkat</p>
                    <p className="font-semibold text-white">{metadata.description}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">Cerita Produk</p>
                    <p className="font-semibold text-white whitespace-pre-line">
                      {metadata.ceritaProduk || "Tidak ada cerita tambahan."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box Data On-Chain */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <IdentificationIcon className="h-6 w-6 mr-3" />
                  Data Verifikasi (dari Blockchain)
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-2 flex items-center gap-2">
                      <UserCircleIcon className="h-5 w-5" /> Pengrajin
                    </p>
                    <Address address={artisan} size="sm" />
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-2 flex items-center gap-2">
                      <UserCircleIcon className="h-5 w-5" /> Agen (Submitted by)
                    </p>
                    <Address address={submittedBy} size="sm" />
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-2">
                      <GlobeAltIcon className="h-5 w-5" /> Kode Wilayah
                    </p>
                    <p className="font-semibold text-white">{regionCode}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-2">
                      <CubeIcon className="h-5 w-5" /> Kategori
                    </p>
                    <p className="font-semibold text-white capitalize">{category}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5" /> Tanggal Submit
                    </p>
                    <p className="font-semibold text-white">{submittedAt}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1 flex items-center gap-2">
                      <ClockIcon className="h-5 w-5" /> Request ID
                    </p>
                    <p className="font-semibold text-white text-xs break-all">#{requestId}</p>
                  </div>
                </div>
              </div>

              {/* Box Media */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <PhotoIcon className="h-6 w-6 mr-3" />
                  Media (Foto & Video)
                </h2>
                {/* Foto */}
                <p className="text-white/80 font-semibold mb-3">Foto Produk ({metadata.properties.images.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {metadata.properties.images.map((imgIpfsPath, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={index}
                      src={getIpfsUrl(imgIpfsPath)}
                      alt={`Foto produk ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-white/10"
                    />
                  ))}
                </div>

                {/* Video */}
                {metadata.properties.video && (
                  <div>
                    <p className="text-white/80 font-semibold mb-3 flex items-center gap-2">
                      <VideoCameraIcon className="h-5 w-5" /> Video Proses
                    </p>
                    <video
                      src={getIpfsUrl(metadata.properties.video)}
                      controls
                      className="w-full max-h-96 rounded-lg border border-white/10"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Kolom Kanan: Tindakan */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center"
                  style={{
                    fontFamily: "'Aldo', sans-serif",
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #F2C14D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <ShieldCheckIcon className="h-6 w-6 mr-3" />
                  Tindakan Kurator
                </h2>

                {!connectedAddress ? (
                  <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4 text-center">
                    <p className="text-yellow-400 text-sm">
                      Silakan connect wallet kurator Anda untuk mengambil tindakan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 rounded-lg font-bold text-lg bg-green-500 hover:bg-green-600 text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isApproving ? (
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                      ) : (
                        <CheckCircleIcon className="h-6 w-6 inline-block mr-2" />
                      )}
                      APPROVE & MINT NFT
                    </button>

                    <div className="divider text-white/70">ATAU</div>

                    <div>
                      <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                        <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                        Alasan Penolakan (Wajib jika menolak)
                      </label>
                      <textarea
                        name="rejectionReason"
                        placeholder="Contoh: Foto produk tidak jelas, cerita produk kurang lengkap..."
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 h-28"
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <button
                      onClick={handleReject}
                      disabled={isSubmitting || !rejectionReason}
                      className="w-full px-6 py-3 rounded-lg font-bold text-lg bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isRejecting ? (
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                      ) : (
                        <XCircleIcon className="h-6 w-6 inline-block mr-2" />
                      )}
                      REJECT
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
