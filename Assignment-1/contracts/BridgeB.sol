// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TokenB.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeB is Ownable {
    TokenB public token;
    address public counterpartBridge;

    event TokensReleased(address indexed to, uint256 amount);

    constructor(address _token) {
        token = TokenB(_token);
    }

    function setCounterpartBridge(address _counterpartBridge) external onlyOwner {
        counterpartBridge = _counterpartBridge;
    }

    function releaseTokens(address to, uint256 amount) external {
        // require(msg.sender == counterpartBridge, "Only counterpart bridge can release tokens");
        token.mint(to, amount); // Call the mint function of TokenB
        emit TokensReleased(to, amount);
    }
}


// is it possible to do calculations locally, not on EVM?
// Offchain data processing
// Offchain looping
// < and <= , use < 
// uint256 is better than uint8
// Batch processing 
// Use IPFS for storing data 
// Use libraries like SafeMath and OpenZeppelin 
// Short circuiting  
// ABI encoder V2 
// use unchecked for arithmetic operations 
// use calldata instead of memory for function parameters, if you don't need to modify them in the function body 
// use immutable instead of constant. Why? 
// remove unnecessary code
// use preompiled contracts 
// use in-line assembly code 
// Understand L2 solutions
// Use optimizer tools. Ex: solc, truffle build, remix, hardhat, etc.
// Use latest version of Solidity
// Lock pragma to a specific version
// Use the same solidity version for all contracts



// Design Patterns
// Logic contracts and data contracts(Storage contracts)
// Proxy contracts - Proxy pattern
// Satellite pattern - 
// Diamond pattern - 
