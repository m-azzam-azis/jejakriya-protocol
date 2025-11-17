import { task } from "hardhat/config";
import { Wallet } from "ethers";
import * as readline from "readline";

async function getPassword(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question("🔐 Enter password to decrypt private key: ", password => {
      rl.close();
      resolve(password);
    });
  });
}

task("add-curator", "Add a curator to the registry")
  .addParam("registry", "CuratorRegistry contract address")
  .addParam("curator", "Address to add as curator")
  .setAction(async (taskArgs, hre) => {
    const { registry, curator } = taskArgs;

    console.log("\n🔍 Setting up deployer account...");

    // Get encrypted keystore from environment
    const encryptedJson = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;

    if (!encryptedJson) {
      console.log("❌ ERROR: DEPLOYER_PRIVATE_KEY_ENCRYPTED not found in environment");
      return;
    }

    // Ask for password
    const password = await getPassword();

    // Decrypt the keystore
    let deployerSigner: any;
    try {
      const wallet = await Wallet.fromEncryptedJson(encryptedJson, password);
      deployerSigner = wallet.connect(hre.ethers.provider);
      console.log(`✅ Wallet decrypted successfully`);
    } catch (error) {
      console.log(error);
      return;
    }

    console.log(`Your address: ${deployerSigner.address}`);

    const CuratorRegistry = await hre.ethers.getContractAt("CuratorRegistry", registry, deployerSigner);

    // Check owner
    const owner: string = await CuratorRegistry.owner();
    console.log(`Contract owner: ${owner}`);

    if (owner.toLowerCase() !== deployerSigner.address.toLowerCase()) {
      console.log("\n❌ ERROR: You are NOT the contract owner!");
      console.log("Only the owner can add curators.\n");
      return;
    }

    console.log("✅ Ownership verified!\n");

    console.log("📋 Adding curator...");
    console.log(`Registry: ${registry}`);
    console.log(`Curator: ${curator}`);

    // Check if already curator
    const isCurator: boolean = await CuratorRegistry.isCurator(curator);
    if (isCurator) {
      console.log(`⚠️ Address is already a curator!\n`);
      return;
    }

    const tx = await CuratorRegistry.addCurator(curator);
    console.log(`⏳ Transaction sent: ${tx.hash}`);
    await tx.wait();

    console.log(`✅ Curator added successfully!`);

    // Verify
    const curatorCount = await CuratorRegistry.getCuratorCount();
    const allCurators: string[] = await CuratorRegistry.getAllCurators();

    console.log(`\n📊 Total curators: ${curatorCount}`);
    console.log(`📋 All curators:`);
    allCurators.forEach((addr: string, i: number) => {
      console.log(`  ${i + 1}. ${addr}`);
    });

    console.log("\n");
  });
