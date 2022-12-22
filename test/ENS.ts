import { ethers } from "hardhat";
import { assert } from "chai";
import { getAddress } from "@ethersproject/address";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployEnsResolverFixture } from './deploy-ens-resolver.fixture'

describe("ENS", () => {
  it("Should resolve address", async () => {
    const { setAddress } = await loadFixture(deployEnsResolverFixture)

    const domain = "random.eth";

    // We will use the second account as a target domain address
    const secondAccount = ethers.provider.getSigner(1);
    const secondAccountAddress = await secondAccount.getAddress();

    await setAddress(domain, secondAccountAddress)

    const resolvedAddress = await ethers.provider.resolveName(domain);

    if (!resolvedAddress) assert(false, "Resolved address returned null");

    assert.strictEqual(
      getAddress(secondAccountAddress),
      getAddress(resolvedAddress),
    );
  });
});
