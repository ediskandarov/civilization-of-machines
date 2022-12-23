import { ethers } from "hardhat";
import { expect } from "chai";

describe("GasStationSKU", () => {
  it("Should transfer gas though delivery chain", async () => {
    const [
      gasFactoryAccount,
      fuelTankerAccount,
      gasStationAccount,
      consumerVehicleAccount,
    ] = await ethers.getSigners();
    const GasStationSKU = await ethers.getContractFactory("GasStationSKU");
    const gasStationSKU = await GasStationSKU.connect(
      gasFactoryAccount,
    ).deploy();

    // Gas factory digital twin produced 1 million liters of `AI-95-K5` gas by minting the token
    await gasStationSKU.mint(
      gasFactoryAccount.address,
      gasStationSKU.AI_95_K5(),
      1_000_000,
      [],
    );

    // Gas factory digital twin transferred 30 000 liters of `AI-95-K5` to fuel tanker
    await gasStationSKU.safeTransferFrom(
      gasFactoryAccount.address,
      fuelTankerAccount.address,
      gasStationSKU.AI_95_K5(),
      30_000,
      [],
    );

    // Fuel tank digital twin transferred gas in tank to the gas station
    // Now, gas is available to purchase
    await gasStationSKU
      .connect(fuelTankerAccount)
      .safeTransferFrom(
        fuelTankerAccount.address,
        gasStationAccount.address,
        gasStationSKU.AI_95_K5(),
        gasStationSKU.balanceOf(
          fuelTankerAccount.address,
          gasStationSKU.AI_95_K5(),
        ),
        [],
      );

    const balances = (
      await gasStationSKU.balanceOfBatch(
        [
          gasFactoryAccount.address,
          fuelTankerAccount.address,
          gasStationAccount.address,
        ],
        [
          await gasStationSKU.AI_95_K5(),
          await gasStationSKU.AI_95_K5(),
          await gasStationSKU.AI_95_K5(),
        ],
      )
    ).map((balance) => balance.toNumber());

    expect(balances).to.be.deep.equal([970_000, 0, 30_000]);
  });
});
