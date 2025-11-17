// ignore lint
/* eslint-disable */

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

task("show-private-key", "Show decrypted private key (BE CAREFUL!)").setAction(async (taskArgs, hre) => {
  console.log("\n⚠️  WARNING: This will display your private key!");
  console.log("⚠️  Make sure no one is looking at your screen!\n");

  const encryptedJson = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;

  if (!encryptedJson) {
    console.log("❌ ERROR: DEPLOYER_PRIVATE_KEY_ENCRYPTED not found");
    return;
  }

  const password = await getPassword();

  try {
    const wallet = await Wallet.fromEncryptedJson(encryptedJson, password);
    console.log("\n✅ Wallet decrypted successfully");
    console.log(`📍 Address: ${wallet.address}`);
    console.log(`🔑 Private Key: ${wallet.privateKey}`);
    console.log("\n⚠️  NEVER share this private key with anyone!");
    console.log("⚠️  Clear your terminal after copying!\n");
  } catch (error) {
    console.log("❌ ERROR: Failed to decrypt wallet. Wrong password?");
  }
});
