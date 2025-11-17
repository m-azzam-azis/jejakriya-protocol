import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploy MockUSDC contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMockUSDC: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("MockUSDC", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get deployed contract
  const mockUSDC = await hre.ethers.getContract<Contract>("MockUSDC", deployer);
  console.log("💰 MockUSDC deployed at:", await mockUSDC.getAddress());
  
  // Mint initial supply to some test accounts
  const accounts = await hre.ethers.getSigners();
  
  // Give USDC to first 5 accounts for testing
  for (let i = 0; i < Math.min(5, accounts.length); i++) {
    const account = accounts[i];
    const mintAmount = 50_000 * 1_000_000; // 50k USDC with 6 decimals
    console.log(`💵 Minting 50,000 USDC to ${account.address}`);
    await mockUSDC.mint(account.address, mintAmount);
  }

  console.log("✅ MockUSDC deployment complete!");
};

export default deployMockUSDC;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags MockUSDC
deployMockUSDC.tags = ["MockUSDC"];
