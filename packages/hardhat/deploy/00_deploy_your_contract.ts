import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract, ethers } from "ethers";

/**
 * Deploys a contract named "ReliefFund"
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployReliefFund: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // 1. Get other accounts for local deployment
  const accounts = await hre.ethers.getSigners();
  const recipient = accounts[1];
  const oracle1 = accounts[2];
  const oracle2 = accounts[3];
  const oracle3 = accounts[4];

  // 2. Define constructor arguments for ReliefFund
  const _recipient = recipient.address;
  const _oracles = [oracle1.address, oracle2.address, oracle3.address];
  const _requiredVotes = 2; // 2 out of 3 oracles must approve
  // REMOVED: _payoutAmounts

  await deploy("ReliefFund", {
    from: deployer,
    // Contract constructor arguments
    // UPDATED: Removed _payoutAmounts
    args: [_recipient, _oracles, _requiredVotes],
    log: true,
    autoMine: true,
  });

  // 3. Get the deployed contract and log its actual values
  const reliefFund = await hre.ethers.getContract<Contract>("ReliefFund", deployer);

  console.log("🚀 ReliefFund deployed!");
  console.log("   - Recipient (Account 1):", await reliefFund.recipient());
  console.log("   - Oracles:", _oracles.join(", ")); // Log the local array
  console.log("   - Required Votes:", (await reliefFund.requiredVotes()).toString());
  // REMOVED: Milestone logs, as there are none at deployment
};

export default deployReliefFund;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags ReliefFund
deployReliefFund.tags = ["ReliefFund"];
