import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking Curator Status...\n");

  const curatorAddress = "0xD940Aadc4AAAEEd0Cd2Da6b1Baf8D8f8fBD56e37";

  // Get deployed contracts
  const curatorRegistryAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const icas721Address = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

  // Get contract instances
  const CuratorRegistry = await ethers.getContractFactory("CuratorRegistry");
  const curatorRegistry = CuratorRegistry.attach(curatorRegistryAddress);

  const ICAS721 = await ethers.getContractFactory("ICAS721");
  const icas721 = ICAS721.attach(icas721Address);

  // Check 1: Verify ICAS721 is connected to correct CuratorRegistry
  const connectedRegistry = await icas721.curatorRegistry();
  console.log("✅ ICAS721 Contract:", icas721Address);
  console.log("   Connected to CuratorRegistry:", connectedRegistry);
  console.log("   Expected CuratorRegistry:", curatorRegistryAddress);
  console.log("   Match:", connectedRegistry.toLowerCase() === curatorRegistryAddress.toLowerCase() ? "✅ YES" : "❌ NO");
  console.log("");

  // Check 2: Verify curator is registered
  const isRegistered = await curatorRegistry.isCurator(curatorAddress);
  console.log("✅ CuratorRegistry Check:");
  console.log("   Address:", curatorAddress);
  console.log("   Is Curator:", isRegistered ? "✅ YES" : "❌ NO");
  console.log("");

  // Check 3: Double-check with ICAS721's internal check
  try {
    // Try to call a view function that checks curator status
    const curatorCheck = await icas721.curatorRegistry();
    const registry = CuratorRegistry.attach(curatorCheck);
    const isCuratorViaICAS = await registry.isCurator(curatorAddress);
    
    console.log("✅ Verification via ICAS721:");
    console.log("   Registry Address:", curatorCheck);
    console.log("   Is Curator:", isCuratorViaICAS ? "✅ YES" : "❌ NO");
  } catch (error) {
    console.log("❌ Error checking via ICAS721:", error);
  }

  console.log("\n" + "=".repeat(50));
  if (connectedRegistry.toLowerCase() === curatorRegistryAddress.toLowerCase() && isRegistered) {
    console.log("✅ All checks passed! Curator should be able to approve.");
  } else {
    console.log("❌ Issue detected:");
    if (connectedRegistry.toLowerCase() !== curatorRegistryAddress.toLowerCase()) {
      console.log("   - ICAS721 is connected to wrong CuratorRegistry");
      console.log("   - Need to redeploy or update registry address");
    }
    if (!isRegistered) {
      console.log("   - Curator not registered in CuratorRegistry");
      console.log("   - Need to add curator to registry");
    }
  }
  console.log("=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
