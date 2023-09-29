const { ethers } = require('ethers');
const fs = require('fs');

// Manually specify the ABI and address for BridgeB
// Load ABIs and addresses from the build directory
const BridgeB = JSON.parse(fs.readFileSync('../build/contracts/BridgeB.json', 'utf8'));
const BridgeB_ABI = BridgeB.abi;
const BRIDGE_B_ADDRESS = BridgeB.networks['11155111'].address;
const BridgeA = JSON.parse(fs.readFileSync('../build/contracts/BridgeA.json', 'utf8'));
const BridgeA_ABI = BridgeA.abi;
const BRIDGE_A_ADDRESS = BridgeA.networks['5777'].address;
const TokenB = JSON.parse(fs.readFileSync('../build/contracts/TokenB.json', 'utf8'));
const TokenB_ABI = TokenB.abi;
const TOKEN_B_ADDRESS = TokenB.networks['11155111'].address;

// Other constants
const PRIVATE_KEY_A = '0x071d9fe4178632adc634d22ea549a24631d70a491cc32f6611553bd0dfbb0a47';
const PRIVATE_KEY_B = 'cd9f4f1778858e61318faaec23b36e2e20404c97cec800100df91fe0b7ca87b0';
const PROVIDER_A = 'http://localhost:7545';
const PROVIDER_B = 'https://sepolia.infura.io/v3/015b84dfa07944259f60fb55195b1a7b';
const TRANSFER_AMOUNT = 50000000000;

module.exports = async (callback) => {
  try {
    
    // Use Truffle artifacts for contracts on the development network
    const tokenA = await artifacts.require("TokenA").deployed();
    const bridgeA = await artifacts.require("BridgeA").deployed();

    // Use ethers.js for contracts on the Sepolia network
    // const providerA = new ethers.JsonRpcProvider(PROVIDER_A);
    
    const providerB = new ethers.JsonRpcProvider(PROVIDER_B);
    const providerA = new ethers.JsonRpcProvider(PROVIDER_A);
    const walletB = new ethers.Wallet(PRIVATE_KEY_B, providerB);
    const walletA = new ethers.Wallet(PRIVATE_KEY_A, providerA);
    const bridgeB = new ethers.Contract(BRIDGE_B_ADDRESS, BridgeB_ABI, walletB);
    const tokenB = new ethers.Contract(TOKEN_B_ADDRESS, TokenB_ABI, providerB);
    // const tokenB = await ethers.Contract(BridgeB.networks['11155111'].address, BridgeB_ABI, providerB);
    const bridgeABalance = await tokenA.balanceOf(BRIDGE_A_ADDRESS);
    const walletABalance = await tokenA.balanceOf(walletA.address);
    console.log(`Balance of BridgeA: ${bridgeABalance}`);
    console.log(`Balance of WalletA: ${walletABalance}`);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Set the counterpart bridge addresses after deploying the bridges
    const setCounterpartTxA = await bridgeA.setCounterpartBridge(BRIDGE_B_ADDRESS);
    //console.log(`Transaction hash for setting counterpart bridge A: ${setCounterpartTxA.tx}`); // Use tx to get the transaction hash
    const setCounterpartTxB = await bridgeB.setCounterpartBridge(BRIDGE_A_ADDRESS);
    //console.log(`Transaction hash for setting counterpart bridge B: ${setCounterpartTxB.tx}`);
    console.log(`Set counterpart bridge address for BridgeA to: ${BRIDGE_B_ADDRESS}`);
    console.log(`Set counterpart bridge address for BridgeB to: ${BRIDGE_A_ADDRESS}`);

    // Approve the BridgeA contract to transfer tokens on behalf of the owner
    await tokenA.approve(bridgeA.address, TRANSFER_AMOUNT);
    console.log(`Approved BridgeA to transfer ${TRANSFER_AMOUNT} tokens`);

    // Lock tokens in BridgeA
    await bridgeA.lockTokens(TRANSFER_AMOUNT);
    console.log(`${TRANSFER_AMOUNT} tokens locked in BridgeA`);

    // Listen for the TokensLocked event from BridgeA

    await bridgeB.releaseTokens(walletB, TRANSFER_AMOUNT);
    console.log(`${TRANSFER_AMOUNT} tokens released on BridgeB to address: ${walletB.address}`);

    const balance = await tokenB.balanceOf(walletB.address);
    console.log(`Balance of TokenB in WalletB: ${balance}`);
    const bridgebbalance = await tokenB.balanceOf(BRIDGE_B_ADDRESS);
    console.log(`Balance of TokenB in BridgeB: ${bridgebbalance}`);

    const newBridgeABalance = await tokenA.balanceOf(BRIDGE_A_ADDRESS);
    const newWalletABalance = await tokenA.balanceOf(walletA.address);

    console.log(`Balance of BridgeA: ${newBridgeABalance}`);
    console.log(`Balance of WalletA: ${newWalletABalance}`);
    
  } catch (error) {
    console.error(error);
  }
  callback();
};
