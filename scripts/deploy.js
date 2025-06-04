import { ethers } from "ethers";
import fs from "fs";

// Load deploy config
const config = JSON.parse(fs.readFileSync("./deploy.json", "utf8"));

// Provider and signer
const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);

// Load compiled contract artifact
const artifact = JSON.parse(fs.readFileSync(config.artifactPath, "utf8"));
const { abi, bytecode } = artifact;

// Deploy the contract
async function main() {
  console.log(`Deploying ${config.contractName} to ${config.network}...`);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy(...config.constructorArgs);

  console.log("Deploy tx sent:", contract.deploymentTransaction().hash);
  await contract.waitForDeployment();

  console.log(`${config.contractName} deployed at:`, contract.target);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
