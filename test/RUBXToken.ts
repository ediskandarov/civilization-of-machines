import { ethers } from "hardhat";
import { expect } from "chai";

describe("RUBXToken", () => {
  it("Should create token with fixed supply and transfer", async () => {
    const [cbr, alice, bob] = await ethers.getSigners();

    const RUBXToken = await ethers.getContractFactory("RUBXToken");

    // 10k RUBX (100 for kopeck)
    const token = await RUBXToken.connect(cbr).deploy(10_000_00);

    token.transfer(alice.getAddress(), 3_000_00);

    token.connect(alice).transfer(bob.getAddress(), 200_00);

    expect(await token.balanceOf(alice.getAddress())).to.equal(2_800_00);
    expect(await token.balanceOf(bob.getAddress())).to.equal(200_00);
  });
});
