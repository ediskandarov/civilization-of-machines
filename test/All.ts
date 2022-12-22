import { ethers } from "hardhat";
import { assert } from "chai";
import { getAddress } from "@ethersproject/address";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  deployEnsResolverFixture,
  setAddressFunc,
} from "./deploy-ens-resolver.fixture";

describe("All Tests", () => {
  let setAddress: setAddressFunc;

  beforeEach(async () => {
    const ensItems = await deployEnsResolverFixture();
    setAddress = ensItems.setAddress;
  });

  describe("ENS", () => {
    it("Should resolve address", async () => {
      // @todo file a ticket to hardhat
      // somehow loadFixture breaks ethers.provider.network
      // const { setAddress } = await loadFixture(deployEnsResolverFixture)

      const domain = "random.eth";

      // We will use the second account as a target domain address
      const secondAccount = ethers.provider.getSigner(1);
      const secondAccountAddress = await secondAccount.getAddress();

      await setAddress(domain, secondAccountAddress);

      const resolvedAddress = await ethers.provider.resolveName(domain);

      if (!resolvedAddress) assert(false, "Resolved address returned null");

      assert.strictEqual(
        getAddress(secondAccountAddress),
        getAddress(resolvedAddress),
      );
    });

    it("Should resolve address one more time", async () => {
      const domain = "random-2.eth";

      // We will use the second account as a target domain address
      const secondAccount = ethers.provider.getSigner(3);
      const secondAccountAddress = await secondAccount.getAddress();

      await setAddress(domain, secondAccountAddress);

      const resolvedAddress = await ethers.provider.resolveName(domain);

      if (!resolvedAddress) assert(false, "Resolved address returned null");

      assert.strictEqual(
        getAddress(secondAccountAddress),
        getAddress(resolvedAddress),
      );
    });
  });

  describe("TollPass", () => {
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
      // if (!vehicleAddress) assert(false, "Resolved address returned null");
      // // @todo double check on metadata URI
      // await tollPass.sendItem(vehicleAddress, 'https://example.com/toll-pass/metadata')
    });
  });
});
