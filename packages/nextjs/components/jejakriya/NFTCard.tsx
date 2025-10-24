import Image from "next/image";
import { ArrowsRightLeftIcon, EyeIcon, HeartIcon } from "@heroicons/react/24/outline";

interface NFTCardProps {
  id: number;
  tokenId: string;
  name: string;
  creator: string;
  creatorHandle: string;
  region: string;
  image: string;
  views: number;
  likes: number;
  price: string;
  lastSale: string;
  isCollateralized?: boolean;
  onClick?: () => void;
}

export const NFTCard = ({
  tokenId,
  name,
  creator,
  creatorHandle,
  region,
  image,
  views,
  lastSale,
  isCollateralized,
  onClick,
}: NFTCardProps) => {
  return (
    <div
      className="card bg-base-100/5 hover:bg-base-100/10 transition-all cursor-pointer group relative overflow-hidden"
      onClick={onClick}
    >
      {/* NFT Image */}
      <figure className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          width={256}
          height={256}
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex gap-2">
            <button className="btn btn-sm btn-circle btn-ghost">
              <EyeIcon className="h-4 w-4" />
            </button>
            <button className="btn btn-sm btn-circle btn-ghost">
              <HeartIcon className="h-4 w-4" />
            </button>
            <button className="btn btn-sm btn-circle btn-ghost">
              <ArrowsRightLeftIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Collateral Badge */}
        {isCollateralized && <div className="absolute top-2 right-2 badge badge-warning badge-sm gap-1">🔒 Locked</div>}

        {/* Top Left: Creator */}
        <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-6">
              <span className="text-xs">{creator.charAt(0)}</span>
            </div>
          </div>
          <span className="text-xs font-semibold">{creator}</span>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-2 left-2 flex gap-2">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs flex items-center gap-1">
            <EyeIcon className="h-3 w-3" />
            {views.toLocaleString()}
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs">Last {lastSale}</div>
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1 line-clamp-1">{name}</h3>
            <p className="text-xs text-base-content/60">{creatorHandle}</p>
          </div>
          <button className="btn btn-ghost btn-circle btn-xs">
            <HeartIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="badge badge-outline badge-sm">{region}</div>
          <div className="text-xs text-base-content/60">{tokenId}</div>
        </div>
      </div>
    </div>
  );
};
