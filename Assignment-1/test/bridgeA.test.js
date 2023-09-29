// Import the artifacts which are deployed by truffle migrations
const TokenA = artifacts.require('TokenA');
const BridgeA = artifacts.require('BridgeA');

contract('BridgeA', (accounts) => {
  let tokenA, bridgeA;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const amount = 100;

  before(async () => {
    // Deploy the TokenA and BridgeA contract instances
    tokenA = await TokenA.new();
    bridgeA = await BridgeA.new(tokenA.address);
  });

  it('should properly assign the token address', async () => {
    const tokenAddress = await bridgeA.token();
    assert.equal(tokenAddress, tokenA.address);
  });

  it('should properly lock tokens', async () => {
    // Approve the bridge to spend owner's tokens
    await tokenA.approve(bridgeA.address, amount, { from: owner });
    
    // Lock the tokens
    await bridgeA.lockTokens(amount, { from: owner });
  
    // Check the bridge's token balance
    const balance = await tokenA.balanceOf(bridgeA.address);
    assert.equal(balance.toString(), amount.toString());
  });
  
  it('should emit TokensLocked event when tokens are locked', async () => {
    // Approve the bridge to spend owner's tokens
    await tokenA.approve(bridgeA.address, amount, { from: owner });
    
    // Lock the tokens and get the receipt
    const receipt = await bridgeA.lockTokens(amount, { from: owner });
  
    // Check if the event is emitted
    assert.equal(receipt.logs[0].event, 'TokensLocked');
    assert.equal(receipt.logs[0].args.from, owner);
    assert.equal(receipt.logs[0].args.amount, amount);
  });
  

  it('should properly release tokens', async () => {
    // Release the tokens
    await bridgeA.releaseTokens(user2, amount, { from: owner });

    // Check user2's token balance
    const balance = await tokenA.balanceOf(user2);
    assert.equal(balance.toString(), amount.toString());
  });
});
