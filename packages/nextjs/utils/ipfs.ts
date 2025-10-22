/**
 * IPFS Upload Utility for Jejakriya Protocol
 * Uses public IPFS gateway for uploading NFT metadata
 */

interface IPFSMetadata {
  name: string;
  description: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  [key: string]: any; // Allow additional properties
}

/**
 * Upload JSON metadata to IPFS using a public gateway
 * For production, consider using Pinata, NFT.Storage, or Web3.Storage for better reliability
 */
export async function uploadToIPFS(metadata: IPFSMetadata): Promise<string> {
  try {
    // For development/testing: Use a mock approach that stores metadata locally
    // In production, replace this with actual IPFS upload (Pinata, NFT.Storage, etc.)

    // Option 1: Use Pinata (recommended for production)
    // Uncomment and add PINATA_API_KEY and PINATA_SECRET_API_KEY to .env.local
    /*
    const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
    
    if (!pinataApiKey || !pinataSecretApiKey) {
      throw new Error("Pinata API keys not configured");
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: metadata.name || "NFT Metadata",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.IpfsHash;
    */

    // Option 2: For development - Store in localStorage and generate deterministic hash
    // This allows the app to work without external IPFS services during development
    const metadataString = JSON.stringify(metadata, null, 2);

    // Generate a simple hash from the metadata content
    const hash = await generateSimpleHash(metadataString);
    const ipfsHash = `Qm${hash}`;

    // Store in localStorage for retrieval later
    if (typeof window !== "undefined") {
      const storageKey = `ipfs_${ipfsHash}`;
      localStorage.setItem(storageKey, metadataString);
      console.log("📦 Metadata stored locally with hash:", ipfsHash);
      console.log("📦 Storage key:", storageKey);
      console.log("📦 Metadata content:", metadata);
    }

    return ipfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}

/**
 * Retrieve metadata from IPFS or local storage
 */
export async function fetchFromIPFS(ipfsHash: string): Promise<IPFSMetadata | null> {
  try {
    console.log("🔍 Attempting to fetch metadata for:", ipfsHash);

    // First, try to get from localStorage (for development)
    if (typeof window !== "undefined") {
      const storageKey = `ipfs_${ipfsHash}`;
      console.log("🔍 Checking localStorage with key:", storageKey);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        console.log("📥 Retrieved metadata from local storage:", ipfsHash);
        const parsed = JSON.parse(stored);
        console.log("📥 Parsed metadata:", parsed);
        return parsed;
      } else {
        console.log("❌ Not found in localStorage");
      }
    }

    // If not in localStorage, try to fetch from IPFS gateway
    const ipfsGateways = [
      `https://ipfs.io/ipfs/${ipfsHash}`,
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
    ];

    for (const gateway of ipfsGateways) {
      try {
        const response = await fetch(gateway, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const metadata = await response.json();
          console.log("📥 Retrieved metadata from IPFS gateway:", ipfsHash);
          return metadata;
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${gateway}:`, err);
        // Continue to next gateway
      }
    }

    console.warn("Could not retrieve metadata from any IPFS gateway");
    return null;
  } catch (error) {
    console.error("Error fetching from IPFS:", error);
    return null;
  }
}

/**
 * Generate a simple hash from a string (for development)
 * In production, this would be the actual IPFS CID
 */
async function generateSimpleHash(str: string): Promise<string> {
  // Use Web Crypto API if available
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex.substring(0, 44); // CID length is typically 46 chars (Qm + 44)
  }

  // Fallback to simple hash for Node.js or older browsers
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).padStart(44, "0");
}

/**
 * Upload an image file to IPFS
 * For production, use Pinata or similar service
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    // For development: Convert to base64 and store locally
    const base64 = await fileToBase64(file);
    const hash = await generateSimpleHash(base64);
    const ipfsHash = `Qm${hash}`;

    if (typeof window !== "undefined") {
      const storageKey = `ipfs_img_${ipfsHash}`;
      localStorage.setItem(storageKey, base64);
      console.log("🖼️ Image stored locally with hash:", ipfsHash);
    }

    return ipfsHash;
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    throw error;
  }
}

/**
 * Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Get image URL from IPFS hash
 */
export function getIPFSImageUrl(ipfsHash: string): string {
  // Check if it's stored locally first
  if (typeof window !== "undefined") {
    const storageKey = `ipfs_img_${ipfsHash}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return stored; // Return base64 data URL
    }
  }

  // Otherwise, use IPFS gateway
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}
