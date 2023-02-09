import { run, network, ethers } from 'hardhat';
import signale from 'signale';

async function main() {
  signale.pending(`Deploying BloomReceipts contract to ${network.name} \n`);
  const ContractFactory = await ethers.getContractFactory('BloomReceipts');
  const contract = await ContractFactory.deploy();
  await contract.deployed();
  signale.success(
    `BloomReceipts contract was deployed to:${contract.address} 🚀🚀  `
  );
  signale.pending(`Waiting for contract to be mined...`);
  await contract.deployTransaction.wait(10);
  await verify(contract.address, []);
}
async function verify(contractAddress: string, args: any[]) {
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes('already verified')) {
      signale.complete('Contract already verified');
    }
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
