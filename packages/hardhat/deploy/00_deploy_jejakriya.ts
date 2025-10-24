import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploy JejaKriya Protocol Smart Contracts
 *
 * Flow:
 * 1. Deploy CuratorRegistry (untuk whitelist kurator)
 * 2. Deploy ICAS721 dengan reference ke CuratorRegistry
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployJejaKriyaContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n🚀 Deploying JejaKriya Protocol Contracts...\n");
  console.log(`📍 Deployer address: ${deployer}\n`);

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

  console.log("\n✨ Deployment Complete! ✨");
  console.log("=====================================");
  console.log("CuratorRegistry:", curatorRegistry.address);
  console.log("ICAS721:", icas721.address);
  console.log("Owner:", deployer);
  console.log("=====================================\n");

  // Network-specific instructions
  const networkName = hre.network.name;
  if (networkName === "localhost" || networkName === "hardhat") {
    console.log("📝 Local Network Detected");
    console.log("Next Steps:");
    console.log("1. Add curators: yarn hardhat add-curator --registry", curatorRegistry.address, "--curator <ADDRESS>");
    console.log("2. Start frontend: yarn start\n");
  } else {
    console.log("📝 Testnet/Mainnet Deployment");
    console.log("Next Steps:");
    console.log("1. Add curators manually:");
    console.log(
      `   yarn hardhat add-curator --registry ${curatorRegistry.address} --curator <CURATOR_ADDRESS> --network ${networkName}`,
    );
    console.log("2. Update frontend with deployed addresses");
    console.log("3. Verify contracts on block explorer\n");
  }
};

export default deployJejaKriyaContracts;

deployJejaKriyaContracts.tags = ["JejaKriya", "CuratorRegistry", "ICAS721"];
