import { ethers } from "hardhat";
import { assert } from "chai";
import { getAddress } from "@ethersproject/address";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  deployEnsResolverFixture,
  setAddressFunc,
} from "./deploy-ens-resolver.fixture";

describe("TollPass", () => {
  let setAddress: setAddressFunc;

  beforeEach(async () => {
    const ensItems = await deployEnsResolverFixture();
    setAddress = ensItems.setAddress;
  });

  it("Should give toll pass to vehicle", async () => {
    const plateNumber = "A592CY02RUS";
    const plateNumberDomain = `${plateNumber}.eth`;

    // We will use the first account as owner for TollPass contract
    const tollPassOwnerAccount = ethers.provider.getSigner(0);
    const vehicleAccount = ethers.provider.getSigner(1);

    await setAddress(plateNumberDomain, await vehicleAccount.getAddress());

    const TollPass = await ethers.getContractFactory("TollPass");
    const tollPass = await TollPass.connect(tollPassOwnerAccount).deploy();

    const vehicleAddress = await ethers.provider.resolveName("random.eth");
    if (!vehicleAddress) assert(false, "Resolved address returned null");

    // @todo double check on metadata URI
    const tokenId = await tollPass.sendItem(
      vehicleAddress,
      "https://example.com/toll-pass/metadata",
    );
  });
});
