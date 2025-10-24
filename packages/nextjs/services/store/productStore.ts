import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProductStatus = "pending" | "approved" | "rejected" | "minted";

export interface Product {
  id: string;
  pengrajinId: string;
  pengrajinName: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  status: ProductStatus;
  submittedBy: string; // agen name
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // kurator name
  rejectionReason?: string;
  nftTokenId?: string;
  nftContractAddress?: string;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "submittedAt" | "status">) => void;
  approveProduct: (productId: string, kuratorName: string) => void;
  rejectProduct: (productId: string, kuratorName: string, reason: string) => void;
  mintNFT: (productId: string, tokenId: string, contractAddress: string) => void;
  getPendingProducts: () => Product[];
  getApprovedProducts: () => Product[];
  getProductsByPengrajin: (pengrajinId: string) => Product[];
  getProductById: (productId: string) => Product | undefined;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          submittedAt: new Date(),
          status: "pending",
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },

      approveProduct: (productId, kuratorName) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  status: "approved" as ProductStatus,
                  reviewedAt: new Date(),
                  reviewedBy: kuratorName,
                }
              : p
          ),
        }));

        // Auto-mint NFT after approval
        setTimeout(() => {
          const product = get().products.find((p) => p.id === productId);
          if (product && product.status === "approved") {
            const tokenId = `${Date.now()}`;
            const contractAddress = "0x" + Math.random().toString(16).substr(2, 40);
            get().mintNFT(productId, tokenId, contractAddress);
          }
        }, 1000); // Simulate blockchain transaction delay
      },

      rejectProduct: (productId, kuratorName, reason) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  status: "rejected" as ProductStatus,
                  reviewedAt: new Date(),
                  reviewedBy: kuratorName,
                  rejectionReason: reason,
                }
              : p
          ),
        }));
      },

      mintNFT: (productId, tokenId, contractAddress) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  status: "minted" as ProductStatus,
                  nftTokenId: tokenId,
                  nftContractAddress: contractAddress,
                }
              : p
          ),
        }));
      },

      getPendingProducts: () => {
        return get().products.filter((p) => p.status === "pending");
      },

      getApprovedProducts: () => {
        return get().products.filter((p) => p.status === "approved" || p.status === "minted");
      },

      getProductsByPengrajin: (pengrajinId) => {
        return get().products.filter((p) => p.pengrajinId === pengrajinId);
      },

      getProductById: (productId) => {
        return get().products.find((p) => p.id === productId);
      },
    }),
    {
      name: "product-storage",
    }
  )
);
