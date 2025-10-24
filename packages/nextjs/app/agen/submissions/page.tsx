"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { fetchFromIPFS, getIPFSImageUrl } from "~~/utils/ipfs";

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface RequestWithMetadata {
  requestId: string;
  artisan: string;
  submittedBy: string;
  regionCode: string;
  ipfsHash: string;
  timestamp: bigint;
  status: string;
  blockNumber: bigint;
  tokenId?: bigint;
  metadata?: NFTMetadata;
  metadataLoading?: boolean;
}

const PendingRequestsPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Get pending requests count
  const { data: pendingCount } = useScaffoldReadContract({
    contractName: "ICAS721",
    functionName: "getPendingRequestCount",
  });

  // Get all pending request IDs
  const { data: pendingRequestIds } = useScaffoldReadContract({
    contractName: "ICAS721",
    functionName: "getPendingRequests",
  });

  // Get historical mint requested events
  const { data: mintRequestedEvents } = useScaffoldEventHistory({
    contractName: "ICAS721",
    eventName: "MintRequested",
    fromBlock: 0n,
    watch: true,
  });

  // Get approved events
  const { data: mintApprovedEvents } = useScaffoldEventHistory({
    contractName: "ICAS721",
    eventName: "MintApproved",
    fromBlock: 0n,
    watch: true,
  });

  // Get rejected events
  const { data: mintRejectedEvents } = useScaffoldEventHistory({
    contractName: "ICAS721",
    eventName: "MintRejected",
    fromBlock: 0n,
    watch: true,
  });

  // Combine all events into a unified list
  const [allRequests, setAllRequests] = useState<RequestWithMetadata[]>([]);

  useEffect(() => {
    const requests: RequestWithMetadata[] = [];

    // Add all mint requested events
    if (mintRequestedEvents) {
      mintRequestedEvents.forEach((event: any) => {
        const requestId = event.args.requestId;
        const isPending = pendingRequestIds?.some((id: string) => id === requestId);
        const approvedEvent = mintApprovedEvents?.find((e: any) => e.args.requestId === requestId);
        const isRejected = mintRejectedEvents?.some((e: any) => e.args.requestId === requestId);

        let status = "pending";
        let tokenId: bigint | undefined;

        if (approvedEvent) {
          status = "approved";
          tokenId = approvedEvent.args.tokenId;
        } else if (isRejected) {
          status = "rejected";
        } else if (!isPending) {
          status = "unknown";
        }

        requests.push({
          requestId: requestId,
          artisan: event.args.artisan,
          submittedBy: event.args.submittedBy,
          regionCode: event.args.regionCode,
          ipfsHash: event.args.ipfsHash,
          timestamp: event.args.timestamp,
          status: status,
          blockNumber: event.blockNumber,
          tokenId: tokenId,
          metadataLoading: false,
        });
      });
    }

    // Sort by block number (most recent first)
    requests.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

    setAllRequests(requests);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintRequestedEvents?.length, mintApprovedEvents?.length, mintRejectedEvents?.length, pendingRequestIds?.length]);

  // Filter requests based on selected filter and user
  const filteredRequests = allRequests.filter(req => {
    // Filter by connected user (only show their submissions)
    if (connectedAddress && req.submittedBy !== connectedAddress) return false;

    // Filter by status
    if (filter === "all") return true;
    return req.status === filter;
  });

  // Count of requests that need metadata (any status, not just approved)
  const needingMetadataCount = allRequests.filter(req => req.ipfsHash && !req.metadata && !req.metadataLoading).length;

  // Fetch metadata from IPFS for ALL requests (not just approved)
  useEffect(() => {
    const fetchMetadata = async () => {
      if (needingMetadataCount === 0) return;

      const updatedRequests = await Promise.all(
        allRequests.map(async request => {
          // Fetch metadata for ANY request that has an IPFS hash
          if (request.ipfsHash && !request.metadata && !request.metadataLoading) {
            try {
              console.log("Fetching metadata from IPFS:", request.ipfsHash);

              // Use the IPFS utility to fetch metadata
              const metadata = await fetchFromIPFS(request.ipfsHash);

              if (metadata) {
                console.log("Successfully fetched metadata:", metadata);
                return { ...request, metadata, metadataLoading: false };
              } else {
                console.warn(`Could not fetch metadata for ${request.ipfsHash}, using fallback`);
                // Fallback to basic metadata
                const fallbackMetadata: NFTMetadata = {
                  name: `${request.regionCode} Craft Product`,
                  description: `Product from ${request.regionCode}. Metadata not available.`,
                  attributes: [
                    {
                      trait_type: "Region",
                      value: request.regionCode,
                    },
                  ],
                };
                return { ...request, metadata: fallbackMetadata, metadataLoading: false };
              }
            } catch (error) {
              console.error("Error fetching metadata:", error);
              // Return with fallback metadata instead of failing
              const fallbackMetadata: NFTMetadata = {
                name: `${request.regionCode} Craft Product`,
                description: `Product from ${request.regionCode}`,
                attributes: [
                  {
                    trait_type: "Region",
                    value: request.regionCode,
                  },
                ],
              };
              return { ...request, metadata: fallbackMetadata, metadataLoading: false };
            }
          }
          return request;
        }),
      );

      // Only update if there are changes
      const hasChanges = updatedRequests.some((req, idx) => req.metadata !== allRequests[idx].metadata);
      if (hasChanges) {
        setAllRequests(updatedRequests);
      }
    };

    if (allRequests.length > 0) {
      fetchMetadata();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needingMetadataCount]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="bg-green-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <CheckCircleIcon className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">Approved & Minted</span>
          </div>
        );
      case "pending":
        return (
          <div className="bg-yellow-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <ClockIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">Pending Approval</span>
          </div>
        );
      case "rejected":
        return (
          <div className="bg-red-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <XCircleIcon className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm font-semibold">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="bg-white/10 px-3 py-1 rounded-full">
            <span className="text-white/70 text-sm">Unknown</span>
          </div>
        );
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
      `}</style>

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

        <div className="relative z-10">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 py-6 px-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <Link
                href="/agen"
                className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
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
                  My Submissions
                </h1>
                <p className="text-white/80">Track your product submissions</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <DocumentTextIcon className="h-8 w-8 text-white/50 mb-2" />
                <div className="text-2xl font-bold text-white">{allRequests.length}</div>
                <div className="text-sm text-white/60">Total Submissions</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <ClockIcon className="h-8 w-8 text-yellow-400 mb-2" />
                <div className="text-2xl font-bold text-white">{pendingCount?.toString() || "0"}</div>
                <div className="text-sm text-white/60">Pending</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <CheckCircleIcon className="h-8 w-8 text-green-400 mb-2" />
                <div className="text-2xl font-bold text-white">
                  {allRequests.filter(r => r.status === "approved").length}
                </div>
                <div className="text-sm text-white/60">Approved</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <XCircleIcon className="h-8 w-8 text-red-400 mb-2" />
                <div className="text-2xl font-bold text-white">
                  {allRequests.filter(r => r.status === "rejected").length}
                </div>
                <div className="text-sm text-white/60">Rejected</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "approved", label: "Approved" },
                { key: "rejected", label: "Rejected" },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filter === tab.key ? "text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  }`}
                  style={
                    filter === tab.key
                      ? {
                          background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                        }
                      : {}
                  }
                  onClick={() => setFilter(tab.key as any)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Debug: Show localStorage contents */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-6">
                <p className="text-white text-sm mb-2">🔍 Debug Info:</p>
                <button
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-sm"
                  onClick={() => {
                    const ipfsKeys = Object.keys(localStorage).filter(key => key.startsWith("ipfs_"));
                    console.log("📦 IPFS keys in localStorage:", ipfsKeys);
                    ipfsKeys.forEach(key => {
                      console.log(`Key: ${key}`);
                      console.log(`Value:`, localStorage.getItem(key));
                    });
                    alert(`Found ${ipfsKeys.length} IPFS items in localStorage. Check console for details.`);
                  }}
                >
                  Check localStorage
                </button>
              </div>
            )}

            {/* Wallet Connection Check */}
            {!connectedAddress && (
              <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-6 mb-6">
                <p className="text-white/90 text-center">Please connect your wallet to view your submissions</p>
              </div>
            )}

            {/* Requests List */}
            {connectedAddress && filteredRequests.length === 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
                <DocumentTextIcon className="h-16 w-16 mx-auto text-white/30 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No submissions found</h3>
                <p className="text-white/60 mb-6">
                  {filter === "all" ? "You haven't submitted any products yet" : `No ${filter} submissions`}
                </p>
                <Link
                  href="/agen/produk/baru"
                  className="px-6 py-3 rounded-lg font-semibold inline-block transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(90deg, #C48A04 0%, #E9A507 50%, #C48A04 100%)",
                    color: "#060606",
                  }}
                >
                  Submit New Product
                </Link>
              </div>
            )}

            {connectedAddress && filteredRequests.length > 0 && (
              <div className="space-y-4">
                {filteredRequests.map((request, index) => {
                  // Always try to show metadata if available, regardless of status
                  const displayName = request.metadata?.name || `Product #${index + 1}`;
                  const displayDescription = request.metadata?.description || "Product submission pending metadata";
                  const hasImage = request.metadata?.image;

                  return (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Image Section */}
                        {hasImage && (
                          <div className="flex-shrink-0">
                            <div className="w-full lg:w-64 h-64 rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
                              <Image
                                src={
                                  request.metadata?.image?.startsWith("ipfs://")
                                    ? getIPFSImageUrl(request.metadata.image.replace("ipfs://", ""))
                                    : request.metadata?.image || ""
                                }
                                alt={displayName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="bg-white/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              {/* Title and Status */}
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-xl font-bold text-white">{displayName}</h3>
                                {getStatusBadge(request.status)}
                              </div>

                              {/* Description */}
                              <p className="text-white/80 text-sm mb-4 leading-relaxed">{displayDescription}</p>

                              {/* Token ID for approved NFTs */}
                              {request.tokenId && (
                                <div className="bg-green-500/10 rounded-lg p-3 mb-3 border border-green-400/30">
                                  <span className="text-green-400 text-sm">🎉 Token ID: </span>
                                  <span className="text-white font-bold text-lg">#{request.tokenId.toString()}</span>
                                </div>
                              )}

                              {/* Region Code - Always show */}
                              <div className="bg-white/5 rounded-lg p-3 mb-3 border border-white/10">
                                <span className="text-white/50 text-sm">Region Code: </span>
                                <span className="text-white font-semibold">{request.regionCode}</span>
                              </div>

                              {/* Grid Info */}
                              <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
                                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                  <span className="text-white/50 block mb-1">Artisan Address</span>
                                  <Address address={request.artisan} format="short" />
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                  <span className="text-white/50 block mb-1">Submitted Date</span>
                                  <span className="text-white">
                                    {new Date(Number(request.timestamp) * 1000).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>

                              {/* Attributes - Show if available */}
                              {request.metadata?.attributes && request.metadata.attributes.length > 0 && (
                                <div className="mb-3">
                                  <span className="text-white/50 text-sm block mb-2">Product Details:</span>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {request.metadata.attributes.map((attr, idx) => (
                                      <div key={idx} className="bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                                        <div className="text-white/50 text-xs">{attr.trait_type}</div>
                                        <div className="text-white text-sm font-semibold">{attr.value}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Request Details */}
                              <div className="bg-white/5 rounded-lg p-3 mb-3 border border-white/10">
                                <div className="text-white/50 text-xs mb-1">Request ID</div>
                                <div className="text-white/80 text-sm font-mono">
                                  {request.requestId.slice(0, 10)}...{request.requestId.slice(-8)}
                                </div>
                              </div>

                              {/* IPFS Link - Make it clear it's for development */}
                              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <div className="text-white/50 text-xs mb-1">Metadata Hash</div>
                                <div className="flex items-center gap-2">
                                  <code className="text-white/80 text-sm font-mono">{request.ipfsHash}</code>
                                  {typeof window !== "undefined" &&
                                    localStorage.getItem(`ipfs_${request.ipfsHash}`) && (
                                      <span className="text-green-400 text-xs">✓ Available</span>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingRequestsPage;
