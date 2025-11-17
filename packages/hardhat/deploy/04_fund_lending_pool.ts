import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Fund LendingPool with USDC liquidity
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const fundLendingPool: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  // Get deployed contracts
  const mockUSDC = await hre.ethers.getContract<Contract>("MockUSDC", deployer);
  const lendingPool = await hre.ethers.getContract<Contract>("LendingPool", deployer);

  const lendingPoolAddress = await lendingPool.getAddress();

  // Fund LendingPool with 500,000 USDC liquidity
  const liquidityAmount = 500_000 * 1_000_000; // 500k USDC (with 6 decimals)
  
  console.log(`💰 Funding LendingPool at ${lendingPoolAddress} with liquidity...`);
  await mockUSDC.mint(lendingPoolAddress, liquidityAmount);
  
  const poolBalance = await mockUSDC.balanceOf(lendingPoolAddress);
  console.log(`✅ LendingPool funded with ${Number(poolBalance) / 1_000_000} USDC`);
};

export default fundLendingPool;

fundLendingPool.tags = ["FundLendingPool"];
fundLendingPool.dependencies = ["LendingPool", "MockUSDC"];
