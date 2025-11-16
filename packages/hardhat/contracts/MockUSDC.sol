// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing on localhost
 * Using 6 decimals like real USDC
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private _decimals = 6;

    constructor() ERC20("Mock USD Coin", "USDC") Ownable(msg.sender) {
        // Mint 1,000,000 USDC to deployer for testing
        _mint(msg.sender, 1_000_000 * 10**_decimals);
    }

    /**
     * @dev Override decimals to match real USDC (6 decimals)
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Mint new tokens - only for testing
     * @param to Address to receive tokens
     * @param amount Amount to mint (in USDC units, not wei)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * 10**_decimals);
    }

    /**
     * @dev Faucet function - anyone can get 10,000 USDC for testing
     */
    function faucet() external {
        _mint(msg.sender, 10_000 * 10**_decimals);
    }

    /**
     * @dev Mint tokens to specific address with exact amount
     * @param to Address to receive tokens
     * @param amount Exact amount in smallest unit (with decimals)
     */
    function mintExact(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
