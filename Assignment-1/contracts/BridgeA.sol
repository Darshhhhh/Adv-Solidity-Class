// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeA is Ownable {
    IERC20 public token;
    address public counterpartBridge;

    // Event to notify that tokens are locked and can be processed by the off-chain script
    event TokensLocked(address indexed from, uint256 amount);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function setCounterpartBridge(address _counterpartBridge) external onlyOwner {
        counterpartBridge = _counterpartBridge;
    }

    function lockTokens(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit TokensLocked(msg.sender, amount); // Emitting event after locking tokens
    }

    function releaseTokens(address to, uint256 amount) external {
        // require(msg.sender == counterpartBridge, "Only counterpart bridge can release tokens");
        require(token.transfer(to, amount), "Transfer failed");
    }
}
