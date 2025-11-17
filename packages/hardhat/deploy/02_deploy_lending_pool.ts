import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the LendingPool contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployLendingPool: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get the ICAS721 contract address
  const icas721Deployment = await hre.deployments.get("ICAS721");
  const icas721Address = icas721Deployment.address;

  // Get the MockUSDC contract address
  const mockUSDCDeployment = await hre.deployments.get("MockUSDC");
  const mockUSDCAddress = mockUSDCDeployment.address;

  await deploy("LendingPool", {
    from: deployer,
    args: [icas721Address, mockUSDCAddress],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const lendingPool = await hre.ethers.getContract<Contract>("LendingPool", deployer);
  console.log("✅ LendingPool deployed at:", await lendingPool.getAddress());
  console.log("   NFT Contract:", icas721Address);
  console.log("   USDC Contract:", mockUSDCAddress);
};

export default deployLendingPool;

deployLendingPool.tags = ["LendingPool"];
deployLendingPool.dependencies = ["ICAS721", "MockUSDC"];
