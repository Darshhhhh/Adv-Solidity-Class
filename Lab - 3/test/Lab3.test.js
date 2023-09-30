const LendingContract = artifacts.require("LendingContract");

contract("LendingContract", (accounts) => {
  let lendingContract;
  const user1 = accounts[0];
  const user2 = accounts[1];

  beforeEach(async () => {
    lendingContract = await LendingContract.new();
  });

  it("should allow users to deposit assets", async () => {
    const depositAmount = web3.utils.toWei("1", "ether");
    await lendingContract.deposit({ from: user1, value: depositAmount });
    const balance = await lendingContract.getBalance({ from: user1 });
    assert.equal(
      balance.toString(),
      depositAmount,
      "Balance not updated correctly"
    );
  });

  it("should allow users to borrow assets if they have enough collateral", async () => {
    const depositAmount = web3.utils.toWei("2", "ether");
    const borrowAmount = web3.utils.toWei("1", "ether");
    await lendingContract.deposit({ from: user1, value: depositAmount });
    await lendingContract.borrow(borrowAmount, { from: user1 });
    const balance = await lendingContract.getBalance({ from: user1 });
    assert.equal(
      balance.toString(),
      depositAmount - borrowAmount,
      "Balance not updated correctly after borrowing"
    );
  });

  it("should not allow users to borrow assets if they don't have enough collateral", async () => {
    const depositAmount = web3.utils.toWei("1", "ether");
    const borrowAmount = web3.utils.toWei("2", "ether");
    await lendingContract.deposit({ from: user1, value: depositAmount });
    try {
      await lendingContract.borrow(borrowAmount, { from: user1 });
      assert.fail("Borrowing should fail");
    } catch (error) {
      assert(
        error.toString().includes("Insufficient balance"),
        "Expected error message not received"
      );
    }
  });

  it("should return the correct account balance", async () => {
    const depositAmount = web3.utils.toWei("1", "ether");
    await lendingContract.deposit({ from: user1, value: depositAmount });
    const balance = await lendingContract.getBalance({ from: user1 });
    assert.equal(
      balance.toString(),
      depositAmount,
      "Balance not returned correctly"
    );
  });
});
