import { ethers } from "hardhat";
import { signERC2612Permit } from "eth-permit";
import { expect } from "chai";

describe("GasStationShop", () => {
  it("Should be able to purchase gas", async () => {
    const [cbrAccount, gasStationShopAccount, consumerVehicleAccount] =
      await ethers.getSigners();

    const RUBXToken = await ethers.getContractFactory("RUBXToken");
    const rubxToken = await RUBXToken.connect(cbrAccount).deploy(1_000_000_00);

    const GasStationSKU = await ethers.getContractFactory("GasStationSKU");
    const gasStationSKU = await GasStationSKU.connect(
      gasStationShopAccount,
    ).deploy();

    const GasStationShop = await ethers.getContractFactory("GasStationShop");
    const gasStationShop = await GasStationShop.connect(
      gasStationShopAccount,
    ).deploy(rubxToken.address, gasStationSKU.address);

    // Transfer 10 000 RUB to consumer vehicle
    await rubxToken.transfer(consumerVehicleAccount.address, 10_000_00);

    // Fill gas station with 100 000 liters of diesel
    await gasStationSKU.mint(
      gasStationShop.address,
      gasStationSKU.DIESEL(),
      100_000,
      [],
    );

    expect(
      await gasStationSKU.balanceOf(
        gasStationShop.address,
        gasStationSKU.DIESEL(),
      ),
    ).to.be.equal(100_000);

    const permit = await signERC2612Permit(
      ethers.provider,
      rubxToken.address,
      consumerVehicleAccount.address,
      gasStationShop.address,
      1_000_00,
    );
    await gasStationShop
      .connect(consumerVehicleAccount)
      .purchaseGas(
        gasStationSKU.DIESEL(),
        consumerVehicleAccount.address,
        gasStationShop.address,
        1_000_00,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s,
      );

    // Consumer vehicles should spend RUBX tokens and receive diesel tokens
    expect(
      await rubxToken.balanceOf(consumerVehicleAccount.address),
    ).to.be.equal(9_000_00);

    expect(
      await gasStationSKU.balanceOf(
        consumerVehicleAccount.address,
        gasStationSKU.DIESEL(),
      ),
    ).to.be.equal(18);

    // Gas station should receive RUBX tokens and spend diesel tokens
    expect(await rubxToken.balanceOf(gasStationShop.address)).to.be.equal(
      1_000_00,
    );

    expect(
      await gasStationSKU.balanceOf(
        gasStationShop.address,
        gasStationSKU.DIESEL(),
      ),
    ).to.be.equal(99_982);
  });
});
