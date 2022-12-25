import { ethers } from "hardhat";
import { signERC2612Permit } from "eth-permit";
import { expect } from "chai";

describe("TollTicketShop", () => {
  it("should allow purchasing toll ticket", async () => {
    const [rubxTokenOwner, tollPassOwner, tollPassShopOwner, alice] =
      await ethers.getSigners();

    const RUBXToken = await ethers.getContractFactory("RUBXToken");
    const rubxToken = await RUBXToken.connect(rubxTokenOwner).deploy(
      100_000_00,
    );

    const TollTicket = await ethers.getContractFactory("TollTicket");
    const tollTicket = await TollTicket.connect(tollPassOwner).deploy();

    const TollTicketShop = await ethers.getContractFactory("TollTicketShop");
    const tollTicketShop = await TollTicketShop.connect(tollPassShopOwner).deploy(
      rubxToken.address,
      tollTicket.address,
    );

    // Transfer 10 000 RUBX to Alice
    await rubxToken.transfer(alice.address, 10_000_00);

    const tollPassPrice = 200_00;
    // Alice generates permit signature to allow toll pass shot spend her tokens
    const permit = await signERC2612Permit(
      ethers.provider,
      rubxToken.address,
      alice.address,
      tollTicketShop.address,
      tollPassPrice,
    );

    expect(permit).not.to.be.undefined;

    const purchaseResult = await tollTicketShop
      .connect(alice)
      .purchaseTollTicket(
        alice.address,
        tollTicketShop.address,
        tollPassPrice,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s,
      );
    expect(purchaseResult).not.to.be.undefined;

    // Alice spent tokens for toll pass
    expect(await rubxToken.balanceOf(alice.address)).to.be.equal(9_800_00);

    // Shop received tokens
    expect(await rubxToken.balanceOf(tollTicketShop.address)).to.be.equal(200_00);

    // Check toll pass exists on Alice's account
    expect(await tollTicket.balanceOf(alice.address)).to.be.equal(1);

    // We checked that toll pass contract has registered the token for Alice
    const { value: tollPassTokenId } = purchaseResult;
    expect(await tollTicket.ownerOf(tollPassTokenId)).to.be.equal(alice.address);
  });
});
