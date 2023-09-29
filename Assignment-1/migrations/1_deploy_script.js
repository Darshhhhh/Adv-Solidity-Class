const TokenA = artifacts.require("TokenA");
const BridgeA = artifacts.require("BridgeA");
const TokenB = artifacts.require("TokenB");
const BridgeB = artifacts.require("BridgeB");

module.exports = async function (deployer, network) {
  if(network === 'development') {
    await deployer.deploy(TokenA);
    console.log("TokenA address:", TokenA.address);
    const tokenA = await TokenA.deployed();
    await deployer.deploy(BridgeA, tokenA.address);
    console.log("BridgeA address:", BridgeA.address);
  } else if(network === 'sepolia') {
    await deployer.deploy(TokenB);
    console.log("TokenB address:", TokenB.address);
    const tokenB = await TokenB.deployed();
    await deployer.deploy(BridgeB, tokenB.address);
    console.log("BridgeB address:", BridgeB.address);
    const bridgeB = await BridgeB.deployed();
    await tokenB.setBridgeAddress(bridgeB.address); // Assuming you have a setBridgeAddress function in TokenB
    console.log("BridgeB address set in TokenB");
  }
};
