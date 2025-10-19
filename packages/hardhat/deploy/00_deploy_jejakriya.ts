import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploy JejaKriya Protocol Smart Contracts
 *
 * Flow:
 * 1. Deploy CuratorRegistry (untuk whitelist kurator)
 * 2. Deploy ICAS721 dengan reference ke CuratorRegistry
 * 3. Setup initial curator (owner sebagai first curator untuk testing)
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployJejaKriyaContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n🚀 Deploying JejaKriya Protocol Contracts...\n");

  // ===== 1. Deploy CuratorRegistry =====
  console.log("📋 Deploying CuratorRegistry...");
  const curatorRegistry = await deploy("CuratorRegistry", {
    from: deployer,
    args: [], // No constructor args, deployer becomes owner
    log: true,
    autoMine: true,
  });

  console.log("✅ CuratorRegistry deployed at:", curatorRegistry.address);

  // ===== 2. Deploy ICAS721 =====
  console.log("\n🎨 Deploying ICAS721 NFT Contract...");
  const icas721 = await deploy("ICAS721", {
    from: deployer,
    args: [curatorRegistry.address], // Pass CuratorRegistry address
    log: true,
    autoMine: true,
  });

  console.log("✅ ICAS721 deployed at:", icas721.address);

  // ===== 3. Setup Test Curators (For Development) =====
  console.log("\n👤 Adding test curators for development...");
  const CuratorRegistry = await hre.ethers.getContractAt("CuratorRegistry", curatorRegistry.address);

  // Get hardhat test accounts
  const accounts = await hre.ethers.getSigners();

  // Add Account #1, #2, #3 as curators (skip #0 which is owner/deployer)
  const curatorAddresses = [
    accounts[1].address, // Ibu Wati (Curator 1)
    accounts[2].address, // Pak Budi (Curator 2)
    accounts[3].address, // Bu Siti (Curator 3)
  ];

  for (let i = 0; i < curatorAddresses.length; i++) {
    const tx = await CuratorRegistry.addCurator(curatorAddresses[i]);
    await tx.wait();
    console.log(`  ✅ Added curator ${i + 1}: ${curatorAddresses[i]}`);
  }

  console.log("\n✨ Deployment Complete! ✨");
  console.log("=====================================");
  console.log("CuratorRegistry:", curatorRegistry.address);
  console.log("ICAS721:", icas721.address);
  console.log("=====================================\n");

  console.log("\n📝 Test Accounts Setup:");
  console.log("Owner/Deployer:", deployer);
  console.log("Curator 1 (Ibu Wati):", curatorAddresses[0]);
  console.log("Curator 2 (Pak Budi):", curatorAddresses[1]);
  console.log("Curator 3 (Bu Siti):", curatorAddresses[2]);
  console.log("\n📝 Next Steps:");
  console.log("1. Start frontend: yarn start");
  console.log("2. Connect wallet with curator account");
  console.log("3. Agents submit via /agen/produk/baru");
  console.log("4. Curators approve via /kurator");
  console.log("5. View NFTs at /pemilik 🎉\n");
};

export default deployJejaKriyaContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags JejaKriya
deployJejaKriyaContracts.tags = ["JejaKriya", "CuratorRegistry", "ICAS721"];
