import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OwnershipHistory = {
  ownerName: string;
  ownerAddress?: string;
  transferredAt: string;
  transferMethod: "mint" | "purchase" | "transfer";
};

export type DemoNFT = {
  id: string;
  name: string;
  pengrajinName: string;
  imageUrl: string;
  category: string;
  description: string;
  price: string;
  mintedAt: string;
  verified: boolean;
  ownershipHistory: OwnershipHistory[];
};

type DemoState = {
  // 3 NFT awal yang sudah dimiliki
  ownedNFTs: DemoNFT[];

  // NFT ke-4 yang akan di-transfer (pending)
  pendingNFT: DemoNFT;

  // Action untuk verifikasi transfer
  verifyTransfer: (productId: string) => void;

  // Reset demo (kembali ke 3 NFT)
  resetDemo: () => void;

  // Get NFT by ID
  getNFTById: (id: string) => DemoNFT | undefined;
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      // 3 NFT awal (hardcoded)
      ownedNFTs: [
        {
          id: "1",
          name: "Batik Tulis Megamendung",
          pengrajinName: "Ibu Siti Aminah",
          imageUrl: "/batik-1.jpg",
          category: "Batik",
          description:
            "Batik tulis dengan motif Megamendung khas Cirebon, dibuat dengan teknik tradisional menggunakan canting dan malam.",
          price: "Rp 2.500.000",
          mintedAt: "2024-01-15T10:30:00Z",
          verified: true,
          ownershipHistory: [
            {
              ownerName: "Ibu Siti Aminah",
              ownerAddress: "0x1234...5678",
              transferredAt: "2024-01-15T10:30:00Z",
              transferMethod: "mint",
            },
            {
              ownerName: "Toko Batik Nusantara",
              ownerAddress: "0x2345...6789",
              transferredAt: "2024-02-20T14:15:00Z",
              transferMethod: "purchase",
            },
            {
              ownerName: "Anda (Demo User)",
              transferredAt: "2024-03-10T09:00:00Z",
              transferMethod: "purchase",
            },
          ],
        },
        {
          id: "2",
          name: "Keramik Kasongan Vas Bunga",
          pengrajinName: "Bapak Sutrisno",
          imageUrl: "/keramik-1.jpg",
          category: "Keramik",
          description:
            "Vas bunga keramik khas Kasongan Yogyakarta dengan detail ukiran tangan yang halus dan finishing glossy.",
          price: "Rp 850.000",
          mintedAt: "2024-02-10T11:45:00Z",
          verified: true,
          ownershipHistory: [
            {
              ownerName: "Bapak Sutrisno",
              ownerAddress: "0x3456...7890",
              transferredAt: "2024-02-10T11:45:00Z",
              transferMethod: "mint",
            },
            {
              ownerName: "Anda (Demo User)",
              transferredAt: "2024-02-28T16:20:00Z",
              transferMethod: "purchase",
            },
          ],
        },
        {
          id: "3",
          name: "Wayang Kulit Arjuna",
          pengrajinName: "Ki Dalang Suyanto",
          imageUrl: "/wayang-1.jpg",
          category: "Wayang",
          description:
            "Wayang kulit tokoh Arjuna dari kulit kerbau berkualitas premium dengan detail pahatan yang sangat halus.",
          price: "Rp 3.200.000",
          mintedAt: "2024-03-05T13:20:00Z",
          verified: true,
          ownershipHistory: [
            {
              ownerName: "Ki Dalang Suyanto",
              ownerAddress: "0x4567...8901",
              transferredAt: "2024-03-05T13:20:00Z",
              transferMethod: "mint",
            },
            {
              ownerName: "Galeri Seni Nusantara",
              ownerAddress: "0x5678...9012",
              transferredAt: "2024-04-12T10:30:00Z",
              transferMethod: "transfer",
            },
            {
              ownerName: "Anda (Demo User)",
              transferredAt: "2024-05-18T15:45:00Z",
              transferMethod: "purchase",
            },
          ],
        },
      ],

      // NFT ke-4 yang akan di-transfer (hardcoded)
      pendingNFT: {
        id: "4",
        name: "Tenun Ikat NTT",
        pengrajinName: "Mama Yohana",
        imageUrl: "/tenun-1.jpg",
        category: "Tenun",
        description:
          "Kain tenun ikat khas Nusa Tenggara Timur dengan motif tradisional dan pewarnaan alami dari tumbuhan lokal.",
        price: "Rp 1.800.000",
        mintedAt: "2024-11-01T08:00:00Z",
        verified: false,
        ownershipHistory: [
          {
            ownerName: "Mama Yohana",
            ownerAddress: "0x6789...0123",
            transferredAt: "2024-11-01T08:00:00Z",
            transferMethod: "mint",
          },
          {
            ownerName: "Pameran Kerajinan Nusantara 2024",
            transferredAt: "2024-11-10T12:00:00Z",
            transferMethod: "transfer",
          },
        ],
      },

      verifyTransfer: productId =>
        set(state => {
          // Validasi productId harus '4' (hardcoded untuk demo)
          if (productId === "4" && !state.pendingNFT.verified) {
            const now = new Date().toISOString();
            const updatedPendingNFT = {
              ...state.pendingNFT,
              verified: true,
              ownershipHistory: [
                ...state.pendingNFT.ownershipHistory,
                {
                  ownerName: "Anda (Demo User)",
                  transferredAt: now,
                  transferMethod: "transfer" as const,
                },
              ],
            };

            return {
              ownedNFTs: [...state.ownedNFTs, updatedPendingNFT],
              pendingNFT: updatedPendingNFT,
            };
          }
          return state;
        }),

      resetDemo: () =>
        set(state => {
          const initialPendingNFT = {
            id: "4",
            name: "Tenun Ikat NTT",
            pengrajinName: "Mama Yohana",
            imageUrl: "/tenun-1.jpg",
            category: "Tenun",
            description:
              "Kain tenun ikat khas Nusa Tenggara Timur dengan motif tradisional dan pewarnaan alami dari tumbuhan lokal.",
            price: "Rp 1.800.000",
            mintedAt: "2024-11-01T08:00:00Z",
            verified: false,
            ownershipHistory: [
              {
                ownerName: "Mama Yohana",
                ownerAddress: "0x6789...0123",
                transferredAt: "2024-11-01T08:00:00Z",
                transferMethod: "mint" as const,
              },
              {
                ownerName: "Pameran Kerajinan Nusantara 2024",
                transferredAt: "2024-11-10T12:00:00Z",
                transferMethod: "transfer" as const,
              },
            ],
          };

          return {
            ownedNFTs: state.ownedNFTs.slice(0, 3), // Kembali ke 3 NFT awal
            pendingNFT: initialPendingNFT,
          };
        }),

      getNFTById: id => {
        const state = get();
        return state.ownedNFTs.find(nft => nft.id === id) || (state.pendingNFT.id === id ? state.pendingNFT : undefined);
      },
    }),
    {
      name: "demo-storage", // localStorage key
    },
  ),
);
