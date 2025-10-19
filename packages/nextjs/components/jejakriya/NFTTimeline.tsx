"use client";

import { CheckCircleIcon, ClockIcon, SparklesIcon, UserGroupIcon } from "@heroicons/react/24/solid";

interface TimelineEvent {
  title: string;
  description: string;
  timestamp: string;
  address?: string;
  status: "completed" | "current" | "pending";
  icon?: React.ReactNode;
}

interface NFTTimelineProps {
  events: TimelineEvent[];
}

/**
 * Timeline visualization untuk journey NFT
 * Dari pengrajin → agen → kurator → minted
 */
export const NFTTimeline: React.FC<NFTTimelineProps> = ({ events }) => {
  return (
    <div className="py-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <SparklesIcon className="h-6 w-6 text-primary" />
        Perjalanan Produk Kriya
      </h3>

      <ul className="timeline timeline-vertical">
        {events.map((event, index) => (
          <li key={index}>
            {index !== 0 && <hr className={event.status === "completed" ? "bg-primary" : "bg-base-300"} />}

            <div className="timeline-start text-sm text-base-content/70">{event.timestamp}</div>

            <div className="timeline-middle">
              {event.status === "completed" ? (
                <CheckCircleIcon className="h-6 w-6 text-success" />
              ) : event.status === "current" ? (
                <div className="relative">
                  <ClockIcon className="h-6 w-6 text-warning animate-pulse" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-base-300 bg-base-100"></div>
              )}
            </div>

            <div
              className={`timeline-end timeline-box ${
                event.status === "completed"
                  ? "bg-success/10 border-success"
                  : event.status === "current"
                    ? "bg-warning/10 border-warning"
                    : "bg-base-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {event.icon && <div className="mt-1">{event.icon}</div>}
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{event.title}</h4>
                  <p className="text-sm text-base-content/70">{event.description}</p>
                  {event.address && (
                    <p className="text-xs font-mono mt-2 bg-base-300 px-2 py-1 rounded inline-block">
                      {event.address.slice(0, 10)}...{event.address.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {index !== events.length - 1 && (
              <hr className={event.status === "completed" ? "bg-primary" : "bg-base-300"} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Helper function untuk generate timeline dari NFT metadata
 */
export const generateNFTTimeline = (nftData: {
  artisanAddress: string;
  submittedAt: number;
  curatorAddress?: string;
  approvedAt?: number;
  mintedAt?: number;
}): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    {
      title: "Produk Dibuat",
      description: "Produk kriya selesai dibuat oleh tangan pengrajin",
      timestamp: new Date(nftData.submittedAt * 1000).toLocaleDateString("id-ID"),
      address: nftData.artisanAddress,
      status: "completed",
      icon: <UserGroupIcon className="h-5 w-5 text-primary" />,
    },
    {
      title: "Diajukan oleh Agen",
      description: "Agen mendaftarkan produk untuk verifikasi",
      timestamp: new Date(nftData.submittedAt * 1000).toLocaleDateString("id-ID"),
      status: "completed",
    },
  ];

  if (nftData.curatorAddress && nftData.approvedAt) {
    events.push({
      title: "Diverifikasi Kurator",
      description: "Produk telah diverifikasi dan disetujui oleh kurator resmi",
      timestamp: new Date(nftData.approvedAt * 1000).toLocaleDateString("id-ID"),
      address: nftData.curatorAddress,
      status: "completed",
      icon: <CheckCircleIcon className="h-5 w-5 text-success" />,
    });
  } else {
    events.push({
      title: "Menunggu Verifikasi",
      description: "Produk sedang dalam antrian review kurator",
      timestamp: "Pending",
      status: "current",
      icon: <ClockIcon className="h-5 w-5 text-warning" />,
    });
  }

  if (nftData.mintedAt) {
    events.push({
      title: "NFT Ter-mint",
      description: "NFT berhasil di-mint dan tercatat di blockchain",
      timestamp: new Date(nftData.mintedAt * 1000).toLocaleDateString("id-ID"),
      status: "completed",
      icon: <SparklesIcon className="h-5 w-5 text-primary" />,
    });
  } else {
    events.push({
      title: "Minting NFT",
      description: "NFT akan di-mint setelah approval kurator",
      timestamp: "Pending",
      status: "pending",
    });
  }

  return events;
};
