import { ethers } from "hardhat";

/**
 * Setup test curators for development
 * Adds Hardhat test accounts #1-3 as curators
 */
async function main() {
  console.log("\n🎭 Setting up Test Curators...\n");

  // Get the deployed contract
  const curatorRegistry = await ethers.getContract("CuratorRegistry");
  const accounts = await ethers.getSigners();

  // Add accounts #1, #2, #3 as curators
  const curators = [
    accounts[1].address, // Ibu Wati (primary curator)
    accounts[2].address, // Backup curator 1
    accounts[3].address, // Backup curator 2
  ];

  for (let i = 0; i < curators.length; i++) {
    const curatorAddress = curators[i];
    console.log(`Adding curator #${i + 1}: ${curatorAddress}`);

    const tx = await curatorRegistry.addCurator(curatorAddress);
    await tx.wait();

    // Verify
    const isCurator = await curatorRegistry.isCurator(curatorAddress);
    console.log(`✅ Curator #${i + 1} verified: ${isCurator}\n`);
  }

  console.log("✨ All test curators added successfully!\n");
  console.log("📋 Curator Addresses:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  curators.forEach((addr, i) => {
    console.log(`Curator #${i + 1}: ${addr}`);
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
