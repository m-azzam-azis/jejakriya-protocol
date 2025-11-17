import { ethers } from "hardhat";
import * as deployedContracts from "../deployments/localhost/CuratorRegistry.json";

/**
 * Simple script to add curator using hardhat default accounts
 * No password required for localhost
 */
async function main() {
  // Address to add as curator
  const CURATOR_ADDRESS = "0xD940Aadc4AAAEEd0Cd2Da6b1Baf8D8f8fBD56e37";
  const REGISTRY_ADDRESS = deployedContracts.address;

  console.log("\n🎭 Adding Curator to Registry...\n");
  console.log(`Registry Address: ${REGISTRY_ADDRESS}`);

  // Get signers (hardhat accounts)
  const [deployer] = await ethers.getSigners();
  console.log(`Using account: ${deployer.address}`);

  // Get contract
  const CuratorRegistry = await ethers.getContractAt("CuratorRegistry", REGISTRY_ADDRESS);

  // Check owner
  const owner = await CuratorRegistry.owner();
  console.log(`Contract owner: ${owner}`);
  console.log(`Current signer: ${deployer.address}`);

  if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.log("\n❌ Current account is not the owner!");
    console.log("Please run this script with the deployer account.\n");
    return;
  }

  // Check if already curator
  const isAlreadyCurator = await CuratorRegistry.isCurator(CURATOR_ADDRESS);
  if (isAlreadyCurator) {
    console.log(`\n✅ ${CURATOR_ADDRESS} is already a curator!\n`);
    return;
  }

  // Add curator
  console.log(`\nAdding curator: ${CURATOR_ADDRESS}`);
  const tx = await CuratorRegistry.addCurator(CURATOR_ADDRESS);
  console.log(`⏳ Transaction sent: ${tx.hash}`);
  await tx.wait();
  console.log(`✅ Curator added successfully!`);

  // Verify
  const isCurator = await CuratorRegistry.isCurator(CURATOR_ADDRESS);
  console.log(`\n✅ Verification: ${isCurator}`);

  // Show all curators
  const curatorCount = await CuratorRegistry.getCuratorCount();
  const allCurators = await CuratorRegistry.getAllCurators();

  console.log(`\n📊 Total curators: ${curatorCount}`);
  console.log(`📋 All curators:`);
  allCurators.forEach((addr: string, i: number) => {
    console.log(`  ${i + 1}. ${addr}`);
  });
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
