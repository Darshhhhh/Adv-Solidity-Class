// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingContract {
    // Mapping to track user balances
    mapping(address => uint256) public balances;
    
    // Function to deposit assets
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
    }
    
    // Function to borrow assets
    function borrow(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
    }
    
    // Function to check account balance
    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
