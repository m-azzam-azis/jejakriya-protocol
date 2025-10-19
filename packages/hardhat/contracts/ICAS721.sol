// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./CuratorRegistry.sol";

/**
 * @title ICAS721 (Indonesian Craft Asset - ERC721)
 * @dev NFT Standard untuk aset kriya Indonesia dengan approval kurator
 * @notice Flow: Agen submit → Kurator approve → NFT minted ke pengrajin
 */
contract ICAS721 is ERC721URIStorage {
    // Counter untuk token ID
    uint256 private _tokenIds;
    
    // Reference ke CuratorRegistry contract
    CuratorRegistry public curatorRegistry;
    
    /**
     * @dev Metadata tambahan untuk setiap NFT
     * @notice Data ini immutable setelah mint
     */
    struct Metadata {
        string regionCode;          // Kode wilayah (e.g., "JT-SMG" untuk Jawa Tengah - Semarang)
        address artisanAddress;     // Address pengrajin pemilik asli
        address curatorAddress;     // Address kurator yang approve
        uint256 timestamp;          // Waktu approval/mint
        string category;            // Kategori produk (tenun, batik, ukiran, dll)
    }
    
    /**
     * @dev Data untuk pending approval request
     */
    struct MintRequest {
        address artisan;
        string regionCode;
        string category;
        string ipfsHash;
        address submittedBy;        // Agen yang submit
        uint256 submittedAt;
        bool exists;
    }
    
    // Mapping token ID → metadata
    mapping(uint256 => Metadata) public tokenMetadata;
    
    // Mapping request ID → mint request data
    mapping(bytes32 => MintRequest) public mintRequests;
    
    // Array untuk tracking pending requests (untuk UI kurator)
    bytes32[] public pendingRequestIds;
    mapping(bytes32 => uint256) private requestIndex;
    
    // Events
    event MintRequested(
        bytes32 indexed requestId,
        address indexed artisan,
        address indexed submittedBy,
        string regionCode,
        string ipfsHash,
        uint256 timestamp
    );
    
    event MintApproved(
        bytes32 indexed requestId,
        uint256 indexed tokenId,
        address indexed curator,
        address artisan,
        uint256 timestamp
    );
    
    event MintRejected(
        bytes32 indexed requestId,
        address indexed curator,
        string reason,
        uint256 timestamp
    );
    
    /**
     * @dev Constructor
     * @param _curatorRegistry Address dari CuratorRegistry contract
     */
    constructor(address _curatorRegistry) ERC721("IndonesianCraftAsset", "ICAS") {
        require(_curatorRegistry != address(0), "Invalid registry address");
        curatorRegistry = CuratorRegistry(_curatorRegistry);
    }
    
    /**
     * @dev Agen submit request untuk mint NFT (belum di-mint, pending approval)
     * @param artisan Address pengrajin yang akan menerima NFT
     * @param regionCode Kode wilayah asal produk
     * @param category Kategori produk kriya
     * @param ipfsHash Hash IPFS untuk metadata JSON (foto + detail produk)
     * @return requestId ID unik untuk request ini
     */
    function requestMint(
        address artisan,
        string memory regionCode,
        string memory category,
        string memory ipfsHash
    ) external returns (bytes32 requestId) {
        require(artisan != address(0), "Invalid artisan address");
        require(bytes(regionCode).length > 0, "Region code required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        // Generate unique request ID
        requestId = keccak256(
            abi.encodePacked(
                artisan,
                regionCode,
                category,
                ipfsHash,
                msg.sender,
                block.timestamp,
                _tokenIds // Add counter untuk ensure uniqueness
            )
        );
        
        require(!mintRequests[requestId].exists, "Request already exists");
        
        // Store request data
        mintRequests[requestId] = MintRequest({
            artisan: artisan,
            regionCode: regionCode,
            category: category,
            ipfsHash: ipfsHash,
            submittedBy: msg.sender,
            submittedAt: block.timestamp,
            exists: true
        });
        
        // Add to pending list
        pendingRequestIds.push(requestId);
        requestIndex[requestId] = pendingRequestIds.length - 1;
        
        emit MintRequested(
            requestId,
            artisan,
            msg.sender,
            regionCode,
            ipfsHash,
            block.timestamp
        );
        
        return requestId;
    }
    
    /**
     * @dev Kurator approve request dan mint NFT
     * @param requestId ID dari pending request
     * @notice Hanya kurator terverifikasi yang bisa approve
     */
    function approveMint(bytes32 requestId) external {
        require(curatorRegistry.isCurator(msg.sender), "Not a verified curator");
        require(mintRequests[requestId].exists, "Request not found");
        
        MintRequest memory request = mintRequests[requestId];
        
        // Increment token ID counter
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        // Mint NFT ke pengrajin
        _safeMint(request.artisan, newTokenId);
        
        // Set token URI (IPFS hash untuk metadata)
        string memory tokenURI = string(abi.encodePacked("ipfs://", request.ipfsHash));
        _setTokenURI(newTokenId, tokenURI);
        
        // Store metadata on-chain
        tokenMetadata[newTokenId] = Metadata({
            regionCode: request.regionCode,
            artisanAddress: request.artisan,
            curatorAddress: msg.sender,
            timestamp: block.timestamp,
            category: request.category
        });
        
        // Remove from pending list
        _removePendingRequest(requestId);
        
        emit MintApproved(
            requestId,
            newTokenId,
            msg.sender,
            request.artisan,
            block.timestamp
        );
    }
    
    /**
     * @dev Kurator reject request
     * @param requestId ID dari pending request
     * @param reason Alasan penolakan
     */
    function rejectMint(bytes32 requestId, string memory reason) external {
        require(curatorRegistry.isCurator(msg.sender), "Not a verified curator");
        require(mintRequests[requestId].exists, "Request not found");
        
        // Remove from pending list
        _removePendingRequest(requestId);
        
        emit MintRejected(requestId, msg.sender, reason, block.timestamp);
    }
    
    /**
     * @dev Internal function untuk remove request dari pending list
     */
    function _removePendingRequest(bytes32 requestId) private {
        uint256 index = requestIndex[requestId];
        uint256 lastIndex = pendingRequestIds.length - 1;
        
        if (index != lastIndex) {
            bytes32 lastRequestId = pendingRequestIds[lastIndex];
            pendingRequestIds[index] = lastRequestId;
            requestIndex[lastRequestId] = index;
        }
        
        pendingRequestIds.pop();
        delete requestIndex[requestId];
        delete mintRequests[requestId];
    }
    
    /**
     * @dev Get jumlah pending requests
     */
    function getPendingRequestCount() external view returns (uint256) {
        return pendingRequestIds.length;
    }
    
    /**
     * @dev Get semua pending request IDs
     */
    function getPendingRequests() external view returns (bytes32[] memory) {
        return pendingRequestIds;
    }
    
    /**
     * @dev Get detail dari mint request
     */
    function getMintRequest(bytes32 requestId) external view returns (
        address artisan,
        string memory regionCode,
        string memory category,
        string memory ipfsHash,
        address submittedBy,
        uint256 submittedAt
    ) {
        require(mintRequests[requestId].exists, "Request not found");
        MintRequest memory request = mintRequests[requestId];
        
        return (
            request.artisan,
            request.regionCode,
            request.category,
            request.ipfsHash,
            request.submittedBy,
            request.submittedAt
        );
    }
    
    /**
     * @dev Get total NFT yang sudah di-mint
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Get metadata NFT
     */
    function getTokenMetadata(uint256 tokenId) external view returns (
        string memory regionCode,
        address artisanAddress,
        address curatorAddress,
        uint256 timestamp,
        string memory category
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        Metadata memory meta = tokenMetadata[tokenId];
        
        return (
            meta.regionCode,
            meta.artisanAddress,
            meta.curatorAddress,
            meta.timestamp,
            meta.category
        );
    }
}
