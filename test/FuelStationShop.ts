import { ethers } from "hardhat";
import { signERC2612Permit } from "eth-permit";
import { expect } from "chai";

describe("FuelStationShop", () => {
  it("Should be able to purchase fuel", async () => {
    const [cbrAccount, fuelStationShopAccount, consumerVehicleAccount] =
      await ethers.getSigners();

    const RUBXToken = await ethers.getContractFactory("RUBXToken");
    const rubxToken = await RUBXToken.connect(cbrAccount).deploy(1_000_000_00);

    const FuelRegistry = await ethers.getContractFactory("FuelRegistry");
    const fuelRegistry = await FuelRegistry.connect(
      fuelStationShopAccount,
    ).deploy();

    const FuelStationShop = await ethers.getContractFactory("FuelStationShop");
    const fuelStationShop = await FuelStationShop.connect(
      fuelStationShopAccount,
    ).deploy(rubxToken.address, fuelRegistry.address);

    // Transfer 10 000 RUB to consumer vehicle
    await rubxToken.transfer(consumerVehicleAccount.address, 10_000_00);

    // Fill gas station with 100 000 liters of diesel
    await fuelRegistry.mint(
      fuelStationShop.address,
      fuelRegistry.DIESEL(),
      100_000,
      [],
    );

    expect(
      await fuelRegistry.balanceOf(
        fuelStationShop.address,
        fuelRegistry.DIESEL(),
      ),
    ).to.be.equal(100_000);

    // purchase flow
    const permit = await signERC2612Permit(
      ethers.provider,
      rubxToken.address,
      consumerVehicleAccount.address,
      fuelStationShop.address,
      1_000_00,
    );
    await fuelStationShop
      .connect(consumerVehicleAccount)
      .purchaseFuel(
        fuelRegistry.DIESEL(),
        consumerVehicleAccount.address,
        fuelStationShop.address,
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
      await fuelRegistry.balanceOf(
        consumerVehicleAccount.address,
        fuelRegistry.DIESEL(),
      ),
    ).to.be.equal(18);

    // Gas station should receive RUBX tokens and spend diesel tokens
    expect(await rubxToken.balanceOf(fuelStationShop.address)).to.be.equal(
      1_000_00,
    );

    expect(
      await fuelRegistry.balanceOf(
        fuelStationShop.address,
        fuelRegistry.DIESEL(),
      ),
    ).to.be.equal(99_982);
  });
});
