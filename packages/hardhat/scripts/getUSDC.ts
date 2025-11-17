import { ethers } from "hardhat";

/**
 * Simple faucet script to get USDC tokens
 * Anyone can call this to get 10,000 USDC for testing
 */
async function main() {
  console.log("\n💰 USDC Faucet - Get Free Test USDC\n");

  // Get current signer
  const [signer] = await ethers.getSigners();
  console.log(`Requesting USDC for: ${signer.address}`);

  // Get MockUSDC contract
  const mockUSDC = await ethers.getContract("MockUSDC");
  const usdcAddress = await mockUSDC.getAddress();
  console.log(`USDC Contract: ${usdcAddress}`);

  // Check balance before
  const balanceBefore = await mockUSDC.balanceOf(signer.address);
  console.log(`Balance before: ${ethers.formatUnits(balanceBefore, 6)} USDC`);

  // Call faucet
  console.log("\n⏳ Requesting 10,000 USDC from faucet...");
  const tx = await mockUSDC.faucet();
  await tx.wait();
  console.log(`✅ Transaction: ${tx.hash}`);

  // Check balance after
  const balanceAfter = await mockUSDC.balanceOf(signer.address);
  console.log(`\n💵 Balance after: ${ethers.formatUnits(balanceAfter, 6)} USDC`);
  console.log(`💰 Received: ${ethers.formatUnits(balanceAfter - balanceBefore, 6)} USDC\n`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
