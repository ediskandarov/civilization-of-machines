import { ethers } from "hardhat";
import { expect } from "chai";

describe("FuelRegistry", () => {
  it("Should transfer fuel though the delivery chain", async () => {
    const [fuelFactoryAccount, fuelTankerAccount, fuelStationAccount] =
      await ethers.getSigners();
    const FuelRegistry = await ethers.getContractFactory("FuelRegistry");
    const fuelRegistry = await FuelRegistry.connect(
      fuelFactoryAccount,
    ).deploy();

    // Gas factory digital twin produced 1 million liters of `AI-95-K5` gas by minting the token
    await fuelRegistry.mint(
      fuelFactoryAccount.address,
      fuelRegistry.AI_95_K5(),
      1_000_000,
      [],
    );

    // Gas factory digital twin transferred 30 000 liters of `AI-95-K5` to fuel tanker
    await fuelRegistry.safeTransferFrom(
      fuelFactoryAccount.address,
      fuelTankerAccount.address,
      fuelRegistry.AI_95_K5(),
      30_000,
      [],
    );

    // Fuel tank digital twin transferred gas in tank to the gas station
    // Now, gas is available to purchase
    await fuelRegistry
      .connect(fuelTankerAccount)
      .safeTransferFrom(
        fuelTankerAccount.address,
        fuelStationAccount.address,
        fuelRegistry.AI_95_K5(),
        fuelRegistry.balanceOf(
          fuelTankerAccount.address,
          fuelRegistry.AI_95_K5(),
        ),
        [],
      );

    const balances = (
      await fuelRegistry.balanceOfBatch(
        [
          fuelFactoryAccount.address,
          fuelTankerAccount.address,
          fuelStationAccount.address,
        ],
        [
          await fuelRegistry.AI_95_K5(),
          await fuelRegistry.AI_95_K5(),
          await fuelRegistry.AI_95_K5(),
        ],
      )
    ).map((balance) => balance.toNumber());

    expect(balances).to.be.deep.equal([970_000, 0, 30_000]);
  });
});
