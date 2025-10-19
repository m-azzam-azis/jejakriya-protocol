// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CuratorRegistry
 * @dev Smart contract untuk manajemen whitelist kurator
 * @notice Hanya owner (Kemenparekraf/Ekraf) yang bisa menambah/menghapus kurator
 */
contract CuratorRegistry is Ownable {
    // Mapping untuk cek apakah address adalah kurator yang terverifikasi
    mapping(address => bool) public isCurator;
    
    // Array untuk tracking semua kurator (untuk UI)
    address[] public curators;
    mapping(address => uint256) private curatorIndex;
    
    // Events untuk tracking perubahan
    event CuratorAdded(address indexed curator, uint256 timestamp);
    event CuratorRemoved(address indexed curator, uint256 timestamp);
    
    /**
     * @dev Menambahkan kurator baru ke whitelist
     * @param _curator Address kurator yang akan ditambahkan
     */
    function addCurator(address _curator) external onlyOwner {
        require(_curator != address(0), "Invalid curator address");
        require(!isCurator[_curator], "Curator already exists");
        
        isCurator[_curator] = true;
        curators.push(_curator);
        curatorIndex[_curator] = curators.length - 1;
        
        emit CuratorAdded(_curator, block.timestamp);
    }
    
    /**
     * @dev Menghapus kurator dari whitelist
     * @param _curator Address kurator yang akan dihapus
     */
    function removeCurator(address _curator) external onlyOwner {
        require(isCurator[_curator], "Curator does not exist");
        
        isCurator[_curator] = false;
        
        // Remove from array (swap with last element)
        uint256 index = curatorIndex[_curator];
        uint256 lastIndex = curators.length - 1;
        
        if (index != lastIndex) {
            address lastCurator = curators[lastIndex];
            curators[index] = lastCurator;
            curatorIndex[lastCurator] = index;
        }
        
        curators.pop();
        delete curatorIndex[_curator];
        
        emit CuratorRemoved(_curator, block.timestamp);
    }
    
    /**
     * @dev Mendapatkan jumlah total kurator
     * @return Jumlah kurator yang terdaftar
     */
    function getCuratorCount() external view returns (uint256) {
        return curators.length;
    }
    
    /**
     * @dev Mendapatkan daftar semua kurator
     * @return Array address kurator
     */
    function getAllCurators() external view returns (address[] memory) {
        return curators;
    }
    
    /**
     * @dev Constructor - set deployer sebagai owner
     */
    constructor() Ownable(msg.sender) {
        // Owner akan menjadi address yang deploy contract ini
        // Biasanya untuk testing, ini adalah address dari Kemenparekraf/Ekraf
    }
}
